import { ImageIcon, Pencil, Smile, X } from "lucide-react";
import { useState } from "react";
import { updatePost } from "../../Services/post.services";
import toast from "react-hot-toast";
import { Spinner } from "@heroui/react";

export default function EditPost({postId,
  setShowEditPost,
  onPostUpdated,
}: {
  postId: string;
  setShowEditPost: (arg: boolean) => void;
  onPostUpdated: () => Promise<void>;
}) {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const formData = new FormData();

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
    
  }

  function removeImagePreview() {
    setImagePreview(null);
    setImage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setisLoading(true);
    try {
        formData.append("body", content);
        if (image) {
            formData.append("image", image);
        }
        const { data } = await updatePost(postId, formData);
        console.log(data);
        toast.success(data.message);
        setContent("");
        setImage(null);
        setImagePreview(null);
        setisLoading(false);        
        setShowEditPost(false);
        await onPostUpdated();
    } catch (error) {
        console.error(error);
        toast.error("Failed to update post");
    } finally {
        setisLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, `}
          rows={4}
          className="w-full resize-none rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200"
        />

        <div className="relative mt-3 overflow-hidden rounded-xl">
          <button
            type="button"
            aria-label="Remove image"
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/90 text-gray-700"
          >
            <X onClick={removeImagePreview} className="cursor-pointer" size={16} />
          </button>
          {imagePreview && (
            <img
              src={imagePreview || ""}
              alt="Selected post image"
              className="max-h-64 w-full object-cover"
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900">
              <ImageIcon
                size={18}
                className="pointer-events-none text-emerald-500"
              />
              Photo/video
              <input
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              <Smile size={18} className="pointer-events-none text-amber-500" />
              Feeling/activity
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditPost(false)}
              className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isLoading ? <Spinner className="text-white" size="md" /> : <><Pencil size={14} /> Edit Post</>}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
