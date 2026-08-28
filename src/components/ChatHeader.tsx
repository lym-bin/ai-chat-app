// src // components // ChatHeader.tsx // 챗봇 상단 타이틀 및 상태표시영역

import styled from "styled-components";

export default function ChatHeader() {
  return (
    <HeaderContainer>
      <Title>AI Talk / 챗봇 서비스</Title>
      <StatusBadge>Online</StatusBadge>
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

const StatusBadge = styled.span`
  background: #10b981;
  color: #ffffff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
`;
