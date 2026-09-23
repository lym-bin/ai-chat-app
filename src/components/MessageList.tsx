// src // components // MessageList.tsx 메시지 목록 + 자동 스크롤 영역

import { Fragment, useEffect, useRef } from "react";
import styled from "styled-components";
import type { Message } from "../types/message";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
  loading: boolean;
  onRetry: () => void;
  suggestions: string[];
  onSelectSuggestion: (text: string) => void;
}

export default function MessageList({
  messages,
  loading,
  onRetry,
  suggestions,
  onSelectSuggestion,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ListContainer>
      {messages.length === 0 && (
        <EmptyState>
          <EmptyMessage>무엇이든 물어보세요! 대화가 시작됩니다.</EmptyMessage>
          <ChipRow>
            {suggestions.map((text) => (
              <Chip
                key={text}
                type="button"
                onClick={() => onSelectSuggestion(text)}
              >
                {text}
              </Chip>
            ))}
          </ChipRow>
        </EmptyState>
      )}
      {messages.map((msg, index) => {
        const isLast = index === messages.length - 1;
        const showDots =
          isLast && msg.sender === "bot" && msg.text === "" && loading;
        const showRetry = isLast && msg.error === true && !loading;
        return (
          <Fragment key={index}>
            <Row $sender={msg.sender}>
              {msg.sender === "bot" && <Avatar>🤖</Avatar>}
              <MessageBubble
                sender={msg.sender}
                text={msg.text}
                showDots={showDots}
              />
            </Row>
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
  background: var(--color-surface-alt);
`;

const EmptyState = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const EmptyMessage = styled.div`
  color: var(--color-text-muted);
  font-size: 14px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const Chip = styled.button`
  padding: 8px 14px;
  font-size: 13px;
  color: var(--color-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
  &:hover {
    background: #eff6ff;
    border-color: var(--color-primary);
  }
`;

const Row = styled.div<{ $sender: "user" | "bot" }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  justify-content: ${({ $sender }) =>
    $sender === "user" ? "flex-end" : "flex-start"};
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const RetryButton = styled.button`
  align-self: flex-start;
  margin-left: 36px;
  margin-top: -4px;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--color-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  &:hover {
    background: #eff6ff;
  }
`;
