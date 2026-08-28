// src // App.tsx 전체 챗봇 레이아웃과 메시지 상태 (messages, input, loading )을 관리하는 메인 컴포넌트

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ChatHeader from "./components/ChatHeader";
import { createChatSession } from "./gemini";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const stoppedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef(createChatSession());

  useEffect(() => {
    // 1. 'bahavior' -> 'behavior' 오타 수정
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStop = () => {
    // 스트리밍 중에 "새 대화"를 누르면, 진행중인 응답이 계속 빈배열에 집어넣고 먼저 끊어줌
    stoppedRef.current = true;
    abortRef.current?.abort();
    setLoading(false);
  };
  const handleNewChat = () => {
    stoppedRef.current = true;
    abortRef.current?.abort();
    // Gemini 채팅 세션이 내부에 대화 히스토리를 가지고 있음
    // 새 인스턴스로 갈아 끼워야 AI가 이전 맥락을 잊고 처음으로 돌아감
    chatRef.current = createChatSession();
    // 화면 상태 초기화
    setMessages([]);
    setInput("");
    setLoading(false);
  };
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    // 빈 봇 메시지를 미리 추가 → 이후 청크로 채워나감
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
    stoppedRef.current = false;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const stream = await chatRef.current.sendMessageStream({
        message: userMessage,
        config: { abortSignal: controller.signal },
      });

      for await (const chunk of stream) {
        const piece = chunk.text ?? "";
        if (!piece) continue;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            text: next[next.length - 1].text + piece,
          };
          return next;
        });
      }
    } catch (error) {
      if (stoppedRef.current) {
        // 사용자가 직접 중지 -> 지금 까지 받은 답변 그대로 유지
      } else {
        console.error(error);
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            sender: "bot",
            text: "오류가 발생했습니다. API 키를 확인해주세요.",
          };
          return next;
        });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <Container>
      <ChatHeader onNewChat={handleNewChat} />
      <MessageList>
        {messages.length === 0 && (
          <EmptyMessage>무엇이든 물어보세요! 대화가 시작됩니다.</EmptyMessage>
        )}
        {/* 2. map 내부 구문 정리 및 return 추가, 하단 스크롤용 div 위치 이동 */}
        {messages.map((msg, index) => {
          const isLast = index === messages.length - 1;
          const showDots =
            isLast && msg.sender === "bot" && msg.text === "" && loading;

          return (
            <MessageBubble key={index} $sender={msg.sender}>
              {showDots ? (
                <TypingDots>
                  <span />
                  <span />
                  <span />
                </TypingDots>
              ) : (
                msg.text
              )}
            </MessageBubble>
          );
        })}
        <div ref={bottomRef} />
      </MessageList>
      <InputForm onSubmit={handleSend}>
        <InputField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={loading}
        />
        {loading ? (
          <SendButton type="button" onClick={handleStop}>
            중지
          </SendButton>
        ) : (
          <SendButton type="submit">전송</SendButton>
        )}
      </InputForm>
    </Container>
  );
}

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 0;

  span {
    width: 6px;
    height: 6px;
    background-color: #6b7280;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  span:nth-child(1) {
    animation-delay: -0.32s;
  }
  span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

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
`;

const MessageList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f9fafb;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  margin-top: 40px;
  font-size: 14px;
`;

const MessageBubble = styled.div<{ $sender: "user" | "bot" }>`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  font-size: 14px;
  align-self: ${({ $sender }) =>
    $sender === "user" ? "flex-end" : "flex-start"};
  background: ${({ $sender }) => ($sender === "user" ? "#2563eb" : "#e5e7eb")};
  color: ${({ $sender }) => ($sender === "user" ? "#ffffff" : "#1f2937")};
  word-break: break-word;
  white-space: pre-wrap;
`;

const InputForm = styled.form`
  display: flex;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  background: #ffffff; /* 3. 기본 배경색 수정 */
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #2563eb;
  }
  /* 4. disabled 상태일 때 스타일 분기 처리 */
  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  margin-left: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #1d4ed8;
  }
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;
