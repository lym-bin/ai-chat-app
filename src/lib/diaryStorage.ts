// src // lib // diaryStorage.ts 일기 기록의 localStorage 저장/불러오기
import type { DiaryEntry } from "../types/message";

const KEY = "ai-talk-diary";

export function loadDiaryEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // 저장소 접근 불가(프라이빗 모드 등) 시 빈 배열
    return [];
  }
}

export function saveDiaryEntries(entries: DiaryEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // 저장 실패는 조용히 무시
  }
}
