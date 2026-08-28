// src // components // ChatHeader.tsx // 챗봇 상단 타이틀 및 새 대화 버튼

import styled from "styled-components";

interface Props {
  onNewChat: () => void;
}

export default function ChatHeader({ onNewChat }: Props) {
  return (
    <HeaderContainer>
      <Title>AI Talk / 챗봇 서비스</Title>
      <NewChatButton type="button" onClick={onNewChat}>
        + 새 대화
      </NewChatButton>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  background: #111827;
  color: #ffffff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #374151;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const NewChatButton = styled.button`
  background: transparent;
  color: #ffffff;
  border: 1px solid #4b5563;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #1f2937;
  }
`;
