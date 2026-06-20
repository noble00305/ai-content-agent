import * as fs from "fs";
import * as path from "path";
import { Action, ApprovalRequest } from "../types";
import { v4 } from "../utils/id";

const QUEUE_DIR = path.join(process.cwd(), "data", "queue");
const QUEUE_FILE = path.join(QUEUE_DIR, "pending.json");

function readQueue(): ApprovalRequest[] {
  try {
    return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeQueue(queue: ApprovalRequest[]): void {
  fs.mkdirSync(QUEUE_DIR, { recursive: true });
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

export function addToQueue(action: Action): ApprovalRequest {
  const queue = readQueue();

  const request: ApprovalRequest = {
    id: v4(),
    action,
    createdAt: new Date().toISOString(),
    status: "waiting",
  };

  queue.push(request);
  writeQueue(queue);
  console.log(`[Guardian] 승인 큐 추가: ${request.id}`);
  return request;
}

export function approveRequest(requestId: string): boolean {
  const queue = readQueue();
  const req = queue.find((r) => r.id === requestId);
  if (!req) return false;

  req.status = "approved";
  req.decidedAt = new Date().toISOString();
  req.action.status = "approved";
  writeQueue(queue);
  return true;
}

export function rejectRequest(requestId: string, reason?: string): boolean {
  const queue = readQueue();
  const req = queue.find((r) => r.id === requestId);
  if (!req) return false;

  req.status = "rejected";
  req.decidedAt = new Date().toISOString();
  req.reason = reason;
  req.action.status = "rejected";
  writeQueue(queue);
  return true;
}

export function getPendingRequests(): ApprovalRequest[] {
  return readQueue().filter((r) => r.status === "waiting");
}

export function getAllRequests(): ApprovalRequest[] {
  return readQueue();
}
