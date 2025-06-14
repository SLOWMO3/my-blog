// 음식 카테고리별 대표 음식 포스트 자동 등록 스크립트 (Supabase API 예시)
import { createServerSupabaseClient } from '@/lib/supabase-server';

const FOOD_POSTS = [
  {
    title: '한식의 대표주자 비빔밥을 소개합니다!',
    slug: 'bibimbap-korean',
    content: '비빔밥은 고슬고슬한 밥 위에 나물, 고기, 계란, 고추장 등 다양한 재료를 올려 비벼 먹는 한국의 대표 음식입니다. 각 재료의 색과 맛이 어우러져 영양과 조화로움을 자랑하며, 전통 한식의 상징으로 세계적으로도 사랑받고 있습니다. 남녀노소 누구나 즐길 수 있고, 건강한 한 끼 식사로도 손색이 없습니다.',
    excerpt: '다채로운 재료와 고추장이 어우러진 한식 대표 음식 비빔밥의 매력을 알아보세요.',
    category_slug: 'korean',
    cover_image_url: '/default-avatar.png',
  },
  {
    title: '마파두부, 중식의 매력',
    slug: 'mapo-tofu-chinese',
    content: '마파두부는 부드러운 두부와 매콤한 소스, 다진 고기가 어우러진 중국 쓰촨 지방의 대표 요리입니다. 얼얼한 맛이 일품인 중식의 매력을 느껴보세요.',
    excerpt: '매콤하고 얼얼한 맛이 일품인 중식 대표 음식 마파두부를 소개합니다.',
    category_slug: 'chinese',
    cover_image_url: '/default-avatar.png',
  },
  {
    title: '파스타, 양식의 클래식',
    slug: 'pasta-western',
    content: '파스타는 이탈리아를 대표하는 음식으로, 다양한 소스와 재료로 즐길 수 있습니다. 간단하면서도 깊은 맛을 자랑하는 양식의 클래식 메뉴입니다.',
    excerpt: '이탈리아의 정통 파스타, 양식의 대표 클래식 메뉴를 소개합니다.',
    category_slug: 'western',
    cover_image_url: '/default-avatar.png',
  },
  {
    title: '스시, 일식의 정갈함',
    slug: 'sushi-japanese',
    content: '스시는 신선한 생선과 밥, 와사비가 어우러진 일본의 대표 음식입니다. 재료 본연의 맛과 정갈한 플레이팅이 특징입니다.',
    excerpt: '신선함과 정갈함이 살아있는 일식 대표 음식 스시를 소개합니다.',
    category_slug: 'japanese',
    cover_image_url: '/default-avatar.png',
  },
];

export async function seedFoodPosts() {
  const supabase = await createServerSupabaseClient();
  for (const post of FOOD_POSTS) {
    // 카테고리 id 조회
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', post.category_slug)
      .single();
    if (!category) continue;
    await supabase.from('posts').insert({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: 'published',
      cover_image_url: post.cover_image_url,
      category_id: category.id,
      // author_id는 현재 로그인된 유저로 자동 할당됨
    });
  }
  console.log('카테고리별 대표 음식 포스트 등록 완료!');
}

// 실행 예시: npx tsx app/admin/posts/seed-food-posts.ts
