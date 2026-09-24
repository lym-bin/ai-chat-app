// src // components // SnakeGame.tsx 캔버스 기반 스네이크(지렁이) 미니게임

import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const GRID_SIZE = 16;
const CELL = 16;
const CANVAS_SIZE = GRID_SIZE * CELL;
const TICK_MS = 140;

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const DELTA: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

function initialSnake(): Point[] {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>(initialSnake());
  const foodRef = useRef<Point>(randomFood(initialSnake()));
  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(true);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = "#dc2626";
    ctx.fillRect(
      foodRef.current.x * CELL,
      foodRef.current.y * CELL,
      CELL,
      CELL,
    );

    snakeRef.current.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? "#22c55e" : "#4ade80";
      ctx.fillRect(
        segment.x * CELL + 1,
        segment.y * CELL + 1,
        CELL - 2,
        CELL - 2,
      );
    });
  }, []);

  const reset = useCallback(() => {
    snakeRef.current = initialSnake();
    foodRef.current = randomFood(snakeRef.current);
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }, []);

  const turn = useCallback((next: Direction) => {
    if (OPPOSITE[next] === directionRef.current) return;
    nextDirectionRef.current = next;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };
      const next = map[e.key];
      if (next) {
        e.preventDefault();
        turn(next);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [turn]);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      directionRef.current = nextDirectionRef.current;
      const head = snakeRef.current[0];
      const d = DELTA[directionRef.current];
      const newHead: Point = { x: head.x + d.x, y: head.y + d.y };

      const hitWall =
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y >= GRID_SIZE;
      const hitSelf = snakeRef.current.some(
        (s) => s.x === newHead.x && s.y === newHead.y,
      );

      if (hitWall || hitSelf) {
        setGameOver(true);
        setRunning(false);
        return;
      }

      const ateFood =
        newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
      const newSnake = [newHead, ...snakeRef.current];
      if (ateFood) {
        setScore((s) => s + 1);
        foodRef.current = randomFood(newSnake);
      } else {
        newSnake.pop();
      }
      snakeRef.current = newSnake;
      draw();
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [running, draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <Wrapper>
      <Score>점수: {score}</Score>
      <CanvasWrapper>
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} />
        {gameOver && (
          <Overlay>
            <p>게임 끝!</p>
            <RestartButton type="button" onClick={reset}>
              다시 하기
            </RestartButton>
          </Overlay>
        )}
      </CanvasWrapper>
      <Pad>
        <PadRow>
          <PadButton type="button" onClick={() => turn("UP")}>
            ▲
          </PadButton>
        </PadRow>
        <PadRow>
          <PadButton type="button" onClick={() => turn("LEFT")}>
            ◀
          </PadButton>
          <PadButton type="button" onClick={() => turn("DOWN")}>
            ▼
          </PadButton>
          <PadButton type="button" onClick={() => turn("RIGHT")}>
            ▶
          </PadButton>
        </PadRow>
      </Pad>
      <Hint>방향키 또는 버튼으로 조작하세요</Hint>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Score = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
`;

const CanvasWrapper = styled.div`
  position: relative;
  line-height: 0;
  border-radius: 8px;
  overflow: hidden;

  canvas {
    display: block;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
`;

const RestartButton = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  &:hover {
    background: var(--color-primary-hover);
  }
`;

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const PadRow = styled.div`
  display: flex;
  gap: 4px;
`;

const PadButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text);
  font-size: 16px;
  cursor: pointer;
  &:active {
    background: var(--color-primary-soft);
  }
`;

const Hint = styled.p`
  margin: 0;
  font-size: 11px;
  color: var(--color-text-muted);
`;
