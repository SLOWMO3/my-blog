import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Database } from '@/types/database.types';

// 댓글 테이블 타입 정의 (snake_case)
type Comment = Database['public']['Tables']['comments']['Row'];

// 댓글 수정 (PUT)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }
    const commentId = params.id;
    const body = await request.json();
    const { content } = body;
    if (!content || content.trim().length < 1) {
      return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }
    if (content.length > 1000) {
      return NextResponse.json({ error: '댓글은 1000자 이하로 작성해주세요.' }, { status: 400 });
    }
    const supabase = await createServerSupabaseClient();
    // 댓글 존재 및 권한 확인
    const { data: comment, error: getError } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single();
    if (getError || !comment) {
      return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }
    if (comment.user_id !== userId) {
      return NextResponse.json({ error: '수정 권한이 없습니다.' }, { status: 403 });
    }
    // 댓글 내용 수정
    const { data: updated, error: updateError } = await supabase
      .from('comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .select('*')
      .single();
    if (updateError || !updated) {
      return NextResponse.json({ error: '댓글 수정에 실패했습니다.' }, { status: 500 });
    }
    // 날짜 ISO 변환
    const result = {
      ...updated,
      created_at: updated.created_at ? new Date(updated.created_at).toISOString() : null,
      updated_at: updated.updated_at ? new Date(updated.updated_at).toISOString() : null,
    };
    return NextResponse.json({ comment: result });
  } catch (error) {
    return NextResponse.json({ error: '댓글 수정 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 댓글 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }
    const commentId = params.id;
    const supabase = await createServerSupabaseClient();
    // 댓글 존재 및 권한 확인
    const { data: comment, error: getError } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single();
    if (getError || !comment) {
      return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }
    if (comment.user_id !== userId) {
      return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
    }
    // 댓글 삭제
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (deleteError) {
      return NextResponse.json({ error: '댓글 삭제에 실패했습니다.' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '댓글 삭제 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}