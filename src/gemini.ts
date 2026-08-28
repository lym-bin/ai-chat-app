// src // gemini.ts 제미나이 SDK 초기화 및 채팅 세션 생성
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// 세션을 새로 만들 수 있도록 함수로 분리 (새 대화 버튼에서 재사용)
export const createChatSession = () =>
  ai.chats.create({
    model: "gemini-2.5-flash",
  });
