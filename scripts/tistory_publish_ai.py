# -*- coding: utf-8 -*-
# 자동화6 → 티스토리(eunho0927) "AI·테크" 카테고리 발행 어댑터
#
# 자동화 폴더의 tistory_auto_publish_v22.py 엔진(TistoryPublisher/MarkdownToHTML/
# UnsplashImageFetcher)을 임포트해 재사용한다. 그쪽의 글 생성 프롬프트(1인칭 경험 말투)와
# 금융 설정은 사용하지 않는다 — 발행 파이프라인만 빌려 쓴다.
# Google Indexing API는 일반 블로그에 무효(자동화 폴더 4/1 실측)라 호출하지 않는다.
#
# 사전 조건:
#   1) eunho0927 블로그에 "AI·테크" 카테고리가 만들어져 있어야 함 (관리자 > 카테고리)
#   2) python "C:/Users/PC/Documents/자동화/launch_chrome_debug.py" 로 크롬 디버그 모드 실행
#   3) 크롬에서 tistory.com 로그인 (스크립트가 최대 300초 대기)
#
# 사용법 (자동화6 루트에서):
#   PYTHONUTF8=1 python -u scripts/tistory_publish_ai.py            # tistory-ready 전체 발행
#   PYTHONUTF8=1 python -u scripts/tistory_publish_ai.py --dry-run  # 발행 없이 대상/예약일 확인
#   PYTHONUTF8=1 python -u scripts/tistory_publish_ai.py --only 키워드  # 파일명 부분일치만
#   PYTHONUTF8=1 python -u scripts/tistory_publish_ai.py --manual   # 발행 버튼만 수동
#
# 규칙 (자동화 폴더 하네스에서 배운 것):
#   - PYTHONUTF8=1 필수 (em dash cp949 오류 방지)
#   - 발행 성공한 md는 즉시 published/로 이동 (중복 발행 방지)
#   - 파일명 YYYY-MM-DD_slug.md → 해당일 08:30 예약 발행 / 날짜 없으면 즉시 발행

import os
import re
import sys
import glob
import time
import shutil
import random
import importlib.util
from datetime import datetime

V22_PATH = r"C:\Users\PC\Documents\자동화\tistory_auto_publish_v22.py"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(ROOT, "content", "tistory-ready")
PUBLISHED_DIR = os.path.join(POSTS_DIR, "published")

CONFIG = {
    "blog_url": "https://eunho0927.tistory.com",
    "category": "AI·테크",          # 티스토리 관리자에 이 이름 그대로 존재해야 함
    "home_topic": "IT 인터넷",
    "posts_dir": POSTS_DIR,
    "max_images": 1,
    "publish_hour": 8,
    "publish_minute": 30,
    "figure_style": "text-align:center;margin:18px 0;",
    "figcaption_style": "font-size:13px;color:#aaa;margin-top:5px;",
    "img_border_radius": "10px",
    "image_keywords": {
        "코딩": ["coding laptop dark theme", "developer workspace night", "code editor split screen"],
        "AI": ["AI interface dark screen", "chatbot conversation screen", "machine learning dashboard"],
        "검색": ["search engine browser screen", "web research laptop", "information browsing desk"],
        "LLM": ["GPU server rack", "graphics card closeup", "workstation setup dual monitor"],
        "노코드": ["drag and drop interface", "web app builder screen", "startup founder laptop"],
        "무료": ["productivity apps laptop", "software tools desk", "app icons screen"],
        "도구": ["productivity apps laptop", "software tools desk", "tech workspace minimal"],
    },
    "default_keywords": ["laptop code screen", "tech desk setup minimal", "software interface dark"],
}


def load_v22():
    spec = importlib.util.spec_from_file_location("tistory_v22", V22_PATH)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _normalize_cat(s):
    """카테고리명 비교용 정규화: 앞의 '- ' 제거, 가운뎃점 이형(·ㆍ・•) 통일, 공백 제거."""
    s = re.sub(r"^-\s*", "", s.strip())
    for dot in "ㆍ・•":
        s = s.replace(dot, "·")
    return s.replace(" ", "")


def resolve_category(publisher, driver):
    """에디터의 카테고리 드롭다운에서 실제 옵션을 읽어 CONFIG 카테고리와 매칭.
    가운뎃점/공백 차이는 허용하고, 화면에 있는 정확한 문자열로 publisher.category를 교체.
    매칭 실패 시 False (발행 중단용)."""
    target = _normalize_cat(CONFIG["category"])
    driver.get(CONFIG["blog_url"] + "/manage/newpost")
    time.sleep(3)
    try:
        driver.switch_to.alert.dismiss()
        time.sleep(2)
    except Exception:
        pass
    time.sleep(4)
    driver.execute_script("var btn = document.querySelector('.btn-category'); if (btn) btn.click();")
    time.sleep(2)
    options = driver.execute_script(
        "return Array.from(document.querySelectorAll('span.mce-text')).map(function(s){return s.textContent.trim();});"
    ) or []
    for opt in options:
        if _normalize_cat(opt) == target:
            exact = re.sub(r"^-\s*", "", opt.strip())
            if exact != CONFIG["category"]:
                print("  카테고리 자동 매칭: '" + CONFIG["category"] + "' → 화면 표기 '" + exact + "'")
            publisher.category = exact
            return True
    print("  ❌ 카테고리 '" + CONFIG["category"] + "' 를 드롭다운에서 못 찾음.")
    print("     드롭다운 옵션: " + " | ".join(o for o in options if o))
    print("     관리자 > 카테고리에서 이름 확인 후 재실행하세요.")
    return False


def main():
    dry_run = "--dry-run" in sys.argv
    only = None
    if "--only" in sys.argv:
        i = sys.argv.index("--only")
        if i + 1 < len(sys.argv):
            only = sys.argv[i + 1]

    v22 = load_v22()
    if "--manual" in sys.argv:
        v22.MANUAL_PUBLISH = True

    os.makedirs(POSTS_DIR, exist_ok=True)
    os.makedirs(PUBLISHED_DIR, exist_ok=True)
    md_files = sorted(glob.glob(os.path.join(POSTS_DIR, "*.md")))
    if only:
        md_files = [f for f in md_files if only in os.path.basename(f)]
    if not md_files:
        print("발행할 md 없음: " + POSTS_DIR)
        return

    print("=" * 60)
    print("  자동화6 티스토리 발행 (eunho0927 / AI·테크)")
    print("  대상 " + str(len(md_files)) + "편" + (" [DRY-RUN]" if dry_run else ""))
    print("=" * 60)

    plans = []
    for md_file in md_files:
        fn = os.path.basename(md_file)
        title = v22.extract_title_from_md(md_file)
        m = re.match(r"(\d{4}-\d{2}-\d{2})_", fn)
        sched = None
        if m:
            sched = datetime.strptime(m.group(1), "%Y-%m-%d").replace(
                hour=CONFIG["publish_hour"], minute=CONFIG["publish_minute"])
            if sched <= datetime.now():
                sched = None  # 과거 예약은 즉시 발행으로 전환
        plans.append((md_file, title, sched))
        print("  - " + fn)
        print("      제목: " + title)
        print("      발행: " + (sched.strftime("%Y-%m-%d %H:%M 예약") if sched else "즉시"))

    if dry_run:
        return

    unsplash = v22.UnsplashImageFetcher(v22.UNSPLASH_ACCESS_KEY)
    converter = v22.MarkdownToHTML(unsplash, CONFIG)
    publisher = v22.TistoryPublisher(CONFIG)

    print("\nChrome 디버그 세션 연결 중...")
    if not publisher.connect():
        print("연결 실패 — launch_chrome_debug.py 실행 + 티스토리 로그인 확인")
        return

    print("\n카테고리 확인 중...")
    if not resolve_category(publisher, publisher.driver):
        return

    ok = 0
    for md_file, title, sched in plans:
        print("-" * 50)
        print("  file: " + os.path.basename(md_file))
        with open(md_file, "r", encoding="utf-8") as f:
            md = f.read()

        desc, tags = converter.extract_metadata(md)
        ikw = v22.get_image_keywords(title, CONFIG)
        html = converter.convert(md, ikw)

        thumb_path = None
        if converter.first_image_url:
            thumb_path = unsplash.download(converter.first_image_url)
            if thumb_path:
                thumb_path = os.path.abspath(thumb_path)

        if publisher.publish(title=title, html_content=html, tags=tags,
                             scheduled_date=sched, thumbnail_path=thumb_path):
            ok += 1
            # 중복 발행 방지: 성공 즉시 published/로 이동
            shutil.move(md_file, os.path.join(PUBLISHED_DIR, os.path.basename(md_file)))
            print("  → published/로 이동")

        if thumb_path and os.path.exists(thumb_path):
            try:
                os.unlink(thumb_path)
            except Exception:
                pass

        wait = random.randint(30, 90)
        print("  " + str(wait) + "초 대기...")
        time.sleep(wait)

    print("\n" + "=" * 60)
    print("  완료: " + str(ok) + "/" + str(len(plans)) + " 발행")
    print("  ⚠️ 태그 자동 입력은 간헐 실패 이력 있음 — 발행 글에서 태그 확인 권장")
    print("=" * 60)


if __name__ == "__main__":
    main()
