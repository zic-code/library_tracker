📘 Library Tracker App – 백엔드 기능 구현 요약 (Capstone Project)
✅ 사용자 인증 기능
 POST /auth/register – 사용자 회원가입 (bcrypt 해싱)

 POST /auth/login – 로그인 및 JWT 토큰 발급

 authenticateJWT 미들웨어 – JWT 유효성 검사 및 payload 저장

 ensureLoggedIn 미들웨어 – 보호 라우트 접근 제한

✅ 사용자 도서 관리 기능
 POST /mybooks – 사용자의 책 추가 (bookId만 저장, Google Books API ID 사용)

 GET /mybooks – 사용자의 책 목록 조회

 Google Books API volume.id 기반 구조 확립

 books 테이블 제거 → user_books.book_id는 외래키 없이 TEXT로 직접 저장

✅ 데이터베이스 설계 변경
 외래키 제거 및 books 테이블 삭제

 user_books.book_id를 TEXT 필드로 재설계

 reviews 테이블도 동일하게 book_id만 저장하도록 리팩토링

 UNIQUE(user_id, book_id) 제약으로 중복 방지

✅ Seed 및 초기화
 seed.sql 재작성 (books 테이블 없이 초기 사용자 및 user_books 샘플 데이터 삽입)

 password1 bcrypt(12) 해시 적용하여 유저 등록 가능

✅ 에러 처리 및 디버깅
 ExpressError 클래스로 커스텀 에러 사용

 모든 에러에 대해 HTTP 상태코드 포함 응답 (app.js 수정)

 로그인 실패 시 404 → 401로 정확한 상태코드 반환 처리

✅ 기능 테스트 완료 흐름
/auth/register로 유저 등록

/auth/login으로 JWT 발급

POST /mybooks로 책 저장

GET /mybooks로 책 목록 조회
→ 프론트 없이 Postman/Insomnia에서 전체 테스트 완료 🎉