# AI Talk

Gemini API로 만든 1:1 채팅 웹 앱입니다.
답변이 한 글자씩 이어서 나오고, 일기를 쓰면 공감하는 답을 돌려주는 모드도 있습니다.

## 기능

- 채팅: 메시지를 보내면 답변이 실시간으로 조금씩 채워집니다.
- 이전 대화 기억: 앞에서 나눈 내용을 이어서 대화합니다.
- 답변 멈추기: 답변이 나오는 중에 전송 버튼이 중지 버튼으로 바뀝니다.
- 새 대화: 헤더 버튼을 누르면 대화를 처음부터 다시 시작합니다.
- 오늘의 일기 모드: 일기를 쓰면 공감과 위로, 짧은 조언을 답으로 줍니다.
- 일기 저장: 일기와 답변을 날짜별로 브라우저에 저장하고, "지난 일기" 목록에서 다시 볼 수 있습니다.

## 사용한 것

- React + TypeScript
- Vite
- styled-components
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
  App.tsx              상태와 메시지 전송 로직
  gemini.ts            Gemini 연결, 채팅/일기 세션 생성
  components/
    ChatHeader.tsx     상단 제목, 새 대화 버튼
    ModeTabs.tsx       채팅 / 일기 모드 전환 탭
    MessageList.tsx    메시지 목록, 자동 스크롤
    MessageBubble.tsx  말풍선 하나
    ChatInput.tsx      입력창, 전송/중지 버튼
    DiaryHistory.tsx   저장된 일기 목록
  lib/
    diaryStorage.ts    일기 저장/불러오기
  types/
    message.ts         타입 정의
```

## 참고

- 일기 기록은 사용하는 브라우저에만 저장됩니다. 다른 기기나 브라우저에서는 보이지 않습니다.
- `.env` 파일은 깃에 올라가지 않습니다.
