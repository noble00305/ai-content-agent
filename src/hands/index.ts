import { Action, CreatePostParams } from "../types";
import { writePost } from "./content-writer";
import { publishToMdx } from "./publisher";

export async function executeAction(action: Action): Promise<void> {
  console.log(`[Hands] 액션 실행: ${action.type} (ID: ${action.id})`);

  switch (action.type) {
    case "create_post": {
      const params = action.params as CreatePostParams;
      const post = await writePost(params);
      publishToMdx(post);
      action.status = "completed";
      break;
    }
    case "optimize_post": {
      console.log("[Hands] optimize_post: 미구현 (GA 연동 후 구현 예정)");
      action.status = "failed";
      break;
    }
    default:
      console.log(`[Hands] 미지원 액션 타입: ${action.type}`);
      action.status = "failed";
  }
}

export async function executeActions(actions: Action[]): Promise<void> {
  for (const action of actions) {
    if (action.status !== "approved" && action.status !== "pending") continue;
    try {
      await executeAction(action);
    } catch (err) {
      console.error(`[Hands] 액션 실패 (${action.id}):`, err);
      action.status = "failed";
    }
  }
}
