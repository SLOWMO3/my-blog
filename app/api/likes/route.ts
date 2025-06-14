import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Database } from '@/types/database.types';

/**
 * 좋아요 상태 조회 (GET)
 * - 전체 좋아요 수 반환
 * - 인증된 경우 본인 좋아요 여부 반환
 * - 미인증도 좋아요 수 조회 가능
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    if (!postId) {
      return NextResponse.json({ error: '게시글 ID가 필요합니다' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // 전체 좋아요 수 조회
    const { count, error: countError } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (countError) {
      console.error('좋아요 수 조회 오류:', countError);
      return NextResponse.json({ error: '좋아요 수를 불러오는 중 오류가 발생했습니다' }, { status: 500 });
    }

    // 인증된 경우 본인 좋아요 여부 확인
    let liked = false;
    try {
      const { userId } = await auth();
      if (userId) {
        const { data: likeData, error: likeError } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();
        if (likeError) {
          console.error('본인 좋아요 여부 조회 오류:', likeError);
        }
        liked = !!likeData;
      }
    } catch (e) {
      // 인증 안 된 경우 무시
      liked = false;
    }

    return NextResponse.json({ liked, totalLikes: count ?? 0 });
  } catch (error) {
    console.error('좋아요 상태 조회 오류:', error);
    return NextResponse.json({ error: '좋아요 상태를 불러오는 중 오류가 발생했습니다' }, { status: 500 });
  }
}

/**
 * 좋아요 토글 (POST)
 * - 인증된 사용자만 접근 가능
 * - 이미 좋아요가 있으면 제거, 없으면 추가
 * - 중복 좋아요 방지
 * - { liked, totalLikes } 반환
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }
    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: '게시글 ID가 필요합니다.' }, { status: 400 });
    }
    const supabase = await createServerSupabaseClient();
    // 좋아요 존재 여부 확인
    const { data: existing, error: findError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    if (findError && findError.code !== 'PGRST116') {
      return NextResponse.json({ error: '좋아요 상태 확인 실패' }, { status: 500 });
    }
    let liked = false;
    if (existing) {
      // 이미 좋아요 → 삭제
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existing.id);
      if (deleteError) {
        return NextResponse.json({ error: '좋아요 취소 실패' }, { status: 500 });
      }
      liked = false;
    } else {
      // 좋아요 추가
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId });
      if (insertError) {
        return NextResponse.json({ error: '좋아요 추가 실패' }, { status: 500 });
      }
      liked = true;
    }
    // 최종 좋아요 수 재조회
    const { count, error: countError } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);
    if (countError) {
      return NextResponse.json({ error: '좋아요 수 조회 실패' }, { status: 500 });
    }
    return NextResponse.json({ liked, totalLikes: count ?? 0 });
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    return NextResponse.json({ error: '좋아요 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}