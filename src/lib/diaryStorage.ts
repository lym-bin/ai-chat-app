// src // lib // diaryStorage.ts 일기 기록의 localStorage 저장/불러오기
import type { DiaryEntry } from "../types/message";

const KEY = "ai-talk-diary";

export function loadDiaryEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // 빈 배열 리턴
    return [];
  }
}

export function saveDiaryEntries(entries: DiaryEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // false ignore
  }
}
