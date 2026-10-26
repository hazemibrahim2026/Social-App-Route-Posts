import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";
import Sidebar from "../../Components/Sidebar/Sidebar";
import PostCard from "../../Components/PostCard/PostCard";
import PostSkeleton from "../../Components/PostCard/PostSkeleton";
import {
  getUserFeed,  
} from "../../Services/feed.services";
import { getUserPosts } from "../../Services/profile.services";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import type { PostCardI } from "../../Types/postCard.types";
import { useSearchParams } from "react-router";
import { UserContext } from "../../Components/Context/UserContext";

import CreatePost from "../../Components/PostCard/CreatePost";

export default function Newsfeed() {
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const userDetails = useContext(UserContext)?.userDetails;
  const userId = userDetails?.id;
  const showingMyPosts = searchParams.get("filter") === "posts";

  const getAllPosts = useCallback(async () => {
    try {
      if (showingMyPosts) {
        if (!userId) {
          setPosts([]);
          return;
        }

        const { data } = await getUserPosts(userId);
        const userPosts =
          data?.data?.posts ?? data?.posts ?? data?.data ?? [];
        setPosts(Array.isArray(userPosts) ? userPosts : []);
      } else {
        const data = await getUserFeed();
        setPosts(data.data?.data?.posts ?? data.data?.posts ?? []);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching posts:",
          error.response?.data || error.message,
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [showingMyPosts, userId]);
  
  useEffect(() => {
    void getAllPosts();
  }, [getAllPosts]);

  return (
    <>
    <title>Home Feed | Route Posts</title>
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="grid items-start gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <div className="order-1">
            <Sidebar />
          </div>
          <div className="order-2 xl:order-3">
            <SuggestedFriends />
          </div>
          <div className="order-3 space-y-4 xl:order-2">
            {isLoading && <PostSkeleton />}
            <CreatePost getAllPosts={getAllPosts} />
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={getAllPosts}
              />
            ))}
            {!isLoading && posts.length === 0 && (
              <p className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-sm">
                {showingMyPosts
                  ? "You have not posted yet."
                  : "No posts to show."}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
