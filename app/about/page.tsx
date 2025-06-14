/**
 * 세계 음식 블로그 소개 페이지
 * 블로그의 목적, 운영자, 주요 콘텐츠 안내
 */

import Link from 'next/link';

export const metadata = {
  title: '소개 | 세계 음식 블로그',
  description: '세계 각국의 음식, 레시피, 음식 문화와 여행기를 소개하는 블로그입니다.'
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">🍽️ 세계 음식 블로그 소개</h1>
      <p className="text-lg text-muted-foreground mb-8">
        <b>세계 음식 블로그</b>는 전 세계의 다양한 음식, 레시피, 음식 문화, 그리고 여행기를 소개하는 미식 여행자들의 공간입니다.<br />
        각국의 대표 요리, 숨은 맛집, 음식에 얽힌 이야기와 여행 팁까지!<br />
        새로운 미식 경험과 문화를 함께 탐험해보세요.
      </p>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">주요 콘텐츠</h2>
        <ul className="list-disc pl-6 text-base space-y-1">
          <li>한식, 중식, 양식, 일식 등 다양한 음식 카테고리별 소개</li>
          <li>세계 각국의 음식 문화와 레시피, 음식에 얽힌 이야기</li>
          <li>여행지에서 만난 특별한 음식과 맛집 추천</li>
          <li>음식과 여행을 사랑하는 사람들의 소통 공간(댓글, 좋아요)</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">운영자 소개</h2>
        <p className="text-base text-muted-foreground">
          안녕하세요! 다양한 나라의 음식과 문화를 사랑하는 <b>정의태</b>입니다.<br />
          이 블로그를 통해 더 많은 분들과 미식의 즐거움을 나누고 싶어요. <br />
          궁금한 점이나 제안, 협업 문의는 언제든 <span className="text-primary font-semibold">010-2945-0845</span>로 연락주세요!
        </p>
      </section>
      <div className="mt-12 text-center">
        <Link href="/posts" className="inline-flex items-center rounded-lg bg-amber-500 px-6 py-3 text-white font-medium hover:bg-amber-600 transition-all">
          🍜 음식 이야기 보러가기
        </Link>
      </div>
    </main>
  );
}
