// src // gemini.ts 제미나이 SDK 초기화 및 채팅 세션 생성 (일반 채팅 / 일기 모드)
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const MODEL = "gemini-3.6-flash";

// 일기 모드에서 세션 레벨로 주입되는 시스템 프롬프트
const DIARY_SYSTEM_PROMPT =
  "너는 따뜻한 감성 심리 상담사야. 사용자의 일기 내용을 읽고 먼저 진심으로 공감해 준 뒤, " +
  "위로의 말과 오늘 하루를 잘 마무리할 수 있는 다정한 조언을 건네줘. " +
  "마지막 줄에는 오늘 하루를 따뜻한 한 문장으로 요약해 줘.";

// 일반 채팅 세션 (새 대화 버튼에서 재사용)
export const createChatSession = () =>
  ai.chats.create({
    model: MODEL,
    config: { thinkingConfig: { thinkingBudget: 0 } },
  });

// 일기 모드 세션 — systemInstruction 으로 상담사 페르소나 주입
export const createDiarySession = () =>
  ai.chats.create({
    model: MODEL,
    config: {
      systemInstruction: DIARY_SYSTEM_PROMPT,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
