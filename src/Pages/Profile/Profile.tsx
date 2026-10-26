import { useCallback, useContext, useEffect, useState } from "react";
import { getMyBookmarks, getUserPosts } from "../../Services/profile.services";
import {
  Bookmark,
  Camera,
  Expand,
  Eye,  
  Trash2,
  Mail,
  Sparkles,
  X,
  FileText,
} from "lucide-react";
import {
  UserContext,
  
} from "../../Components/Context/UserContext";
import PostCard from "../../Components/PostCard/PostCard";
import type { PostCardI } from "../../Types/postCard.types";
import { useSearchParams } from "react-router";

function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [savedCount, setSavedCount] = useState(0);
  const [savedPosts, setSavedPosts] = useState<PostCardI[]>([]);
  const [myPostsCount, setMyPostsCount] = useState(0);
  const [myPosts, setMyPosts] = useState<PostCardI[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [viewCover, setViewCover] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [, setProfilePhoto] = useState<File | null>(null);
  
  const coverBtnClass =
    "pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs";
  const userContext = useContext(UserContext);
  const userDetails = userContext?.userDetails;
  const activeTab = searchParams.get("tab") === "saved" ? "saved" : "posts";

  const loadSaved = useCallback(async () => {
    try {
      const { data } = await getMyBookmarks();
      const list: PostCardI[] = data?.data?.bookmarks ?? data?.bookmarks ?? [];
      setSavedPosts(list);
      setSavedCount(data?.meta?.pagination?.total ?? list.length);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadMyPosts = useCallback(async () => {
    if (!userDetails?.id) return;
    try {
      const { data } = await getUserPosts(userDetails.id);
      const list: PostCardI[] = data?.data?.posts ?? data?.posts ?? [];
      setMyPosts(list);
      setMyPostsCount(data?.meta?.pagination?.total ?? list.length);
    } catch (error) {
      console.log(error);
    }
  }, [userDetails]);

  useEffect(() => {
    if (!userDetails?.id) return;
    setCoverUrl(localStorage.getItem(`coverPhoto_${userDetails.id}`));
  }, [userDetails?.id]);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  useEffect(() => {
    loadMyPosts();
  }, [loadMyPosts]);

  // const profile = {
  //   photo: userDetails?.photo || defaultProfile,
  //   name: userDetails?.name ?? "",
  //   username: userDetails?.username ? `@${userDetails.username}` : "",
  //   email: userDetails?.email ?? "",
  //   followers: userDetails?.followersCount ?? userDetails?.followers?.length ?? 0,
  //   following: userDetails?.followingCount ?? userDetails?.following?.length ?? 0,
  //   bookmarks: userDetails?.bookmarksCount ?? userDetails?.bookmarks?.length ?? 0,
  //   myPosts: 0,
  //   savedPosts: userDetails?.bookmarksCount ?? userDetails?.bookmarks?.length ?? 0,
  // };
  const visiblePosts = activeTab === "saved" ? savedPosts : myPosts;
  function changeCoverPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCoverPhoto(file);
    e.target.value = "";
  }
  function saveCover() {
    if (!coverPhoto) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCoverUrl(dataUrl);
      try {
        localStorage.setItem(`coverPhoto_${userDetails?.id}`, dataUrl);
      } catch {
        console.error("Cover image is too large to store locally.");
      }
    };
    reader.readAsDataURL(coverPhoto);
    setCoverPhoto(null);
  }
  function removeCover() {
    setCoverUrl(null);
    localStorage.removeItem(`coverPhoto_${userDetails?.id}`);
  }
  function cancelCover() {
    setCoverPhoto(null);
  }
  function changeProfilePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setProfilePhoto(file);
    e.target.value = "";
  }

  return (
    <>
    {userDetails && <title>{`${userDetails.name} Profile | Route Posts`}</title>}
      {userDetails && (
        <>
          <main className="min-h-screen bg-sec py-6">
            <div className="container mx-auto max-w-6xl px-4">
              <section className="relative">
                {coverPhoto ? (
                  <>
                    <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/60 p-4">
                      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
                        <h3 className="text-lg font-extrabold text-slate-900">
                          Cover post privacy
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Choose who can see the post generated for your new
                          cover photo.
                        </p>
                        <div className="mt-4">
                          <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#1877f2]">
                            <option value="public">Public</option>
                            <option value="following">Followers</option>
                            <option value="only_me">Only me</option>
                          </select>
                        </div>
                        <div className="mt-5 flex items-center justify-end gap-2">
                          <button type="button" onClick={cancelCover} className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Cancel</button>
                          <button type="button" onClick={saveCover} className="inline-flex cursor-pointer items-center rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60">Save Cover</button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>

                  </>
                )}
                {viewCover && coverUrl && (
                  <div
                    className="fixed inset-0 z-90 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setViewCover(false)}
                  >
                    <X size={24} className="absolute right-3 top-3 cursor-pointer text-2xl text-white" onClick={() => setViewCover(false)} />
                    <img
                      src={coverUrl}
                      alt="Cover"
                      className="max-h-full max-w-full rounded-xl object-contain"
                    />
                  </div>
                )}
                <div
                  className={`group h-36 relative rounded-3xl sm:h-44 ${
                    coverUrl
                      ? "bg-cover bg-center"
                      : "bg-linear-to-r from-slate-900 via-blue-950 to-slate-700"
                  }`}
                  style={
                    coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined
                  }
                >
                  {coverUrl ? (
                    <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                      <button type="button" onClick={() => setViewCover(true)} className={coverBtnClass}>
                        <Eye size={14} />
                        View Cover
                      </button>
                      <label className={coverBtnClass}>
                        <input
                          onChange={changeCoverPhoto}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                        />
                        <Camera size={14} />
                        Change Cover
                      </label>
                      <button type="button" onClick={removeCover} className={coverBtnClass}>
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className={`absolute right-3 top-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 ${coverBtnClass}`}>
                      <input
                        onChange={changeCoverPhoto}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                      />
                      <Camera size={14} />
                      Add Cover
                    </label>
                  )}
                </div>

                <div className="relative mx-2 -mt-16 rounded-3xl bg-white p-5 shadow-sm sm:mx-4 sm:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="group/avatar relative shrink-0">
                        {viewProfile && (
                          <div
                            className="fixed inset-0 z-90 flex items-center justify-center bg-black/80 p-4"
                            onClick={() => setViewProfile(false)}
                          >
                            <img
                              src={userDetails.photo}
                              alt={userDetails.name}
                              className="max-h-full max-w-full rounded-xl object-contain"
                            />
                            <X className="absolute right-3 top-3 cursor-pointer text-2xl text-white" onClick={() => setViewProfile(false)} size={24} />
                          </div>
                        )}
                        <button className="cursor-pointer rounded-full">
                          <img
                            src={userDetails.photo}
                            alt={userDetails.name}
                            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                          />
                          
                        </button>
                        <button type="button" onClick={() => setViewProfile(true)} className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#1877f2] opacity-0 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:bg-slate-50 group-hover/avatar:opacity-100 group-focus-within/avatar:opacity-100">
                          <Expand size={16} />
                        </button>
                        <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-0 shadow-sm transition duration-200 hover:bg-[#166fe5] group-hover/avatar:opacity-100 group-focus-within/avatar:opacity-100">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={changeProfilePhoto}
                            className="sr-only"
                          />
                          <Camera size={16} />
                        </label>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold capitalize text-gray-900">
                          {userDetails.name}
                        </h1>
                        <p className="text-sm text-gray-500">
                          {userDetails.username
                            ? `@${userDetails.username}`
                            : ""}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                          <Sparkles size={12} />
                          Route Posts member
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 lg:min-w-80">
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          Followers
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {userDetails.followersCount ??
                            userDetails.followers?.length ??
                            0}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          Following
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {userDetails.followingCount ??
                            userDetails.following?.length ??
                            0}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          Bookmarks
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {savedCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <h2 className="text-sm font-semibold text-gray-900">
                        About
                      </h2>
                      <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        {userDetails.email}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Sparkles size={16} className="text-gray-400" />
                        Active on Route Posts
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          My Posts
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {myPostsCount}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          Saved Posts
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {savedCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
                <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams({}, { replace: true });
                    }}
                    className={`inline-flex items-center cursor-pointer gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                      activeTab === "posts"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <FileText size={16} />
                    My Posts
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams({ tab: "saved" }, { replace: true });
                    }}
                    className={`inline-flex items-center cursor-pointer gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                      activeTab === "saved"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <Bookmark size={16} />
                    Saved
                  </button>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                  {activeTab === "saved" ? savedCount : myPostsCount}
                </span>
              </section>

              {visiblePosts.length > 0 ? (
                <div className="mt-3 space-y-4">
                  {visiblePosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onPostUpdated={async () => {
                        await Promise.all([loadSaved(), loadMyPosts()]);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                  {activeTab === "posts"
                    ? "You have not posted yet."
                    : "You have no saved posts."}
                </p>
              )}
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default Profile;
