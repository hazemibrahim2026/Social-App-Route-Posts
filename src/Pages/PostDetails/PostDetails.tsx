import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  Globe2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import moment from "moment";import { Link } from "react-router";
import { getSinglePost, toggleBookmark } from "../../Services/post.services";
import toast from "react-hot-toast";
import { getPostComments } from "../../Services/comments.services";
import type { PostCardI, TopComment } from "../../Types/postCard.types";
import DetailsSkeleton from "../../Pages/PostDetails/DetailsSkeleton";
import PostComment from "../../Components/PostCard/PostComment";

function PostDetails() {
  const [details, setDetails] = useState<PostCardI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [allComments, setAllComments] = useState<TopComment[] | []>([]);
  const [visibleComments, setVisibleComments] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);

  async function handleToggleBookmark() {
    try {
      const { data } = await toggleBookmark(id!);
      const next = data?.data?.bookmarked ?? !bookmarked;
      setBookmarked(next);
      toast.success(data?.message ?? (next ? "Post saved" : "Post unsaved"));
    } catch (error) {
      toast.error("Failed to save post");
    }
  }
  async function getPostDetails(postId: string) {
    try {
      const { data } = await getSinglePost(postId);
      console.log(data);
      setDetails(data.data.post);
      setBookmarked(!!data.data.post.bookmarked);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getComments(postId: string) {
    try {
      const { data } = await getPostComments(postId);
      console.log(data);
      setAllComments(data.data.comments);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const topCommentId = details?.topComment?._id;
  const orderedComments = topCommentId
    ? [
        ...allComments.filter((c) => c._id === topCommentId),
        ...allComments.filter((c) => c._id !== topCommentId),
      ]
    : allComments;

  useEffect(() => {
    getPostDetails(id!);
    getComments(id!);
  }, [id]);

  return (
    <>
      {isLoading && <DetailsSkeleton />}
      {details && (
        <>
          <div className="mx-auto mt-6 w-full  px-4 sm:px-5">
            <Link
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              to="/feed"
            >
              <ArrowLeft aria-hidden="true" size={17} />
              Back to feed
            </Link>
          </div>
          <article className="mx-auto mb-6 mt-2 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white"
                  src={details.user.photo}
                  alt={details.user.name}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="truncate text-sm font-semibold text-gray-900">
                      {details.user.name}
                    </span>
                    <span className="truncate text-xs text-gray-500">
                      {details.user.username}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                    <span>
                      {moment(details.createdAt).fromNow()}
                    </span>
                    <span aria-hidden="true">·</span>
                    <Globe2 aria-label="Public" size={13} />
                    <span>{details.privacy}</span>
                  </div>
                </div>
              </div>
              <button
                aria-label="More post options"
                className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                type="button"
              >
                <MoreHorizontal size={21} />
              </button>
            </header>

            <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
              <p>{details.body}</p>
            </div>

            {details.image && (
              <img
                className="block max-h-130 w-full bg-gray-100 object-cover"
                src={details.image}
                alt={details.body}
              />
            )}

            <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-white">
                  <Heart aria-hidden="true" fill="currentColor" size={11} />
                </span>
                <span>{details.likesCount} likes</span>
              </div>
              <div className="flex gap-3">
                <span>{details.commentsCount} comments</span>
                <span>{details.sharesCount} shares</span>
              </div>
            </div>

            <div className="mx-4 flex border-y border-gray-200 sm:mx-5">
              <button
                className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium transition hover:bg-gray-50 text-blue-700"
                type="button"
              >
                <Heart fill={"currentColor"} size={18} />
                Like
              </button>
              <button
                className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                type="button"
              >
                <MessageCircle size={18} />
                Comment
              </button>
              <button
                className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                type="button"
              >
                <Share2 size={18} />
                Share
              </button>
              <button
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium transition hover:bg-gray-50 ${bookmarked ? "text-blue-700" : "text-gray-600 hover:text-gray-900"}`}
                type="button"
                onClick={handleToggleBookmark}
              >
                <Bookmark fill={bookmarked ? "currentColor" : "none"} size={18} />
                {bookmarked ? "Saved" : "Save"}
              </button>
            </div>

            <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
              {allComments.length > visibleComments && (
                <button
                  className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900"
                  type="button"
                  onClick={() => setVisibleComments(visibleComments + 2)}
                >
                  Show more comments
                  <ChevronDown size={16} />
                </button>
              )}
              {allComments.length > 0 ? (
                orderedComments.slice(0, visibleComments).map((comment) => {
                  return (
                    <React.Fragment key={comment._id}>
                      <div className="space-y-3 my-3">
                        <div className="flex items-start gap-2.5">
                          <img
                            alt={comment.commentCreator.name}
                            className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                            src={comment.commentCreator.photo}
                          />
                          <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                            {visibleComments === 1 &&
                              comment._id === topCommentId && (
                                <span className="mb-0.5 block text-[11px] font-semibold text-gray-500">
                                  Top Comment
                                </span>
                              )}
                            <div className="">
                              <span className="text-xs font-semibold text-gray-900">
                                {comment.commentCreator.name}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-gray-500">
                                  @{comment.commentCreator.username} ·
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  {new Date(comment.createdAt).toLocaleString(
                                    "en-us",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                            <p className="mt-0.5 wrap-break-word text-sm leading-5 text-gray-800">
                              {comment.content}
                            </p>
                            {comment.image && (
                              <img
                                alt="Comment attachment"
                                className="mt-2 max-h-60 rounded-xl object-cover"
                                src={comment.image}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <>
                  {details.topComment && (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                          <img
                            alt={details.topComment.commentCreator.name}
                            className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                            src={details.topComment.commentCreator.photo}
                          />
                          <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                            <span className="mb-0.5 block text-[11px] font-semibold text-gray-500">
                              Top Comment
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-semibold text-gray-900">
                                {details.topComment.commentCreator.name}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                @{details.topComment.commentCreator.username}·
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {new Date(
                                  details.topComment.createdAt,
                                ).toLocaleString("en-us", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="mt-0.5 wrap-break-word text-sm leading-5 text-gray-800">
                              {details.topComment.content}
                            </p>
                            {details.topComment.image && (
                              <img
                                alt="Comment attachment"
                                className="w-50 h-50 mt-2 max-h-60 rounded-xl object-cover"
                                src={details.topComment.image}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              <PostComment
                postId={details._id}
                onCommentAdded={async () => {
                  const [, commentsData] = await Promise.all([
                    getPostDetails(details._id),
                    getComments(details._id),
                  ]);
                  const total = commentsData?.data?.comments?.length;
                  if (total) setVisibleComments(total);
                }}
              />
            </section>
          </article>
        </>
      )}
    </>
  );
}

export default PostDetails;
