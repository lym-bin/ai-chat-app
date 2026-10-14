// src // components // ModeTabs.tsx 일반 채팅 / 오늘의 일기 모드 전환 탭

import styled from "styled-components";
import type { ChatMode } from "../types/message";

interface Props {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
}

export default function ModeTabs({ mode, onChange }: Props) {
  return (
    <TabTrack>
      <Tab
        type="button"
        $active={mode === "chat"}
        onClick={() => onChange("chat")}
      >
        일반 채팅
      </Tab>
      <Tab
        type="button"
        $active={mode === "diary"}
        onClick={() => onChange("diary")}
      >
        오늘의 일기
      </Tab>
    </TabTrack>
  );
}

const TabTrack = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 16px 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 9px 0;
  border: 3px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: ${({ $active }) =>
    $active ? "var(--color-primary)" : "var(--color-surface)"};
  color: ${({ $active }) =>
    $active ? "var(--color-on-primary)" : "var(--color-text)"};
  font-size: 13px;
  font-weight: 700;
  box-shadow: ${({ $active }) => ($active ? "var(--shadow-bubble)" : "none")};
  cursor: pointer;
  transition:
    transform 0.08s,
    box-shadow 0.08s;
  &:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;
