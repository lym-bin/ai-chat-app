export interface Message {
  sender: "user" | "bot";
  text: string;
  error?: boolean;
}

export type ChatMode = "chat" | "diary";

export interface DiaryEntry {
  id: string;
  date: string; // ISO 문자열
  entry: string; // 사용자가 쓴 일기
  reply: string; // AI의 위로 답변
}
