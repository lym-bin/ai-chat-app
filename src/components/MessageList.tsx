// src // components // MessageList.tsx 메시지 목록 + 자동 스크롤 영역

import { Fragment, useEffect, useRef } from "react";
import styled from "styled-components";
import type { Message } from "../types/message";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
  loading: boolean;
  onRetry: () => void;
}

export default function MessageList({ messages, loading, onRetry }: Props) {
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
        const showRetry = isLast && msg.error === true && !loading;
        return (
          <Fragment key={index}>
            <MessageBubble
              sender={msg.sender}
              text={msg.text}
              showDots={showDots}
            />
            {showRetry && (
              <RetryButton type="button" onClick={onRetry}>
                다시 시도
              </RetryButton>
            )}
          </Fragment>
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

const RetryButton = styled.button`
  align-self: flex-start;
  margin-top: -4px;
  padding: 6px 12px;
  font-size: 13px;
  color: #2563eb;
  background: #ffffff;
  border: 1px solid #2563eb;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #eff6ff;
  }
`;
