import { useContext, useEffect, useState } from "react";
import { getNotifications } from "../../Services/notifications.services";
import type { NotificationsI } from "../../Types/notifications.types";
import { MessageCircle, Heart, UserPlus, Check } from "lucide-react";
import moment from "moment";
import type { UserContextType } from "../../Components/Context/UserContext";
import { UserContext } from "../../Components/Context/UserContext";
import { useNavigate } from "react-router";

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationsI[]>([]);
  const { userDetails } = useContext(UserContext) as UserContextType;
  const navigate = useNavigate();
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead,
  );

  function getProfile(userId: string) {
    navigate(userId === userDetails?._id ? "/profile" : `/profile/${userId}`);
  }

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data } = await getNotifications();
        console.log(data.data.notifications);
        setNotifications(data.data.notifications);
      } catch (error) {
        console.error(error);
      }
    }

    void fetchNotifications();
  }, []);

  return (
    <>
    <title>Notifications | Route Posts</title>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Realtime updates for likes, comments, shares, and follows.
                  </p>
                </div>
                <button
                  disabled={!hasUnreadNotifications}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Mark all as read
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button className="rounded-full cursor-pointer px-4 py-1.5 text-sm font-bold transition bg-[#1877f2] text-white">
                  All
                </button>
                <button className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition bg-slate-100 text-slate-700 hover:bg-slate-200">
                  Unread
                </button>
              </div>
            </div>
            <div className="space-y-2 p-3 sm:p-4">
              {notifications.map((notification) => (
                <div key={notification._id}>
                  <article className="group relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 border-slate-200 bg-white hover:bg-slate-50">
                    <div className="relative shrink-0">
                      <button className="block cursor-pointer">
                        <img
                          src={notification.actor.photo}
                          alt={notification.actor.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      </button>
                      <span
                        className={`absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white ${notification.type === "comment_post" ? "text-[#1877f2]" : notification.type === "like_post" ? "text-rose-500" : notification.type === "follow_user" ? "text-violet-600" : ""}`}
                      >
                        {notification.type === "comment_post" ? (
                          <MessageCircle size={15} />
                        ) : notification.type === "like_post" ? (
                          <Heart size={15} />
                        ) : notification.type === "follow_user" ? (
                          <UserPlus size={15} />
                        ) : null}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
                        <p className="text-sm leading-6 text-slate-800">
                          <button
                            type="button"
                            onClick={() => getProfile(notification.actor._id)}
                            className="text-sm leading-6 text-slate-800 cursor-pointer hover:underline hover:text-[#1877f2] font-extrabold"
                          >
                            {notification.actor.name}
                          </button>
                          {notification.type === "comment_post" ? " commented on your post" : ""}
                          {notification.type === "like_post" ? " liked your post" : ""}
                          {notification.type === "follow_user" ? " followed you" : ""}
                        </p>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-xs font-semibold text-slate-500">{moment(notification.createdAt).fromNow()}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${notification.isRead ? "text-emerald-600" : "text-slate-500"}`}>
                          {notification.isRead && <Check size={13} />}
                          {notification.isRead ? " Read" : "Unread"}
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
