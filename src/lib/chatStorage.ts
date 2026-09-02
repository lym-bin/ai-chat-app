// src // lib // chatStorage.ts 일반 채팅 대화 내역의 localStorage 저장/불러오기
import type { Message } from "../types/message";

const KEY = "ai-talk-chat";

export function loadChatMessages(): Message[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveChatMessages(messages: Message[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(messages));
  } catch {
    // 저장 실패는 무시
  }
}
