"use client";

import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { Comment as ApiComment } from "@/types/comment";
import { Textarea } from "@/components/ui/textarea";
import CommentEditForm from './comment-edit-form';
import CommentItem from './comment-item';

// API → 프론트엔드 타입 변환 함수
function convertCommentFromApi(api: any): ApiComment {
  return {
    id: api.id,
    postId: api.post_id,
    userId: api.user_id,
    authorName: api.user_name || '익명',
    authorEmail: api.user_email || '',
    content: api.content,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    parentId: api.parent_id,
    status: api.status || 'approved',
    likeCount: api.like_count ?? 0,
    dislikeCount: api.dislike_count ?? 0,
    reportCount: api.report_count ?? 0,
    isEdited: !!api.is_edited,
    isPinned: !!api.is_pinned,
    isAuthor: !!api.is_author,
  };
}

interface CommentSectionProps {
  postId: string;
  postTitle: string;
}

export default function CommentSection({ postId, postTitle }: CommentSectionProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // 댓글 목록 불러오기
  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (!res.ok) throw new Error("댓글을 불러오지 못했습니다.");
      const data = await res.json();
      setComments((data.comments || []).map(convertCommentFromApi));
    } catch (e: any) {
      setError(e.message || "댓글 목록 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return setError("댓글 내용을 입력해주세요.");
    if (content.length > 1000) return setError("댓글은 1000자 이하로 작성해주세요.");
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "댓글 작성에 실패했습니다.");
      }
      const data = await res.json();
      setComments([convertCommentFromApi(data.comment), ...comments]);
      setContent("");
    } catch (e: any) {
      setError(e.message || "댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 수정 핸들러 (수정 폼에서 호출)
  const handleEditSave = (updated: ApiComment) => {
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditId(null);
  };
  // 댓글 수정 취소 핸들러
  const handleEditCancel = () => {
    setEditId(null);
  };

  // 댓글 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "댓글 삭제에 실패했습니다.");
      }
      setComments(comments.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e.message || "댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 본인 댓글 여부
  const isMyComment = (comment: ApiComment): boolean => !!(user?.id && comment.userId === user.id);

  // UI 렌더링
  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">댓글</h2>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
          {comments.length}개
        </span>
      </div>

      {/* 댓글 작성 폼 */}
      <SignedIn>
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> 댓글 작성
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 입력해주세요..."
                rows={4}
                disabled={submitting}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting} className="px-6">
                  {submitting ? "작성 중..." : "댓글 작성"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SignedIn>

      <SignedOut>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                댓글을 작성하려면 로그인이 필요합니다
              </h3>
              <p className="text-gray-500 mb-4">로그인하고 다른 사용자들과 의견을 나눠보세요.</p>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg">로그인하기</Button>
              </SignInButton>
            </div>
          </CardContent>
        </Card>
      </SignedOut>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 로딩 상태 */}
      {/* 댓글 목록 */}
      {loading ? (
        <div className="py-8 text-center text-gray-400">댓글을 불러오는 중...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">아직 댓글이 없습니다</h3>
          <p className="text-gray-500">첫 번째 댓글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={{ ...comment, isMine: isMyComment(comment) }}
              isEditing={editId === comment.id}
              onEdit={() => setEditId(comment.id)}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
              onDelete={() => handleDelete(comment.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}