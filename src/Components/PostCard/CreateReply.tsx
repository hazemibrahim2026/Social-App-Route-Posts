import { ImagePlus, Send, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { createCommentReply } from "../../Services/comments.services";
import toast from "react-hot-toast";
import { UserContext } from "../Context/UserContext";

export default function CreateReply({
  postId,
  commentId,
  onReplyAdded,
}: {
  postId: string;
  commentId: string;
  onReplyAdded?: () => void | Promise<void>;
}) {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const userDetails = useContext(UserContext)?.userDetails;

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  }

  function removeImagePreview() {
    setImage(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = content.trim();
    if ((!text && !image) || submitting) return;
    const formData = new FormData();
    if (text) formData.append("content", text);
    if (image) formData.append("image", image);
    setSubmitting(true);
    try {
      const { data } = await createCommentReply(postId, commentId, formData);
      toast.success(data?.message ?? "Reply added");
      setContent("");
      removeImagePreview();
      await onReplyAdded?.();
    } catch (error) {
      toast.error("Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <img
            alt="Your profile"
            className="size-6 shrink-0 rounded-full object-cover"
            src={userDetails?.photo}
          />
          <div className="flex min-w-0 flex-1 items-center rounded-full bg-gray-100 pr-1.5 focus-within:ring-2 focus-within:ring-blue-200">
            <span className="sr-only">Write a reply</span>
            <input
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500"
              placeholder="Write a reply..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100">
              <span className="sr-only">Add an image</span>
              <input
                accept="image/*"
                className="sr-only"
                type="file"
                onChange={handleImageChange}
              />
              <ImagePlus size={16} />
            </label>
            <button
              aria-label="Post reply"
              disabled={submitting || (!content.trim() && !image)}
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
              type="submit"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>
      {imagePreview && (
        <div className="relative mt-2 w-fit">
          <img
            className="size-24 rounded-lg object-cover"
            src={imagePreview}
            alt="Preview"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={removeImagePreview}
            className="absolute right-1 top-1 cursor-pointer rounded-full bg-black/50 p-0.5 text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
