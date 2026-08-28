// src // components // MessageList.tsx 메시지 목록 + 자동 스크롤 영역

import { useEffect, useRef } from "react";
import styled from "styled-components";
import type { Message } from "../types/message";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
  loading: boolean;
}

export default function MessageList({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ListContainer>
      {messages.length === 0 && (
        <EmptyMessage>무엇이든 물어보세요! 대화가 시작됩니다.</EmptyMessage>
      )}
      {messages.map((msg, index) => {
        const isLast = index === messages.length - 1;
        const showDots =
          isLast && msg.sender === "bot" && msg.text === "" && loading;
        return (
          <MessageBubble
            key={index}
            sender={msg.sender}
            text={msg.text}
            showDots={showDots}
          />
        );
      })}
      <div ref={bottomRef} />
    </ListContainer>
  );
}

const ListContainer = styled.div`
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
