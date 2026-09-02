// src // components // MessageBubble.tsx 개별 말풍선 UI 컴포넌트
import styled from "styled-components";

interface Props {
  sender: "user" | "bot";
  text: string;
  showDots?: boolean;
}

export default function MessageBubble({ sender, text, showDots }: Props) {
  return (
    <Bubble $sender={sender}>
      {showDots ? (
        <TypingDots>
          <span />
          <span />
          <span />
        </TypingDots>
      ) : (
        text
      )}
    </Bubble>
  );
}

const Bubble = styled.div<{ $sender: "user" | "bot" }>`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  font-size: 14px;
  align-self: ${({ $sender }) =>
    $sender === "user" ? "flex-end" : "flex-start"};
  background: ${({ $sender }) => ($sender === "user" ? "#2563eb" : "#e5e7eb")};
  color: ${({ $sender }) => ($sender === "user" ? "#ffffff" : "#1f2937")};
  word-break: break-word;
  white-space: pre-wrap;

  @media (max-width: 640px) {
    max-width: 85%;
  }
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 0;

  span {
    width: 6px;
    height: 6px;
    background-color: #6b7280;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  span:nth-child(1) {
    animation-delay: -0.32s;
  }
  span:nth-child(2) {
    animation-delay: -0.16s;
  }
  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;
