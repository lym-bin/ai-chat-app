// src // App.tsx 챗봇 상태(messages, input, loading)와 핸들러를 관리하는 메인 컴포넌트

import { useState, useRef } from "react";
import type { FormEvent } from "react";
import styled from "styled-components";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { createChatSession } from "./gemini";
import type { Message } from "./types/message";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const stoppedRef = useRef(false);
  const chatRef = useRef(createChatSession());

  const handleStop = () => {
    stoppedRef.current = true;
    abortRef.current?.abort();
    setLoading(false);
  };

  const handleNewChat = () => {
    stoppedRef.current = true;
    abortRef.current?.abort();
    chatRef.current = createChatSession();
    setMessages([]);
    setInput("");
    setLoading(false);
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
      { sender: "bot", text: "" },
    ]);
    setLoading(true);

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
        // 사용자가 직접 중지 → 지금까지 받은 답변 그대로 유지
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
      <MessageList messages={messages} loading={loading} />
      <ChatInput
        input={input}
        loading={loading}
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
`;
