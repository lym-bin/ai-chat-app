// src // App.tsx 전체 챗봇 레이아웃과 메시지 상태 (messages, input, loading )을 관리하는 메인 컴포넌트

import React, { useState } from "react";
import styled from "styled-components";
import ChatHeader from "./components/ChatHeader";
import { chatSession } from "./gemini";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    // 빈 봇 메시지를 미리 추가 → 이후 청크로 채워나감
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    try {
      const stream = await chatSession.sendMessageStream({
        message: userMessage,
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
      console.error(error);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          sender: "bot",
          text: "오류가 발생했습니다. API 키를 확인해주세요.",
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ChatHeader />
      <MessageList>
        {messages.length === 0 && (
          <EmptyMessage>무엇이든 물어보세요! 대화가 시작됩니다.</EmptyMessage>
        )}
        {messages.map((msg, index) => (
          <MessageBubble key={index} $sender={msg.sender}>
            {msg.text}
          </MessageBubble>
        ))}
        {loading && (
          <MessageBubble $sender="bot">
            AI가 답변을 작성 중입니다...
          </MessageBubble>
        )}
      </MessageList>
      <InputForm onSubmit={handleSend}>
        <InputField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton type="submit" disabled={loading}>
          전송
        </SendButton>
      </InputForm>
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
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #2563eb;
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
