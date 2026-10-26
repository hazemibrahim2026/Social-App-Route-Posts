import { ChevronDown, Globe, ImageIcon, Send, Smile, X } from "lucide-react";
import { useState, useContext } from "react";
import { UserContext, type UserContextType } from "../../Components/Context/UserContext";
import { toast } from "react-hot-toast";
import { createPost } from "../../Services/post.services";
import { Spinner } from "@heroui/react";



export default function CreatePost({ getAllPosts }: { getAllPosts: () => void }) {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const formData = new FormData();
  const [privacy, setPrivacy] = useState<string>("public");
  const { userDetails } = useContext(UserContext) as UserContextType;
  

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      formData.append("privacy", privacy);
      if (image) {
        formData.append("image", image);
      }
      const { data } = await createPost(formData);
      toast.success(data.message);
      setContent("");
      setImage(null);
      setImagePreview(null);
      getAllPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to create post.",
      );
    } finally {
      setisLoading(false);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <header className="mb-3 flex items-start gap-3">
        <img
          alt={userDetails?.name}
          className="size-11 shrink-0 rounded-full object-cover"
          src={userDetails?.photo}
        />
        <div className="min-w-0">
          <p className="text-sm font-bold capitalize text-gray-900">
            {userDetails?.name}
          </p>
          <label className="relative mt-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-2.5 pr-7 text-xs font-medium text-gray-600">
            <Globe size={12} aria-hidden="true" />

            <span className="sr-only">Post privacy</span>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent outline-none"
            >
              <option value="private">Only me</option>
              <option value="public">Public</option>
            </select>
            <ChevronDown
              size={12}
              aria-hidden="true"
              className="pointer-events-none absolute right-2"
            />
          </label>
        </div>
      </header>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What's on your mind, ${userDetails?.name.split(" ")[0]}?`}
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

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? <Spinner className="text-white" size="md" /> : "Post"}
          <Send size={14} />
        </button>
      </div>
    </form>
  );
}
