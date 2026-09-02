// src // App.tsx 챗봇 상태(모드별 messages, input, loading)와 핸들러를 관리하는 메인 컴포넌트

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import type { Content } from "@google/genai";
import styled from "styled-components";
import ChatHeader from "./components/ChatHeader";
import ModeTabs from "./components/ModeTabs";
import DiaryHistory from "./components/DiaryHistory";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { createChatSession, createDiarySession } from "./gemini";
import { loadDiaryEntries, saveDiaryEntries } from "./lib/diaryStorage";
import { loadChatMessages, saveChatMessages } from "./lib/chatStorage";
import type { ChatMode, DiaryEntry, Message } from "./types/message";

// 저장된 메시지를 Gemini 대화 히스토리 형태로 변환
function messagesToHistory(messages: Message[]): Content[] {
  const history: Content[] = messages
    .filter((m) => m.text.trim() && !m.error)
    .map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));
  // user 턴으로 끝나면 다음 전송이 꼬이므로 잘라냄
  while (history.length > 0 && history[history.length - 1].role === "user") {
    history.pop();
  }
  return history;
}

export default function App() {
  const [mode, setMode] = useState<ChatMode>("chat");
  const [input, setInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>(loadChatMessages);
  const [diaryMessages, setDiaryMessages] = useState<Message[]>([]);
  const [diaryEntries, setDiaryEntries] =
    useState<DiaryEntry[]>(loadDiaryEntries);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const stoppedRef = useRef(false);
  const chatRef = useRef(
    createChatSession(messagesToHistory(loadChatMessages())),
  );
  const diaryRef = useRef(createDiarySession());

  const isDiary = mode === "diary";
  const messages = isDiary ? diaryMessages : chatMessages;
  const setMessages = isDiary ? setDiaryMessages : setChatMessages;
  const sessionRef = isDiary ? diaryRef : chatRef;

  // 일반 채팅 내역 저장 (스트리밍 끝난 뒤에만)
  useEffect(() => {
    if (!loading) saveChatMessages(chatMessages);
  }, [chatMessages, loading]);

  const handleModeChange = (next: ChatMode) => {
    if (next === mode || loading) return;
    stoppedRef.current = true;
    abortRef.current?.abort();
    setLoading(false);
    setInput("");
    setMode(next);
  };

  const handleStop = () => {
    stoppedRef.current = true;
    abortRef.current?.abort();
    setLoading(false);
    // 첫 청크 도착 전에 중지하면 빈 봇 말풍선이 남으므로 제거
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.sender === "bot" && last.text === "") {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const handleNewChat = () => {
    stoppedRef.current = true;
    abortRef.current?.abort();
    setLoading(false);
    setInput("");
    if (isDiary) {
      diaryRef.current = createDiarySession();
      setDiaryMessages([]);
    } else {
      chatRef.current = createChatSession();
      setChatMessages([]);
    }
  };

  const runSend = async (userMessage: string) => {
    const diaryMode = isDiary;
    const session = sessionRef.current;
    const applyMessages = setMessages;

    applyMessages((prev) => [...prev, { sender: "bot", text: "" }]);
    setLoading(true);

    stoppedRef.current = false;
    const controller = new AbortController();
    abortRef.current = controller;

    let botText = "";

    try {
      const stream = await session.sendMessageStream({
        message: userMessage,
        config: { abortSignal: controller.signal },
      });

      for await (const chunk of stream) {
        if (stoppedRef.current) break;
        const piece = chunk.text ?? "";
        if (!piece) continue;
        botText += piece;
        applyMessages((prev) => {
          if (prev.length === 0) return prev;
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            text: next[next.length - 1].text + piece,
          };
          return next;
        });
      }

      // 일기 모드: 완성된 일기 + 위로 답변을 날짜별로 저장
      if (diaryMode && !stoppedRef.current && botText.trim()) {
        const entry: DiaryEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          entry: userMessage,
          reply: botText,
        };
        setDiaryEntries((prev) => {
          const nextEntries = [entry, ...prev];
          saveDiaryEntries(nextEntries);
          return nextEntries;
        });
      }
    } catch (error) {
      if (stoppedRef.current) {
        // 사용자가 직접 중지 → 지금까지 받은 답변 그대로 유지
      } else {
        console.error(error);
        const raw = error instanceof Error ? error.message : String(error);
        let text = "오류가 발생했어요. 잠시 후 다시 시도해주세요.";
        if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED")) {
          text =
            "무료 사용량 한도를 넘었어요. 잠시 뒤 또는 내일 다시 시도해주세요.";
        } else if (
          raw.includes("401") ||
          raw.includes("403") ||
          raw.includes("API key")
        ) {
          text = "API 키에 문제가 있어요. .env 파일의 키를 확인해주세요.";
        } else if (raw.includes("404")) {
          text = "모델을 찾을 수 없어요. gemini.ts의 모델명을 확인해주세요.";
        }
        applyMessages((prev) => {
          if (prev.length === 0) return prev;
          const next = [...prev];
          next[next.length - 1] = { sender: "bot", text, error: true };
          return next;
        });
      }
    } finally {
      setLoading(false);
      // 이 요청의 컨트롤러일 때만 정리 (연속 전송 시 새 컨트롤러 덮어쓰기 방지)
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    runSend(text);
  };

  const handleRetry = () => {
    if (loading) return;
    const lastUser = [...messages].reverse().find((m) => m.sender === "user");
    if (!lastUser) return;
    // 마지막 에러 답변 제거 후 같은 질문으로 재전송
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last && last.sender === "bot" && last.error) next.pop();
      return next;
    });
    runSend(lastUser.text);
  };

  return (
    <Container>
      <ChatHeader onNewChat={handleNewChat} />
      <ModeTabs mode={mode} onChange={handleModeChange} />
      {isDiary && <DiaryHistory entries={diaryEntries} />}
      <MessageList messages={messages} loading={loading} onRetry={handleRetry} />
      <ChatInput
        input={input}
        loading={loading}
        placeholder={
          isDiary ? "오늘 하루는 어땠나요?" : "메시지를 입력하세요..."
        }
        onChange={setInput}
        onSubmit={handleSend}
        onStop={handleStop}
      />
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  height: 85vh;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #374151;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    max-width: 100%;
    height: 100dvh;
    margin: 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
`;
