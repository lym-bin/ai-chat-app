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
  gap: 4px;
  margin: 12px 16px 0;
  padding: 4px;
  background: var(--color-surface-alt);
  border-radius: var(--radius-sm);
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) =>
    $active ? "var(--color-primary)" : "var(--color-text-muted)"};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  box-shadow: ${({ $active }) => ($active ? "var(--shadow-bubble)" : "none")};
  cursor: pointer;
  transition: all 0.15s;
`;
