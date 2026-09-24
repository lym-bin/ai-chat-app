// src // components // GameModal.tsx 좁은 화면에서 미니게임을 띄우는 전체화면 오버레이

import { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import SnakeGame from "./SnakeGame";

interface Props {
  onClose: () => void;
}

export default function GameModal({ onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <Backdrop onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={onClose} aria-label="닫기">
          ✕
        </CloseButton>
        <Title>심심할 때 한 판 🐍</Title>
        <SnakeGame />
      </Panel>
    </Backdrop>,
    document.body,
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Panel = styled.div`
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: var(--color-bg);
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
`;
