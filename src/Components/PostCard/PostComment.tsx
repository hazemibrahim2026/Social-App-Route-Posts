import { ImagePlus, Send, X } from "lucide-react";
import { useContext, useState } from "react";
import { createPostComment } from "../../Services/comments.services";
import toast from "react-hot-toast";
import { UserContext } from "../Context/UserContext";

function PostComment({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded?: () => void;
}) {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const userDetails = useContext(UserContext)?.userDetails;
  

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function removeImagePreview() {    
    setImagePreview(null);
  }

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();   
    const formData = new FormData(); 
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    try {
      const {data} = await createPostComment(postId, formData)
      toast.success(data.message);
      setContent("");
      setImage(null);
      setImagePreview(null);
      onCommentAdded?.();
    } catch (error) {
      toast.error("Failed to post comment.");
    }
  }

  return (
    <>
      <form className="mt-4 flex flex-col gap-2 pb-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2.5">
          <img
            alt="Your profile"
            className="size-8 shrink-0 rounded-full object-cover"
            src={userDetails?.photo}
          />
          <div className="flex min-w-0 flex-1 items-center rounded-full bg-gray-100 pr-1.5 focus-within:ring-2 focus-within:ring-blue-200">
            <span className="sr-only">Write a comment</span>
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500"
              id="post-details-comment"
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100">
              <span className="sr-only">Add an image</span>
              <input
                accept="image/*"
                className="sr-only w-50 h-50 object-cover"
                type="file"
                onChange={handleImageChange}
              />
              <ImagePlus size={16} />
            </label>
            <button
              aria-label="Post comment"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 disabled:text-gray-400 disabled:hover:bg-transparent"
              type="submit"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>
      {imagePreview && (
        <>
          <div className="relative w-full">
            <img
              className="w-50 h-50 object-cover"
              src={imagePreview}
              alt="Preview"
            />
            <X
              className="absolute top-0 right-0 cursor-pointer"
              size={16}
              onClick={() => {
                removeImagePreview();
              }}
            />
          </div>
        </>
      )}
    </>
  );
}

export default PostComment;
