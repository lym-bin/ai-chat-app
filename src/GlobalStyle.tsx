// src // GlobalStyle.tsx 전역 스타일 (디자인 토큰, body 여백 제거, 배경, 폰트)
import { createGlobalStyle } from "styled-components";

// 색상,라운드값,그림자 CSS 변수 — 네오브루탈 × 레트로 테마
export const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary: #3B82F6;
    --color-primary-hover: #2563EB;
    --color-accent: #FF4D8D;
    --color-bg: #FFE347;
    --color-surface: #ffffff;
    --color-surface-alt: #FFF4B8;
    --color-border: #111111;
    --color-text: #111111;
    --color-text-muted: #555555;
    --color-on-primary: #ffffff;
    --color-danger: #dc2626;
    --color-disabled: #a8a8a8;
    --color-code-bg: #111111;
    --color-code-text: #FFE347;
    --gradient-header: #111111;
    --radius-sm: 0px;
    --radius-md: 0px;
    --radius-lg: 0px;
    --shadow-bubble: 3px 3px 0 var(--color-border);
    --shadow-card: 4px 4px 0 var(--color-border);
  }

  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    background: var(--color-bg);
    font-family: 'Nanum Gothic Coding', ui-monospace, SFMono-Regular, Menlo, monospace;
  }
`;
