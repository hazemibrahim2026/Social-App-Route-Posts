import { Search, UserPlus, Users } from "lucide-react";
import type { SuggestionI } from "../../Types/suggestion.types";
import { useEffect, useState } from "react";
import { getFollowSuggestions } from "../../Services/feed.services";
import axios from "axios";
import { followUser } from "../../Services/feed.services";
// const friends = [
//   { id: 1, name: "Ahmed Abd Al-Rahman", username: "ahmedmutti", followers: 321 },
//   { id: 2, name: "Alaa Ashraf", username: "alaaashraf", followers: 258 },
//   { id: 3, name: "MrMo", username: "mrmo", followers: 198 },
//   { id: 4, name: "menna", username: "gbngssssb", followers: 160 },
//   { id: 5, name: "abdalla diaa", username: "abdalla_diaa", followers: 152 },
// ];

export default function SuggestedFriends() {
  const [suggestions, setSuggestions] = useState<SuggestionI[]>([]);
  const [follow, setfollow] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const DISPLAY_LIMIT = 10;
  const FETCH_LIMIT = 50;
  const filteredUsers = suggestions
    .filter((suggestion) =>
      `${suggestion.name} ${suggestion.username}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    )
    .slice(0, DISPLAY_LIMIT);

  async function getSuggestions() {
    try {
      const response = await getFollowSuggestions(FETCH_LIMIT);
      console.log("Suggestions:", response);
      const data = response?.data;
      const list = Array.isArray(data) ? data : data?.suggestions;
      setSuggestions(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(
        "Error fetching suggestions:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error,
      );
    }
  }

  async function followThisUser(userId: string) {
    console.log("followThisUser clicked:", userId);
    setfollow(userId);
    try {
      const response = await followUser(userId);
      console.log("Follow response:", response.data);
      await getSuggestions();
    } catch (error) {
      console.error(
        "Error following user:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error,
      );
    } finally {
      setfollow(null);
    }
  }

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <>
      <aside
        className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-20 xl:self-start"
        
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-main">
            <Users size={18} className="text-[#1877f2]" />
            Suggested Friends
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
              {filteredUsers.length}
            </span>
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls="suggested-friends-list"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              className="cursor-pointer text-sm font-semibold text-[#1877f2] hover:underline xl:hidden"
            >
              {isExpanded ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div
          id="suggested-friends-list"
          className={`${isExpanded ? "block" : "hidden"} mt-4 xl:block`}
        >
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="search"
              aria-label="Search friends"
              placeholder="Search friends..."
              className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ul className="space-y-3">
            {filteredUsers.map((suggestion) => (
              <li
                key={suggestion._id}
                className="space-y-3 rounded-2xl border border-gray-200 p-3"
              >
                <div className="flex min-w-0 w-full items-center justify-between gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-slate-50">
                  <img
                    src={suggestion.photo}
                    alt={suggestion.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 grow">
                    <p className="truncate text-sm font-bold text-slate-900 hover:underline">
                      {suggestion.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      @{suggestion.username}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => followThisUser(suggestion._id)}
                    disabled={follow === suggestion._id}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#e7f3ff] px-3 py-1.5 text-xs font-bold text-[#1877f2] transition hover:bg-[#d8ebff] disabled:opacity-60"
                  >
                    <UserPlus size={13} />
                    Follow
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {suggestion.followersCount} followers
                  </span>
                  <span className="rounded-full bg-[#edf4ff] px-2 py-0.5 text-xs text-[#1877f2]">
                    {suggestion.mutualFollowersCount} mutual
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-3 w-full cursor-pointer rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-main transition hover:bg-gray-200"
          >
            View more
          </button>
        </div>
      </aside>
    </>
  );
}
