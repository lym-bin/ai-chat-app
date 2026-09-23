// src // components // ChatHeader.tsx // 챗봇 상단 타이틀 및 새 대화 버튼

import styled from "styled-components";

interface Props {
  onNewChat: () => void;
}

export default function ChatHeader({ onNewChat }: Props) {
  return (
    <HeaderContainer>
      <TitleGroup>
        <Logo>✨</Logo>
        <Title>AI Talk</Title>
      </TitleGroup>
      <NewChatButton type="button" onClick={onNewChat}>
        + 새 대화
      </NewChatButton>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #1e293b, #111827);
  color: #ffffff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Logo = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const Title = styled.h1`
  font-size: 17px;
  font-weight: 600;
  margin: 0;
`;
const NewChatButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`;
