// src // components // GameSidePanel.tsx 넓은 화면에서 채팅창 옆 여백에 표시되는 미니게임 패널

import styled from "styled-components";
import SnakeGame from "./SnakeGame";

interface Props {
  onClose: () => void;
}

export default function GameSidePanel({ onClose }: Props) {
  return (
    <Panel>
      <Header>
        <Title>심심할 때 한 판 🐍</Title>
        <CloseButton type="button" onClick={onClose} aria-label="닫기">
          ✕
        </CloseButton>
      </Header>
      <SnakeGame />
    </Panel>
  );
}

const Panel = styled.div`
  align-self: flex-start;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background: var(--color-bg);
  }
`;
