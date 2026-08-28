// src // components // ChatInput.tsx  메시지 입력창과 전송 버튼이 포함된 하단 폼 영역
// src // components // ChatInput.tsx 메시지 입력창 + 전송/중지 버튼

import type { FormEvent } from "react";
import styled from "styled-components";

interface Props {
  input: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onStop: () => void;
}

export default function ChatInput({
  input,
  loading,
  onChange,
  onSubmit,
  onStop,
}: Props) {
  return (
    <InputForm onSubmit={onSubmit}>
      <InputField
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="메시지를 입력하세요..."
        disabled={loading}
      />
      {loading ? (
        <SendButton type="button" onClick={onStop}>
          중지
        </SendButton>
      ) : (
        <SendButton type="submit">전송</SendButton>
      )}
    </InputForm>
  );
}

const InputForm = styled.form`
  display: flex;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #2563eb;
  }
  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  margin-left: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #1d4ed8;
  }
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;
