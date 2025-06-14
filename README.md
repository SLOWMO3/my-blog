# 세계 음식 소개 블로그 🍽️🌏

Next.js, Clerk, Supabase 기반의 글로벌 음식·여행·문화 테마 블로그입니다.

## 🌍 프로젝트 소개

전 세계의 다양한 음식, 레시피, 음식 문화, 여행기를 소개하는 미식 탐험 블로그입니다. 한식, 중식, 양식, 일식 등 각국의 대표 요리와 숨은 맛집, 음식에 얽힌 이야기, 여행 팁까지! 새로운 미식 경험과 문화를 함께 탐험해보세요.

## 🚀 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS, shadcn/ui
- **Markdown**: react-markdown, rehype, remark

## 🍜 주요 기능

- ✅ 음식/여행/문화 테마의 블로그 포스트 작성/수정/삭제
- ✅ 한식, 중식, 양식, 일식 등 카테고리별 탐색
- ✅ 댓글 및 좋아요(실시간 동기화, Clerk 인증)
- ✅ 반응형 디자인 & SEO 최적화
- ✅ 음식 카드/상세/목록/홈 등 테마 일관성
- ✅ 실시간 검색, 정렬, 필터링(예정)
- ✅ 이미지 업로드 및 최적화

## ✨ UX/SEO/디자인

- 음식/여행/문화 테마의 카드, 배지, 컬러, 이모지, 안내문구
- Open Graph, Twitter, JSON-LD 등 동적 SEO 메타데이터
- 모바일/데스크탑 완벽 대응

## 🛠️ 설치 및 실행

1. **저장소 클론**

```bash
git clone <repository-url>
cd ohmyblog
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. **DB 스키마/카테고리/샘플 데이터 적용**
Supabase SQL Editor에서 `docs/database-schema.sql` 실행

5. **개발 서버 실행**

```bash
npm run dev
```

## 📁 주요 폴더 구조

```
├── app/                 # Next.js App Router
│   ├── about/           # 블로그 소개
│   ├── admin/           # 관리자/글쓰기
│   ├── api/             # API 라우트
│   ├── posts/           # 음식 포스트 목록/상세
│   └── categories/      # 음식 카테고리별 페이지
├── components/          # 재사용 컴포넌트(카드, 댓글, 좋아요 등)
├── lib/                 # 유틸리티/설정
├── types/               # 타입 정의
├── docs/                # DB 스키마/문서
└── public/              # 정적 파일/이미지
```

## 🔐 인증 시스템

- Clerk 기반 이메일/소셜 로그인
- 인증된 사용자만 댓글/좋아요/글쓰기 가능
- Supabase RLS와 연동

## 📝 음식 포스트 작성

1. `/admin/posts/create`에서 새 글 작성
2. 마크다운 지원, 카테고리 선택, 커버 이미지 업로드
3. 미리보기 및 실시간 저장

## 🎨 커스터마이징

- `tailwind.config.ts`에서 테마 색상 변경 가능
- 음식 카드/카테고리/버튼 등 디자인 커스터마이징

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Clerk 공식 문서](https://clerk.com/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 기여하기

1. Fork 후 브랜치 생성 (`git checkout -b feature/음식기능`)
2. 변경사항 커밋 (`git commit -m 'Add 음식기능'`)
3. 브랜치에 Push (`git push origin feature/음식기능`)
4. Pull Request 생성

## 📄 라이선스

MIT License - 자세한 내용은 `LICENSE` 파일을 확인하세요.

## 📞 연락처

운영자: 정의태 (010-2945-0845)

---

⭐ 이 프로젝트가 도움이 되셨다면 스타를 눌러주세요!
