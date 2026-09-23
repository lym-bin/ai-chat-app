// src // GlobalStyle.tsx 전역 스타일 (디자인 토큰, body 여백 제거, 배경, 폰트)
import { createGlobalStyle } from "styled-components";

// 색상,라운드값,그림자 CSS 변수
export const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
    --color-bg: #f3f4f6;
    --color-surface: #ffffff;
    --color-surface-alt: #f9fafb;
    --color-border: #e5e7eb;
    --color-text: #1f2937;
    --color-text-muted: #6b7280;
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --shadow-bubble: 0 1px 2px rgba(15, 23, 42, 0.06);
    --shadow-card: 0 10px 30px -12px rgba(15, 23, 42, 0.25);
  }

  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    background: var(--color-bg);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  }
`;
