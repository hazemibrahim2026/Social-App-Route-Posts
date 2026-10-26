import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { AxiosResponse } from "axios";
import defaultProfile from "../../assets/imgi_2_default-profile.png";

interface LikeUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
}

// Response shape isn't documented, so accept an array directly or under any key
function extractUsers(res: AxiosResponse): LikeUser[] {
  const body = res.data?.data ?? res.data;
  const list: unknown[] = Array.isArray(body)
    ? body
    : ((Object.values(body ?? {}).find(Array.isArray) as unknown[]) ?? []);
  return list
    .map((item) => {
      const entry = item as Record<string, unknown>;
      return (entry?.user ?? entry) as LikeUser;
    })
    .filter((u) => u && typeof u === "object" && u._id);
}

export default function LikesModal({
  title,
  fetchLikes,
  onClose,
}: {
  title: string;
  fetchLikes: () => Promise<AxiosResponse>;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<LikeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLikes()
      .then((res) => {
        if (!cancelled) setUsers(extractUsers(res));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-90 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto">
          {loading && <p className="text-sm text-slate-500">Loading...</p>}
          {error && (
            <p className="text-sm text-red-500">Failed to load reactions.</p>
          )}
          {!loading && !error && users.length === 0 && (
            <p className="text-sm text-slate-500">No reactions yet.</p>
          )}
          {users.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <img
                src={user.photo || defaultProfile}
                alt={user.name}
                className="size-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  @{user.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
