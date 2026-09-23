// src // components // MessageBubble.tsx 개별 말풍선 UI 컴포넌트
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      ) : sender === "bot" ? (
        <MarkdownWrapper>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </MarkdownWrapper>
      ) : (
        text
      )}
    </Bubble>
  );
}

const Bubble = styled.div<{ $sender: "user" | "bot" }>`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  line-height: 1.5;
  font-size: 14px;
  background: ${({ $sender }) =>
    $sender === "user" ? "var(--color-primary)" : "var(--color-surface)"};
  color: ${({ $sender }) =>
    $sender === "user" ? "#ffffff" : "var(--color-text)"};
  border: ${({ $sender }) =>
    $sender === "user" ? "none" : "1px solid var(--color-border)"};
  box-shadow: var(--shadow-bubble);
  word-break: break-word;
  white-space: pre-wrap;

  @media (max-width: 640px) {
    max-width: 85%;
  }
`;

const MarkdownWrapper = styled.div`
  white-space: normal;

  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  p {
    margin: 0 0 8px;
  }
  ul,
  ol {
    margin: 4px 0 8px;
    padding-left: 20px;
  }
  li {
    margin: 2px 0;
  }
  strong {
    font-weight: 700;
  }
  a {
    color: var(--color-primary);
    text-decoration: underline;
  }
  code {
    background: rgba(0, 0, 0, 0.06);
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 10px 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 6px 0;
  }
  pre code {
    background: none;
    padding: 0;
    color: inherit;
  }
  blockquote {
    margin: 6px 0;
    padding-left: 10px;
    border-left: 3px solid var(--color-border);
    color: var(--color-text-muted);
  }
  table {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
    margin: 6px 0;
    font-size: 0.9em;
  }
  th,
  td {
    border: 1px solid var(--color-border);
    padding: 4px 8px;
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
    background-color: var(--color-text-muted);
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
