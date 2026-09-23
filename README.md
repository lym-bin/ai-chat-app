# AI Talk

Gemini API로 만든 1:1 채팅 웹 앱입니다.
답변이 한 글자씩 이어서 나오고, 일기를 쓰면 공감하는 답을 돌려주는 모드도 있습니다.

배포: https://ai-chat-app-hazel-one.vercel.app/

## 기능

- 채팅: 메시지를 보내면 답변이 실시간으로 조금씩 채워집니다.
- 이전 대화 기억: 앞에서 나눈 내용을 이어서 대화합니다.
- 답변 멈추기: 답변이 나오는 중에 전송 버튼이 중지 버튼으로 바뀝니다.
- 새 대화: 헤더 버튼을 누르면 대화를 처음부터 다시 시작합니다.
- 추천 질문: 대화 시작 전 칩을 누르면 바로 질문이 전송됩니다.
- 답변 서식: 굵은 글씨, 목록, 코드블록, 표 같은 마크다운을 그대로 보여줍니다.
- 오늘의 일기 모드: 일기를 쓰면 공감과 위로, 짧은 조언을 답으로 줍니다.
- 일기 저장: 일기와 답변을 날짜별로 브라우저에 저장하고, "지난 일기" 목록에서 다시 볼 수 있습니다.
- 대화 유지: 일반 채팅 내역은 새로고침해도 남아 있습니다.
- 오류 재시도: 답변이 실패하면 말풍선 아래 버튼으로 같은 질문을 다시 보낼 수 있습니다.
- 로딩 문구: 답변이 오래 걸리면 짧은 개발자 개그가 뜹니다. (예: "Java와 JavaScript의 관계에 대해 아시나요? 햄과 햄버거 관계 입니다")
- 화면 크기에 맞춰 레이아웃이 바뀝니다.

## 사용한 것

- React + TypeScript
- Vite
- styled-components
- react-markdown, remark-gfm
- Google Gemini API (`@google/genai`)

## 실행 방법

1. 패키지 설치

   ```
   npm install
   ```

2. 프로젝트 폴더에 `.env` 파일을 만들고 키를 넣습니다.

   ```
   VITE_GEMINI_API_KEY=발급받은_키
   ```

   키는 https://aistudio.google.com/apikey 에서 만들 수 있습니다.

3. 개발 서버 실행

   ```
   npm run dev
   ```

4. 빌드

   ```
   npm run build
   ```

## 폴더 구조

```
src/
  App.tsx               상태와 메시지 전송 로직
  GlobalStyle.tsx        전역 스타일과 색상 변수
  gemini.ts              Gemini 연결, 채팅/일기 세션 생성
  components/
    ChatHeader.tsx       상단 제목, 새 대화 버튼
    ModeTabs.tsx          채팅 / 일기 모드 전환 탭
    MessageList.tsx       메시지 목록, 추천 질문, 자동 스크롤
    MessageBubble.tsx     말풍선 하나, 마크다운 렌더링
    ChatInput.tsx         입력창, 전송/중지 버튼
    DiaryHistory.tsx      저장된 일기 목록
    LoadingJoke.tsx       로딩이 길어질 때 나오는 문구
  lib/
    chatStorage.ts        채팅 내역 저장/불러오기
    diaryStorage.ts       일기 저장/불러오기
  types/
    message.ts            타입 정의
```

## 참고

- 대화 내용과 일기 기록은 사용하는 브라우저에만 저장됩니다. 다른 기기나 브라우저에서는 보이지 않습니다.
- `.env` 파일은 깃에 올라가지 않습니다.
- Gemini 무료 등급은 하루 요청 횟수 제한이 있습니다.
