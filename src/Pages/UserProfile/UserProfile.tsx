import { FileText, UserCheck, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { followUser } from "../../Services/feed.services";

import { getUserPosts, getUserProfile } from "../../Services/profile.services";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { userProfileType } from "../../Types/user.types";
import type { PostCardI } from "../../Types/postCard.types";
import PostCard from "../../Components/PostCard/PostCard";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<userProfileType | null>(null);
  const [userPosts, setUserPosts] = useState<PostCardI[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await getUserProfile(id);
        setUser(data?.data?.user ?? data?.user ?? data?.data);
        setIsFollowing(Boolean(data?.data?.isFollowing));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);

  async function loadPosts() {
    if (!id) return;
    try {
      const { data } = await getUserPosts(id);
      const list = data?.data?.posts ?? data?.posts ?? data?.data;
      setUserPosts(Array.isArray(list) ? list : []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [id]);

  async function handleFollow() {
    if (!id || followLoading) return;
    setFollowLoading(true);
    try {
      const { data } = await followUser(id);
      const next = data?.data?.following ?? !isFollowing;
      setIsFollowing(Boolean(next));
      toast.success(data?.message ?? (next ? "Followed" : "Unfollowed"));
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  }

  return (
    <>
        {user && <title>{`${user.name} Profile | Route Posts`}</title>}
    
      <main className="min-h-screen bg-sec py-6">
        <div className="container mx-auto max-w-6xl px-4">
          <section className="relative">
            {user?.cover ? (
              <>
                <img
                  src={user?.cover}
                  alt={user?.name}
                  className="h-36 w-full rounded-3xl object-cover sm:h-44"
                />
              </>
            ) : (
              <div className="h-36 rounded-3xl bg-linear-to-r from-slate-900 via-blue-950 to-slate-700 sm:h-44" />
            )}
            <div className="relative mx-2 -mt-16 rounded-3xl bg-white p-5 shadow-sm sm:mx-4 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={user?.photo}
                    alt={user?.name}
                    className="h-28 w-28 shrink-0 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                  />
                  <div>
                    <h1 className="text-2xl font-bold capitalize text-gray-900">
                      {user?.name}
                    </h1>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="grid grid-cols-3 gap-3 lg:min-w-80"></div>
                  <button
                    type="button"
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isFollowing
                        ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        : "bg-[#1877f2] text-white hover:bg-[#166fe5]"
                    }`}
                  >
                    {isFollowing ? (
                      <UserCheck size={16} />
                    ) : (
                      <UserPlus size={16} />
                    )}
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="my-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-600 shadow-sm">
                <FileText size={16} />
                Posts
              </span>
            </div>
            <span className="grid size-7 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
              {userPosts.length}
            </span>
          </section>
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} onPostUpdated={loadPosts} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
