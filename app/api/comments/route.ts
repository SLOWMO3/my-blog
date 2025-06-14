/**
 * 댓글 API 라우트 (GET, POST)
 * - GET: 특정 게시물의 댓글 목록 조회 (모든 사용자 접근 가능)
 * - POST: 새 댓글 작성 (Clerk 인증 필수)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Database } from '@/types/database.types';

// 댓글 테이블 타입 정의
// snake_case 필드명 사용
type Comment = Database['public']['Tables']['comments']['Row'];
type CommentInsert = Database['public']['Tables']['comments']['Insert'];

/**
 * GET: 특정 게시물의 댓글 목록 조회
 * Query Parameters: postId (필수)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    if (!postId) {
      return NextResponse.json({ error: 'postId 파라미터가 필요합니다.' }, { status: 400 });
    }
    const supabase = await createServerSupabaseClient();
    // 댓글 목록 조회 (최신순, 작성자 정보 포함)
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    if (error) {
      return NextResponse.json({ error: '댓글을 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
    // 날짜 ISO 변환
    const comments = (data || []).map((c) => ({
      ...c,
      created_at: c.created_at ? new Date(c.created_at).toISOString() : null,
      updated_at: c.updated_at ? new Date(c.updated_at).toISOString() : null,
    }));
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: '댓글 조회 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

/**
 * POST: 새 댓글 작성 (Clerk 인증 필요)
 * Body: { postId: string, content: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }
    const body = await request.json();
    const { postId, content } = body;
    if (!postId || !content) {
      return NextResponse.json({ error: 'postId와 content가 필요합니다.' }, { status: 400 });
    }
    if (content.trim().length < 1) {
      return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }
    if (content.length > 1000) {
      return NextResponse.json({ error: '댓글은 1000자 이하로 작성해주세요.' }, { status: 400 });
    }
    const supabase = await createServerSupabaseClient();
    // 새 댓글 데이터 준비
    const newComment: CommentInsert = {
      post_id: postId,
      user_id: userId,
      content: content.trim(),
      user_name: null, // Clerk에서 추후 연동
      user_email: null, // Clerk에서 추후 연동
      parent_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // 댓글 저장
    const { data, error } = await supabase
      .from('comments')
      .insert([newComment])
      .select('*')
      .single();
    if (error || !data) {
      return NextResponse.json({ error: '댓글 저장 중 오류가 발생했습니다.' }, { status: 500 });
    }
    // 날짜 ISO 변환
    const comment = {
      ...data,
      created_at: data.created_at ? new Date(data.created_at).toISOString() : null,
      updated_at: data.updated_at ? new Date(data.updated_at).toISOString() : null,
    };
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '댓글 작성 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
