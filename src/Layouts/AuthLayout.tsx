import { Outlet } from "react-router";
import AuthIntro from "../Components/AuthIntro/AuthIntro";

export default function AuthLayout() {
  return (
    <>
      <div
        className="min-h-screen bg-secondary px-4 py-8 sm:py-12 lg:flex lg:items-center"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
          <AuthIntro />
          <section className="order-1 w-full max-w-107.5 lg:order-2">
            <Outlet />
          </section>
        </div>
      </div>
    </>
  );
}
