// src // components // ModeTabs.tsx 일반 채팅 / 오늘의 일기 모드 전환 탭

import styled from "styled-components";
import type { ChatMode } from "../types/message";

interface Props {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
}

export default function ModeTabs({ mode, onChange }: Props) {
  return (
    <TabBar>
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
    </TabBar>
  );
}

const TabBar = styled.div`
  display: flex;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? "#2563eb" : "#6b7280")};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#2563eb" : "transparent")};
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: #2563eb;
  }
`;
