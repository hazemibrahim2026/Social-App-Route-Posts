import { Bookmark, Globe, Newspaper, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const links = [
  { id: "feed", label: "Feed", icon: Newspaper, navigate: "/feed" },
  { id: "posts", label: "My Posts", icon: Sparkles, navigate: "/feed?filter=posts" },
  { id: "community", label: "Community", icon: Globe, navigate: "/feed?view=community" },
  { id: "saved", label: "Saved", icon: Bookmark, navigate: "/profile?tab=saved" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeLink =
    location.pathname === "/profile" && location.search === "?tab=saved"
      ? "saved"
      : location.pathname === "/feed" && searchParams.get("filter") === "posts"
        ? "posts"
        : location.pathname === "/feed" && searchParams.get("view") === "community"
          ? "community"
          : "feed";

  return (
    <aside className="bg-white rounded-2xl p-3 shadow-sm h-fit">
      <ul className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.id === activeLink;

          return (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => navigate(link.navigate)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 cursor-pointer text-left text-sm font-bold transition ${
                  isActive
                    ? "bg-[#e7f3ff] text-[#1877f2]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
