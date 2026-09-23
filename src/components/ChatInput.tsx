// src // components // ChatInput.tsx 메시지 입력창 + 전송/중지 버튼

import type { FormEvent } from "react";
import styled from "styled-components";

interface Props {
  input: string;
  loading: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onStop: () => void;
}

export default function ChatInput({
  input,
  loading,
  placeholder = "메시지를 입력하세요...",
  onChange,
  onSubmit,
  onStop,
}: Props) {
  return (
    <InputForm onSubmit={onSubmit}>
      <InputField
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // 한글 조합 확정용 Enter는 전송으로 처리하지 않음
          if (e.key === "Enter" && e.nativeEvent.isComposing) {
            e.preventDefault();
          }
        }}
        placeholder={placeholder}
        disabled={loading}
      />
      {loading ? (
        <IconButton
          type="button"
          onClick={onStop}
          $variant="stop"
          aria-label="중지"
        >
          ■
        </IconButton>
      ) : (
        <IconButton
          type="submit"
          $variant="send"
          aria-label="전송"
          disabled={!input.trim()}
        >
          ➤
        </IconButton>
      )}
    </InputForm>
  );
}

const InputForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
`;

const InputField = styled.input`
  flex: 1;
  padding: 12px 18px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: 14px;
  transition:
    border-color 0.15s,
    background 0.15s;
  &:focus {
    border-color: var(--color-primary);
    background: var(--color-surface);
  }
  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button<{ $variant: "send" | "stop" }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  font-size: 16px;
  line-height: 1;
  color: #ffffff;
  background: ${({ $variant }) =>
    $variant === "stop" ? "#dc2626" : "var(--color-primary)"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    transform 0.1s;
  &:hover {
    background: ${({ $variant }) =>
      $variant === "stop" ? "#b91c1c" : "var(--color-primary-hover)"};
  }
  &:active {
    transform: scale(0.94);
  }
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;
