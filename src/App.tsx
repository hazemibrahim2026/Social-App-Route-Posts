import { createHashRouter, Navigate, RouterProvider } from "react-router";
import UpdatePassword from "./Pages/UpdatePassword/UpdatePassword";
import PostDetails from "./Pages/PostDetails/PostDetails";
import AuthProtectedRoute from "./Components/ProtectedRoutes/AuthProtectedRoute";
import { Toaster } from "react-hot-toast";
import AuthLayout from "./Layouts/AuthLayout";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import MainLayout from "./Layouts/MainLayout";
import Newsfeed from "./Pages/Newsfeed/Newsfeed";
import Profile from "./Pages/Profile/Profile";
import UserProfile from "./Pages/UserProfile/UserProfile";
import Notifications from "./Pages/Notifications/Notifications";
import NotFound from "./Pages/NotFound/NotFound";
import AppProtectedRoute from "./Components/ProtectedRoutes/AppProtectedRoute";

export default function App() {
  const routes = createHashRouter([
    {
      path: "/auth",
      element: (
        <AuthProtectedRoute>
          <AuthLayout />
        </AuthProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="login" /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
      ],
    },
    {
      path: "/",
      element: (
        <AppProtectedRoute>
          <MainLayout />
        </AppProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="feed" /> },
        { path: "feed", element: <Newsfeed /> },
        { path: "profile", element: <Profile /> },
        { path: "profile/:id", element: <UserProfile /> },
        { path: "notifications", element: <Notifications /> },
        { path: "postDetails/:id", element: <PostDetails /> },
        { path: "update-password", element: <UpdatePassword /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ], { basename: import.meta.env.BASE_URL });
  return (
    <>
      <Toaster />
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}
