// src // components // ChatHeader.tsx // 챗봇 상단 타이틀 및 새 대화 버튼

import styled from "styled-components";

interface Props {
  onNewChat: () => void;
  onOpenGame: () => void;
}

export default function ChatHeader({ onNewChat, onOpenGame }: Props) {
  return (
    <HeaderContainer>
      <Title>[ AI TALK ]</Title>
      <Actions>
        <GameButton type="button" onClick={onOpenGame} aria-label="미니게임">
          [게임]
        </GameButton>
        <NewChatButton type="button" onClick={onNewChat}>
          [+ 새 대화]
        </NewChatButton>
      </Actions>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  background: var(--gradient-header);
  color: var(--color-on-primary);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NewChatButton = styled.button`
  background: var(--color-accent);
  color: var(--color-on-primary);
  border: 3px solid var(--color-bg);
  font-size: 11px;
  font-weight: 700;
  padding: 6px 10px;
  cursor: pointer;
  transition:
    background 0.08s,
    box-shadow 0.08s;
  &:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;

const GameButton = styled.button`
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: 3px solid var(--color-bg);
  font-size: 11px;
  font-weight: 700;
  padding: 6px 10px;
  cursor: pointer;
  transition:
    background 0.08s,
    box-shadow 0.08s;
  &:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;
