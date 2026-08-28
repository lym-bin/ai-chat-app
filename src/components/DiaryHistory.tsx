// src // components // DiaryHistory.tsx 저장된 일기 목록 토글 패널

import { useState } from "react";
import styled from "styled-components";
import type { DiaryEntry } from "../types/message";

interface Props {
  entries: DiaryEntry[];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function DiaryHistory({ entries }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Wrapper>
      <ToggleButton type="button" onClick={() => setOpen((v) => !v)}>
        지난 일기 ({entries.length}) <Arrow>{open ? "▲" : "▼"}</Arrow>
      </ToggleButton>
      {open && (
        <Panel>
          {entries.length === 0 && <Empty>저장된 일기가 없어요.</Empty>}
          {entries.map((e) => {
            const expanded = expandedId === e.id;
            return (
              <Item key={e.id}>
                <ItemHeader
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : e.id)}
                >
                  <DateText>{formatDate(e.date)}</DateText>
                  <Preview>{e.entry}</Preview>
                </ItemHeader>
                {expanded && (
                  <Detail>
                    <Label>일기</Label>
                    <Body>{e.entry}</Body>
                    <Label>AI의 위로</Label>
                    <Body>{e.reply}</Body>
                  </Detail>
                )}
              </Item>
            );
          })}
        </Panel>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
`;

const ToggleButton = styled.button`
  width: 100%;
  padding: 10px 20px;
  border: none;
  background: #f9fafb;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: #f3f4f6;
  }
`;

const Arrow = styled.span`
  font-size: 10px;
  color: #9ca3af;
`;

const Panel = styled.div`
  max-height: 240px;
  overflow-y: auto;
`;

const Empty = styled.div`
  padding: 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
`;

const Item = styled.div`
  border-top: 1px solid #f3f4f6;
`;

const ItemHeader = styled.button`
  width: 100%;
  padding: 10px 20px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  &:hover {
    background: #f9fafb;
  }
`;

const DateText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
`;

const Preview = styled.span`
  font-size: 13px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Detail = styled.div`
  padding: 0 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  margin-top: 8px;
`;

const Body = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #1f2937;
  white-space: pre-wrap;
  word-break: break-word;
`;
