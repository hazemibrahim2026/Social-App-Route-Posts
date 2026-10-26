import { useMemo, useRef, useState, useContext } from "react";
import { addComment, getPostComments } from "../../Services/feed.services";
import moment from "moment";
import { Link, useNavigate } from "react-router";
import {
  Globe,
  Lock,
  Users,
  ThumbsUp,
  MessageCircle,
  Send,
  Smile,
  ImagePlus,
  X,
  Share2,
  MoreHorizontal,
  Bookmark,
  Trash,
  Pencil,
} from "lucide-react";
import type { PostCardI } from "../../Types/postCard.types";
import type { AxiosResponse } from "axios";

type CommentT = NonNullable<PostCardI["topComment"]>;
import defaultProfile from "../../assets/imgi_2_default-profile.png";
import { Button, Dropdown, Label, AlertDialog } from "@heroui/react";
import type { UserContextType } from "../Context/UserContext";
import { UserContext } from "../Context/UserContext";
import EditPost from "./EditPost";
import {
  deletePost,
  getPostLikes,
  toggleBookmark,
  togglePostLike,
} from "../../Services/post.services";
import toast from "react-hot-toast";
import {
  deleteComment,
  getCommentLikes,
  getCommentReplies,
  toggleCommentLike,
  updateComment,
} from "../../Services/comments.services";
import LikesModal from "./LikesModal";
import CreateReply from "./CreateReply";
import { getUserProfile } from "../../Services/profile.services";

const emojis = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😎",
  "🤩",
  "😢",
  "😭",
  "😡",
  "🤔",
  "😮",
  "🙏",
  "👍",
  "👎",
  "👏",
  "🙌",
  "💪",
  "🔥",
  "❤️",
  "💔",
  "🎉",
  "✨",
  "💯",
  "😅",
];

const privacyMap: Record<string, { label: string; Icon: typeof Globe }> = {
  public: { label: "Public", Icon: Globe },
  friends: { label: "Friends", Icon: Users },
  private: { label: "Only me", Icon: Lock },
};

export default function PostCard({
  post,
  onPostUpdated,
}: {
  post: PostCardI;
  onPostUpdated: () => Promise<void>;
}) {
  const { userDetails } = useContext(UserContext) as UserContextType;
  const [liked, setLiked] = useState(
    () => !!userDetails?._id && !!post.likes?.includes(userDetails._id),
  );
  const [postLikesCount, setPostLikesCount] = useState(
    post.likesCount ?? post.likes?.length ?? 0,
  );
  const [showAll, setShowAll] = useState(false);
  const [allComments, setAllComments] = useState<PostCardI["topComment"][]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [showEmojis, setShowEmojis] = useState(false);
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEditPost, setShowEditPost] = useState<boolean>(false);
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(!!post.bookmarked);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [savingComment, setSavingComment] = useState(false);
  const [deletedCommentIds, setDeletedCommentIds] = useState<string[]>([]);
  const [commentOverrides, setCommentOverrides] = useState<
    Record<string, string>
  >({});
  const [replies, setReplies] = useState<Record<string, CommentT[]>>({});
  const [openReplies, setOpenReplies] = useState<string[]>([]);
  const [loadingReplyIds, setLoadingReplyIds] = useState<string[]>([]);
  const [commentLikes, setCommentLikes] = useState<
    Record<string, { liked: boolean; count: number }>
  >({});
  const [likesModal, setLikesModal] = useState<{
    title: string;
    fetchLikes: () => Promise<AxiosResponse>;
  } | null>(null);
  const navigate = useNavigate();

  async function handleToggleBookmark() {
    try {
      const { data } = await toggleBookmark(post._id);
      const next = data?.data?.bookmarked ?? !bookmarked;
      setBookmarked(next);
      toast.success(data?.message ?? (next ? "Post saved" : "Post unsaved"));
    } catch (error) {
      toast.error("Failed to save post");
    }
  }
  const imagePreview = useMemo(
    () => (commentImage ? URL.createObjectURL(commentImage) : null),
    [commentImage],
  );

  const { label: privacyLabel, Icon: PrivacyIcon } =
    privacyMap[post.privacy] ?? privacyMap.public;
  const topComment =
    post.topComment && !deletedCommentIds.includes(post.topComment._id)
      ? post.topComment
      : null;
  const visibleComments = (
    showAll ? allComments : topComment ? [topComment] : []
  ).map((c) =>
    c && commentOverrides[c._id] !== undefined
      ? { ...c, content: commentOverrides[c._id] }
      : c,
  );

  async function showAllComments() {
    setShowAll(true);
    if (allComments.length > 0) return;
    setLoadingComments(true);
    try {
      const res = await getPostComments(post._id);
      const list = res.data?.data?.comments ?? res.data?.comments ?? [];
      setAllComments(list);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setShowAll(false);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    const content = commentText.trim();
    if ((!content && !commentImage) || submitting) return;
    setSubmitting(true);
    try {
      await addComment(post._id, content, commentImage);
      setCommentText("");
      setCommentImage(null);
      setShowEmojis(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setCommentsCount((n) => n + 1);
      const res = await getPostComments(post._id);
      setAllComments(res.data?.data?.comments ?? res.data?.comments ?? []);
      setShowAll(true);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  }

  function insertEmoji(emoji: string) {
    const input = commentInputRef.current;
    const start = input?.selectionStart ?? commentText.length;
    const end = input?.selectionEnd ?? commentText.length;
    setCommentText(
      commentText.slice(0, start) + emoji + commentText.slice(end),
    );
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) setCommentImage(file);
  }

  function toggleComments() {
    if (showAll) setShowAll(false);
    else showAllComments();
  }

  function startEditComment(commentId: string, content: string) {
    setEditingCommentId(commentId);
    setEditingContent(content ?? "");
  }

  function cancelEditComment() {
    setEditingCommentId(null);
    setEditingContent("");
  }

  async function handleSaveComment(commentId: string) {
    const content = editingContent.trim();
    if (!content || savingComment) return;
    setSavingComment(true);
    try {
      const { data } = await updateComment(post._id, commentId, content);
      toast.success(data?.message ?? "Comment updated");
      setCommentOverrides((prev) => ({ ...prev, [commentId]: content }));
      setAllComments((prev) =>
        prev.map((c) => (c?._id === commentId ? { ...c, content } : c)),
      );
      cancelEditComment();
    } catch (error) {
      toast.error("Failed to update comment");
    } finally {
      setSavingComment(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const { data } = await deleteComment(post._id, commentId);
      toast.success(data?.message ?? "Comment deleted");
      setDeletedCommentIds((prev) => [...prev, commentId]);
      setAllComments((prev) => prev.filter((c) => c?._id !== commentId));
      setCommentsCount((n) => Math.max(0, n - 1));
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  }

  async function refreshReplies(commentId: string) {
    try {
      const { data } = await getCommentReplies(post._id, commentId);
      const body = data?.data ?? data;
      const list: CommentT[] = Array.isArray(body)
        ? body
        : (body?.replies ?? body?.comments ?? []);
      setReplies((prev) => ({ ...prev, [commentId]: list }));
    } catch (error) {
      toast.error("Failed to get replies");
    }
  }

  async function getReplies(commentId: string) {
    if (openReplies.includes(commentId)) {
      setOpenReplies((prev) => prev.filter((id) => id !== commentId));
      return;
    }
    setOpenReplies((prev) => [...prev, commentId]);
    if (replies[commentId]) return;
    setLoadingReplyIds((prev) => [...prev, commentId]);
    await refreshReplies(commentId);
    setLoadingReplyIds((prev) => prev.filter((id) => id !== commentId));
  }

  async function handleTogglePostLike() {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setPostLikesCount((n) => Math.max(0, n + (wasLiked ? -1 : 1)));
    try {
      await togglePostLike(post._id);
    } catch (error) {
      setLiked(wasLiked);
      setPostLikesCount((n) => Math.max(0, n + (wasLiked ? 1 : -1)));
      toast.error("Failed to update like");
    }
  }

  function getCommentLike(comment: CommentT) {
    return (
      commentLikes[comment._id] ?? {
        liked: !!userDetails?._id && !!comment.likes?.includes(userDetails._id),
        count: comment.likes?.length ?? 0,
      }
    );
  }

  async function handleToggleCommentLike(comment: CommentT) {
    const prev = getCommentLike(comment);
    const next = {
      liked: !prev.liked,
      count: Math.max(0, prev.count + (prev.liked ? -1 : 1)),
    };
    setCommentLikes((p) => ({ ...p, [comment._id]: next }));
    try {
      await toggleCommentLike(post._id, comment._id);
    } catch (error) {
      setCommentLikes((p) => ({ ...p, [comment._id]: prev }));
      toast.error("Failed to update like");
    }
  }

  function renderCommentActions(comment: CommentT, isReply = false) {
    const like = getCommentLike(comment);
    return (
      <div className="mt-1 flex items-center gap-3 px-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => handleToggleCommentLike(comment)}
          className={`cursor-pointer hover:underline ${like.liked ? "text-blue-600" : "text-gray-500"}`}
        >
          {like.liked ? "Liked" : "Like"}
        </button>
        {like.count > 0 && (
          <button
            type="button"
            onClick={() =>
              setLikesModal({
                title: "Comment reactions",
                fetchLikes: () => getCommentLikes(post._id, comment._id),
              })
            }
            className="flex cursor-pointer items-center gap-1 text-gray-500 hover:underline"
          >
            <ThumbsUp className="size-3" />
            {like.count}
          </button>
        )}
        {!isReply && (
          <button
            type="button"
            onClick={() => getReplies(comment._id)}
            disabled={loadingReplyIds.includes(comment._id)}
            className="cursor-pointer text-gray-500 hover:underline disabled:opacity-60"
          >
            {loadingReplyIds.includes(comment._id)
              ? "Loading replies..."
              : openReplies.includes(comment._id)
                ? "Hide replies"
                : "View replies"}
          </button>
        )}
      </div>
    );
  }

  async function handleDeletePost(postId: string) {
    try {
      const { data } = await deletePost(postId);
      toast.success(data.message);
      onPostUpdated();
    } catch (error) {
      toast.error("Failed to delete post");
    }
  }

  async function getProfile(userId: string) {
    try {
      const { data } = await getUserProfile(userId);
      const user = data?.data?.user ?? data?.user ?? data?.data;
      const id = user?._id ?? userId;
      if (id === userDetails?._id) navigate("/profile");
      else navigate(`/profile/${id}`, { state: { user } });
    } catch (error) {
      toast.error("Failed to load user profile");
    }
  }
  return (
    <article className="w-full overflow-hidden rounded-xl bg-white shadow-sm">
      {likesModal && (
        <LikesModal
          title={likesModal.title}
          fetchLikes={likesModal.fetchLikes}
          onClose={() => setLikesModal(null)}
        />
      )}
      <header className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <button
            className="cursor-pointer"
            onClick={() => getProfile(post.user._id)}
          >
            <img
              src={post.user.photo || defaultProfile}
              alt={post.user.name}
              className="size-10 rounded-full object-cover"
            />
          </button>
          <div className="leading-tight">
            <h3 className="text-sm font-semibold text-gray-900">
              <button className="cursor-pointer hover:underline" onClick={() => getProfile(post.user._id)}>{post.user.name}{" "}</button><br />
              <span className="font-normal text-gray-500">
                @{post.user.username}
              </span>
            </h3>

            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
              <span>{moment(post.createdAt).fromNow()}</span>
              <span>·</span>
              <PrivacyIcon className="size-3" aria-label={privacyLabel} />
              <span>{post.privacy}</span>
            </p>
          </div>
        </div>
        <div className="rounded-full p-2 text-gray-500 hover:bg-secondary">
          {post.user._id === userDetails?._id ? (
            <>
              <Dropdown>
                <Button aria-label="Menu" variant="ghost">
                  <MoreHorizontal className="size-5 cursor-pointer" />
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    onAction={(key) => console.log(`Selected: ${key}`)}
                  >
                    <Dropdown.Item
                      id="save-post"
                      textValue="Save Post"
                      onClick={handleToggleBookmark}
                    >
                      <Label className="flex items-center gap-2">
                        <Bookmark
                          size={16}
                          fill={bookmarked ? "currentColor" : "none"}
                        />
                        <span>
                          {bookmarked ? "Unsave Post" : "Save Post"}
                        </span>{" "}
                      </Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="flex items-center gap-2"
                      id="edit-post"
                      textValue="Edit post"
                      onClick={() => setShowEditPost(true)}
                    >
                      <Label className="flex items-center gap-2">
                        <Pencil size={16} />
                        <span>Edit post</span>
                      </Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="flex items-center gap-2"
                      id="delete-post"
                      textValue="Delete Post"
                      variant="danger"
                      onClick={() => setShowDeleteDialogue(true)}
                    >
                      <Label className="flex items-center gap-2">
                        <Trash size={16} />
                        <span>Delete Post</span>
                      </Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </>
          ) : (
            <>
              <Dropdown>
                <Button aria-label="Menu" variant="ghost">
                  <MoreHorizontal className="size-5 cursor-pointer" />
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    onAction={(key) => console.log(`Selected: ${key}`)}
                  >
                    <Dropdown.Item
                      id="save-post"
                      textValue="Save Post"
                      onClick={handleToggleBookmark}
                    >
                      <Label className="flex items-center gap-2">
                        <Bookmark
                          size={16}
                          fill={bookmarked ? "currentColor" : "none"}
                        />
                        <span>
                          {bookmarked ? "Unsave Post" : "Save Post"}
                        </span>{" "}
                      </Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </>
          )}
        </div>
      </header>
      <AlertDialog isOpen={showDeleteDialogue}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-100">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>
                  Delete post permanently?
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  onClick={() => setShowDeleteDialogue(false)}
                  slot="close"
                  variant="tertiary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeletePost(post._id)}
                  slot="close"
                  variant="danger"
                >
                  Delete Post
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
      {showEditPost ? (
        <EditPost
          postId={post._id}
          setShowEditPost={setShowEditPost}
          onPostUpdated={onPostUpdated}
        />
      ) : (
        <>
          {post.body && (
            <p className="px-4 pb-3 text-[15px] text-gray-900">{post.body}</p>
          )}
          {bookmarked && (
            <p className="my-3 ml-2 inline-flex items-center gap-1 rounded-full bg-[#e7f3ff] px-2.5 py-1 text-[11px] font-bold text-[#1877f2]">
              <Bookmark size={16} />
              Saved
            </p>
          )}
          {post.image && (
            <img
              src={post.image}
              alt={post.body || "PostImage"}
              className="max-h-140 w-full object-cover"
            />
          )}
        </>
      )}
      <div className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-500">
        <button
          type="button"
          onClick={() =>
            setLikesModal({
              title: "Post reactions",
              fetchLikes: () => getPostLikes(post._id),
            })
          }
          className="flex cursor-pointer items-center gap-1.5 hover:underline"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-white">
            <ThumbsUp className="size-3" />
          </span>
          {postLikesCount}
        </button>
        <span className="flex gap-3">
          <span>{commentsCount} comments</span>
          <span>{post.sharesCount} shares</span>
          <Link
            className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
            to={`/postDetails/${post._id}`}
          >
            View Details
          </Link>
        </span>
      </div>
      <div className="mx-4 grid grid-cols-3 gap-1 border-y border-gray-200 py-1">
        <button
          type="button"
          onClick={handleTogglePostLike}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm font-medium hover:bg-secondary ${
            liked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <ThumbsUp className={`size-5 ${liked ? "fill-blue-600" : ""}`} />
          Like
        </button>
        <button
          type="button"
          onClick={() => commentInputRef.current?.focus()}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-gray-600 hover:bg-secondary"
        >
          <MessageCircle className="size-5" />
          Comment
        </button>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-gray-600 hover:bg-secondary"
        >
          <Share2 className="size-5" />
          Share
        </button>
      </div>
      {(topComment || visibleComments.length > 0) && (
        <section className="space-y-3 px-4 pt-4">
          {commentsCount > 1 && (
            <button
              type="button"
              onClick={toggleComments}
              disabled={loadingComments}
              className="cursor-pointer text-sm font-semibold text-gray-500 hover:underline disabled:opacity-60"
            >
              {loadingComments
                ? "Loading comments..."
                : showAll
                  ? "Hide comments"
                  : `View all ${commentsCount} comments`}
            </button>
          )}

          {visibleComments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-2 w-full">
              <img
                src={comment.commentCreator?.photo || defaultProfile}
                alt={comment.commentCreator?.name}
                className="size-8 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2">
                {!showAll && comment._id === topComment?._id && (
                  <span className="ml-3 text-xs font-semibold text-gray-500">
                    Top Comment
                  </span>
                )}
                <div className="rounded-2xl bg-secondary px-3 py-2 w-full">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[13px] font-semibold text-gray-900">
                      {comment.commentCreator?.name}
                    </h4>
                    {userDetails &&
                      (comment.commentCreator._id === userDetails._id ||
                        post.user._id === userDetails._id) && (
                        <Dropdown>
                          <Button aria-label="Menu" variant="ghost">
                            <MoreHorizontal className="size-5 cursor-pointer" />
                          </Button>
                          <Dropdown.Popover>
                            <Dropdown.Menu
                              onAction={(key) => {
                                if (key === "edit-comment")
                                  startEditComment(
                                    comment._id,
                                    comment.content,
                                  );
                                if (key === "delete-comment")
                                  handleDeleteComment(comment._id);
                              }}
                            >
                              {comment.commentCreator._id ===
                              userDetails._id ? (
                                <Dropdown.Item
                                  className="flex items-center gap-2"
                                  id="edit-comment"
                                  textValue="Edit comment"
                                >
                                  <Label className="flex items-center gap-2">
                                    <Pencil size={16} />
                                    <span>Edit Comment</span>
                                  </Label>
                                </Dropdown.Item>
                              ) : null}
                              <Dropdown.Item
                                className="flex items-center gap-2"
                                id="delete-comment"
                                textValue="Delete Comment"
                                variant="danger"
                              >
                                <Label className="flex items-center gap-2">
                                  <Trash size={16} />
                                  <span>Delete Comment</span>
                                </Label>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown>
                      )}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] text-gray-500">
                      @{comment.commentCreator?.username} ·
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {new Date(comment.createdAt).toLocaleString("en-us", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {editingCommentId === comment._id ? (
                    <div className="mt-1 flex flex-col gap-2">
                      <input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveComment(comment._id);
                          if (e.key === "Escape") cancelEditComment();
                        }}
                        autoFocus
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-400"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveComment(comment._id)}
                          disabled={!editingContent.trim() || savingComment}
                          className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          {savingComment ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditComment}
                          className="rounded-md bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-800">{comment.content}</p>
                  )}
                </div>
                {comment.image && (
                  <img
                    src={comment.image}
                    alt="Comment attachment"
                    className="mt-2 h-full w-full rounded-lg object-cover"
                  />
                )}
                {renderCommentActions(comment)}
                {openReplies.includes(comment._id) && (
                  <div className="mt-2 space-y-2 border-l-2 border-slate-200 pl-3">
                    {(replies[comment._id] ?? []).length === 0 &&
                      !loadingReplyIds.includes(comment._id) && (
                        <p className="text-xs text-gray-500">No replies yet.</p>
                      )}
                    {(replies[comment._id] ?? []).map((reply) => (
                      <div key={reply._id} className="flex items-start gap-2">
                        <img
                          src={reply.commentCreator?.photo || defaultProfile}
                          alt={reply.commentCreator?.name}
                          className="size-6 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="rounded-2xl bg-secondary px-3 py-2">
                            <h5 className="text-[12px] font-semibold text-gray-900">
                              {reply.commentCreator?.name}
                            </h5>
                            <p className="text-sm text-gray-800">
                              {reply.content}
                            </p>
                          </div>
                          {renderCommentActions(reply, true)}
                        </div>
                      </div>
                    ))}
                    <CreateReply
                      postId={post._id}
                      commentId={comment._id}
                      onReplyAdded={() => refreshReplies(comment._id)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
      <form onSubmit={handleAddComment} className="flex items-start gap-2 p-4">
        <img
          src={userDetails?.photo}
          alt="You"
          className="size-8 rounded-full object-cover"
        />
        <div className="relative flex-1">
          <div className="flex items-center rounded-full bg-secondary px-3">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-transparent py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500"
            />

            <button
              type="button"
              aria-label="Add emoji"
              onClick={() => setShowEmojis((v) => !v)}
              className="cursor-pointer rounded-full p-1.5 text-gray-500 hover:bg-gray-200"
            >
              <Smile className="size-4" />
            </button>

            {/* Image attach button (hidden native file input) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              aria-label="Attach image"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-full p-1.5 text-gray-500 hover:bg-gray-200"
            >
              <ImagePlus className="size-4" />
            </button>

            <button
              type="submit"
              aria-label="Send comment"
              disabled={(!commentText.trim() && !commentImage) || submitting}
              className="cursor-pointer rounded-full p-1.5 text-blue-600 hover:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              <Send className="size-4" />
            </button>
          </div>

          {/* Emoji grid popover */}
          {showEmojis && (
            <div className="absolute right-0 bottom-full z-10 mb-2 grid w-64 grid-cols-6 gap-1 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-200">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="cursor-pointer rounded-md p-1 text-xl hover:bg-secondary"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Selected image preview with remove button */}
          {imagePreview && (
            <div className="relative mt-2 inline-block">
              <img
                src={imagePreview}
                alt="Selected"
                className="max-h-32 rounded-xl object-cover"
              />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => {
                  setCommentImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>
      </form>{" "}
    </article>
  );
}
