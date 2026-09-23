// src/components/LoadingJoke.tsx 로딩이 길어질 때 보여주는 개발자 개그 문구

import { useEffect, useState } from "react";
import styled from "styled-components";

const JOKES = [
  "Java와 JavaScript의 관계에 대해 아시나요? 햄과 햄버거 관계 입니다 🍔",
  '개발자가 제일 무서워하는 말: "방금까지 됐었는데?"',
  "버그가 아니라 예상치 못한 기능이에요.",
  "코드가 안 될 땐 일단 저장부터 해보세요.",
  '커밋 메시지 "fix"의 뜻: 뭘 고쳤는지 저도 몰라요.',
  "개발자에게 최고의 디버깅 도구는 console.log 입니다.",
];

const SHOW_DELAY = 2500;
const ROTATE_INTERVAL = 6000;

function pickJoke(prev: string | null): string {
  let next = JOKES[Math.floor(Math.random() * JOKES.length)];
  while (JOKES.length > 1 && next === prev) {
    next = JOKES[Math.floor(Math.random() * JOKES.length)];
  }
  return next;
}

interface Props {
  active: boolean;
}

export default function LoadingJoke({ active }: Props) {
  const [joke, setJoke] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout>;

    const scheduleNext = (delay: number) => {
      timerId = setTimeout(() => {
        if (cancelled) return;
        setJoke((prev) => pickJoke(prev));
        scheduleNext(ROTATE_INTERVAL);
      }, delay);
    };

    scheduleNext(SHOW_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [active]);

  if (!joke) return null;

  return <Joke>{joke}</Joke>;
}

const Joke = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  font-style: italic;
  color: var(--color-text-muted);
`;
