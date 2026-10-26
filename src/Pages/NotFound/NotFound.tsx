import { ArrowLeft, Compass, House } from "lucide-react";
import { Link, useNavigate } from "react-router";
import logo from "../../assets/favicon.png";

export default function NotFound() {
  const navigate = useNavigate();

  return (

    <>
    <title>Page Not Found | Route Posts</title>
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-secondary px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#1877f2]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <section className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mb-6 flex items-center justify-center gap-3">
          <img
            src={logo}
            alt="Route Posts"
            className="h-10 w-10 rounded-xl object-cover"
          />
          <p className="text-xl font-extrabold text-slate-900">Route Posts</p>
        </div>

        <div className="relative mx-auto mb-4 w-fit">
          <h1 className="bg-linear-to-r from-[#1877f2] to-primary bg-clip-text text-8xl font-black leading-none text-transparent sm:text-9xl">
            404
          </h1>
          <span className="absolute -right-3 -top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2] shadow-sm">
            <Compass size={20} />
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900">
          Page not found
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          The page you are looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <Link
            to="/feed"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5]"
          >
            <House size={16} />
            Back to feed
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
