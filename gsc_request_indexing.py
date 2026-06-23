# GSC 색인 생성 요청 자동화 (AI Content Agent — Vercel 블로그)
# - Selenium으로 Google Search Console에 접속
# - 검색바에 URL 입력 -> inspect -> "색인 생성 요청" 클릭
# - URL은 src/lib/posts-data.json(발행 글) + 정적 페이지에서 읽음
# - 자동화5(워드프레스) gsc_request_indexing.py 이식. 로그인 Chrome 프로필 공유.
#
# 사전 준비:
#   pip install selenium   (Chrome 설치 필요, chromedriver는 Selenium Manager 자동 처리)
#   최초 1회: 아래 GSC_Automation 프로필로 search.google.com/search-console 에 수동 로그인
#
# 사용법:
#   python gsc_request_indexing.py                # 전체 미요청 URL
#   python gsc_request_indexing.py --dry-run      # 요청 대상 URL 목록만 확인

import os
import sys
import time
import json
from datetime import datetime
from urllib.parse import quote

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# ============================================================
# 설정
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
POSTS_DATA = os.path.join(BASE_DIR, "src", "lib", "posts-data.json")

SITE_URL = "https://ai-content-agent-seven.vercel.app"

BLOG = {
    "site_url": SITE_URL + "/",
    # URL-prefix 속성 기준 resource_id. (도메인 속성이면 GSC에서 실제 URL 확인 후 교체)
    "gsc_base": "https://search.google.com/search-console?resource_id="
    + quote(SITE_URL + "/", safe=""),
}

# 발행 글 외에 색인 요청할 정적 페이지
STATIC_PATHS = ["/", "/about", "/privacy", "/contact"]

RESULT_DIR = os.path.join(BASE_DIR, "indexing_results")
LOG_FILE = os.path.join(RESULT_DIR, f"gsc_request_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")


# ============================================================
# posts-data.json에서 URL 수집
# ============================================================

def fetch_post_urls():
    """posts-data.json(발행 글) + 정적 페이지 URL 추출"""
    urls = [SITE_URL + p for p in STATIC_PATHS]

    if not os.path.exists(POSTS_DATA):
        print(f"  [ERROR] posts-data.json 없음: {POSTS_DATA}")
        print(f"  먼저 `npx tsx scripts/build-posts.ts` 실행 필요")
        return urls

    with open(POSTS_DATA, "r", encoding="utf-8") as f:
        posts = json.load(f)

    for post in posts:
        slug = post.get("slug", "")
        if slug:
            urls.append(f"{SITE_URL}/posts/{slug}")

    # 중복 제거(순서 유지)
    seen = set()
    deduped = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            deduped.append(u)
    return deduped


def get_already_requested():
    """이전 gsc_request 로그에서 성공적으로 요청된 URL 수집"""
    if not os.path.exists(RESULT_DIR):
        return set()
    requested = set()
    for fname in os.listdir(RESULT_DIR):
        if fname.startswith("gsc_request_") and fname.endswith(".json"):
            filepath = os.path.join(RESULT_DIR, fname)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                for entry in data:
                    for url in entry.get("requested", []):
                        requested.add(url)
            except Exception:
                continue
    return requested


# ============================================================
# Chrome 드라이버 생성 (자동화5와 동일 프로필 공유 — 로그인 재사용)
# ============================================================

def create_driver():
    options = webdriver.ChromeOptions()
    gsc_profile_dir = os.path.join(os.path.expanduser("~"), "AppData", "Local", "Google", "Chrome", "GSC_Automation")
    options.add_argument(f"--user-data-dir={gsc_profile_dir}")
    options.add_argument("--profile-directory=Default")
    options.add_argument("--no-first-run")
    options.add_argument("--no-default-browser-check")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])

    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)
    return driver


# ============================================================
# GSC 검색바에서 URL inspect 실행
# ============================================================

def open_gsc_and_login(driver, gsc_base):
    """GSC 메인 페이지 열고 로그인 확인"""
    driver.get(gsc_base)
    try:
        WebDriverWait(driver, 120).until(
            lambda d: "search-console" in d.current_url and "resource_id" in d.current_url
        )
        time.sleep(5)
        print("  GSC 로드 완료!")
        return True
    except TimeoutException:
        print("  [ERROR] GSC 로딩 타임아웃 (로그인 필요할 수 있음)")
        return False


def click_search_button(driver):
    """상단 검색(돋보기) 버튼 클릭"""
    for btn in driver.find_elements(By.TAG_NAME, "button"):
        label = btn.get_attribute("aria-label") or ""
        if btn.is_displayed() and len(label.strip()) <= 4 and len(label.strip()) >= 1:
            try:
                btn.click()
                time.sleep(2)
                inputs = [i for i in driver.find_elements(By.TAG_NAME, "input") if i.is_displayed()]
                if len(inputs) >= 2:
                    return True
            except Exception:
                continue
    return False


def find_url_input(driver):
    """URL 검색 input 필드 찾기"""
    inputs = driver.find_elements(By.TAG_NAME, "input")
    for inp in inputs:
        if inp.is_displayed():
            label = inp.get_attribute("aria-label") or ""
            if "URL" in label or "url" in label:
                return inp
    return None


def inspect_and_request(driver, url, gsc_base, idx, total):
    """URL 하나에 대해 inspect -> 색인 요청"""
    print(f"\n  [{idx}/{total}] {url[:80]}...")

    # 검색바 열기
    if not click_search_button(driver):
        driver.get(gsc_base)
        time.sleep(5)
        if not click_search_button(driver):
            print(f"    -> 검색 버튼 못 찾음")
            return "failed", "search_button_not_found"

    # URL 입력
    url_input = find_url_input(driver)
    if not url_input:
        print(f"    -> URL input 못 찾음")
        return "failed", "input_not_found"

    ActionChains(driver).click(url_input).perform()
    time.sleep(0.5)
    url_input.send_keys(Keys.CONTROL + "a")
    url_input.send_keys(Keys.DELETE)
    time.sleep(0.3)
    url_input.send_keys(url)
    time.sleep(0.5)
    url_input.send_keys(Keys.RETURN)

    # inspect 결과 대기
    inspect_ok = False
    for wait_sec in range(9):  # 최대 45초
        time.sleep(5)
        status = driver.execute_script("""
            let body = document.body.innerText;
            if (body.includes('색인 생성 요청') || body.includes('REQUEST INDEXING')) return 'not_indexed';
            if (body.includes('등록되어 있습니다') || body.includes('is on Google')) return 'indexed';
            if (body.includes('등록되어 있지 않음') || body.includes('not on Google')) return 'not_indexed';
            return 'waiting';
        """)
        if status != "waiting":
            inspect_ok = True
            break

    if not inspect_ok:
        print(f"    -> inspect 결과 타임아웃")
        return "failed", "inspect_timeout"

    # 이미 인덱싱됨
    is_indexed = driver.execute_script("""
        let body = document.body.innerText;
        return body.includes('등록되어 있습니다') || body.includes('is on Google');
    """)
    if is_indexed:
        print(f"    -> 이미 인덱싱됨!")
        return "skipped", "already_indexed"

    # "색인 생성 요청" 버튼 찾기 + 클릭
    request_btn = None

    for xpath in [
        "//span[contains(text(), '색인 생성 요청')]/ancestor::div[@role='button']",
        "//span[contains(text(), 'REQUEST INDEXING')]/ancestor::div[@role='button']",
        "//span[contains(text(), '색인 생성 요청')]/..",
        "//span[contains(text(), 'REQUEST INDEXING')]/..",
        "//*[contains(text(), '색인 생성 요청')]",
        "//*[contains(text(), 'REQUEST INDEXING')]",
    ]:
        try:
            elements = driver.find_elements(By.XPATH, xpath)
            for el in elements:
                if el.is_displayed():
                    request_btn = el
                    break
            if request_btn:
                break
        except Exception:
            continue

    if not request_btn:
        try:
            request_btn = driver.execute_script("""
                let all = document.querySelectorAll('span, div, button');
                for (let el of all) {
                    let t = el.textContent.trim();
                    if ((t === '색인 생성 요청' || t === 'REQUEST INDEXING') && el.offsetParent !== null) {
                        return el;
                    }
                }
                return null;
            """)
        except Exception:
            pass

    if not request_btn:
        print(f"    -> '색인 생성 요청' 버튼 못 찾음")
        try:
            os.makedirs(RESULT_DIR, exist_ok=True)
            driver.save_screenshot(os.path.join(RESULT_DIR, f"nobtn_{idx}.png"))
        except Exception:
            pass
        return "failed", "button_not_found"

    # 클릭
    try:
        driver.execute_script("arguments[0].click();", request_btn)
    except Exception:
        try:
            request_btn.click()
        except Exception:
            ActionChains(driver).click(request_btn).perform()

    print(f"    -> 색인 요청 클릭!")

    # 처리 완료 대기 (최대 2분)
    print(f"    -> 테스트 중... (최대 2분)")
    for wait_sec in range(24):  # 최대 120초
        time.sleep(5)
        status = driver.execute_script(
            "let body = document.body.innerText;"
            # 성공: '색인 생성 요청됨' / '색인 생성이 요청됨' / '색인 생성을 요청함' / Indexing requested
            "if (body.includes('\\uC0C9\\uC778 \\uC0DD\\uC131 \\uC694\\uCCAD\\uB428') || body.includes('\\uC0C9\\uC778 \\uC0DD\\uC131\\uC774 \\uC694\\uCCAD\\uB428') || body.includes('\\uC0C9\\uC778 \\uC0DD\\uC131\\uC744 \\uC694\\uCCAD\\uD568') || body.includes('Indexing requested')) return 'done';"
            # 할당량 초과: '할당량'+('초과' 또는 '내일') 동반, 또는 영문 quota exceeded 명시
            "if ((body.includes('\\uD560\\uB2F9\\uB7C9') && (body.includes('\\uCD08\\uACFC') || body.includes('\\uB0B4\\uC77C'))) || body.includes('exceeded your quota') || body.includes('quota exceeded') || body.includes('Quota exceeded')) return 'quota';"
            "return 'waiting';"
        )
        if status == "done":
            print(f"    -> 색인 요청 완료! ({(wait_sec+1)*5}초)")
            break
        if status == "quota":
            print(f"    -> 할당량 초과 감지! 증거 저장 후 중단.")
            # 진짜 quota인지 오탐인지 다음에 바로 확인할 수 있게 증거 남김
            try:
                os.makedirs(RESULT_DIR, exist_ok=True)
                driver.save_screenshot(os.path.join(RESULT_DIR, f"quota_{idx}.png"))
                body_text = driver.execute_script("return document.body.innerText;")
                k = body_text.find("할당량")
                snippet = body_text[max(0, k - 80):k + 80] if k >= 0 else body_text[:400]
                with open(os.path.join(RESULT_DIR, f"quota_{idx}.txt"), "w", encoding="utf-8") as qf:
                    qf.write(snippet)
                print(f"    -> 증거: quota_{idx}.png / .txt | 할당량 주변 텍스트: {snippet.strip()[:100]}")
            except Exception:
                pass
            return "failed", "quota_exceeded"
    else:
        print(f"    -> 2분 대기 완료 (성공했을 수 있음)")

    # "확인" 버튼 클릭
    time.sleep(1)
    try:
        ok_btn = driver.execute_script("""
            let all = document.querySelectorAll('span, div, button');
            for (let el of all) {
                let t = el.textContent.trim();
                if ((t === '확인' || t === 'OK' || t === 'Got it') && el.offsetParent !== null) {
                    return el;
                }
            }
            return null;
        """)
        if ok_btn:
            driver.execute_script("arguments[0].click();", ok_btn)
            time.sleep(2)
    except Exception:
        pass

    return "requested", None


# ============================================================
# 메인
# ============================================================

def main():
    args = sys.argv[1:]

    dry_run = "--dry-run" in args
    if dry_run:
        args.remove("--dry-run")

    print("=" * 60)
    print("  GSC 색인 생성 요청 자동화 (AI Content Agent)")
    print(f"  대상: {SITE_URL}")
    print("=" * 60)

    # URL 수집
    all_urls = fetch_post_urls()
    already_requested = get_already_requested()
    not_requested = [u for u in all_urls if u not in already_requested]

    print(f"  발행 URL(+정적): {len(all_urls)}개")
    print(f"  이전 요청: {len(already_requested)}개")
    print(f"  대상: {len(not_requested)}개")

    if dry_run:
        print(f"\n  [dry-run] 요청 대상 URL ({len(not_requested)}개):")
        for url in not_requested:
            print(f"    - {url}")
        return

    if not not_requested:
        print("  요청할 URL이 없습니다.")
        return

    # 브라우저 시작
    gsc_base = BLOG["gsc_base"]
    results = {"site": SITE_URL, "requested": [], "failed": [], "skipped": []}
    driver = None

    try:
        driver = create_driver()

        if not open_gsc_and_login(driver, gsc_base):
            return

        total = len(not_requested)
        for i, url in enumerate(not_requested):
            status, reason = inspect_and_request(driver, url, gsc_base, i + 1, total)

            if status == "requested":
                results["requested"].append(url)
            elif status == "skipped":
                results["skipped"].append(url)
            else:
                results["failed"].append({"url": url, "reason": reason})
                if reason == "quota_exceeded":
                    for remaining_url in not_requested[i + 1:]:
                        results["failed"].append({"url": remaining_url, "reason": "quota_exceeded"})
                    print(f"    -> 할당량 초과로 중단 (나머지 {total - i - 1}개 스킵)")
                    break

            time.sleep(2)

    except Exception as e:
        print(f"\n  [ERROR] {e}")

    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass

    # 결과 저장
    os.makedirs(RESULT_DIR, exist_ok=True)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump([results], f, ensure_ascii=False, indent=2)
    print(f"\n  결과 저장: {LOG_FILE}")

    # 요약
    print(f"\n{'='*60}")
    print(f"  요약")
    print(f"{'='*60}")
    print(f"  요청: {len(results['requested'])}개")
    print(f"  실패: {len(results['failed'])}개")
    print(f"  스킵(이미 색인): {len(results['skipped'])}개")


if __name__ == "__main__":
    main()
