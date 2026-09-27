import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./main.css";
import NotFoundPage from "./pages/NotFoundPage";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import useTheme from "./Hooks/useTheme";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";
import Home from "./pages/Home";
import MainHeader from "./components/MainHeader";
import { AuthProvider } from "./Hooks/useAuth";
import ExpandedPostPage from "./pages/ExpandedPostPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

const queryClient = new QueryClient();

const ThemeAndAuthProvider = () => {
  useTheme(); //dark / light mode
  return (
    <AuthProvider>
      <SkeletonTheme
        baseColor='var(--clr-body)'
        highlightColor='var(--clr-highlight)'
        duration={1}
      >
        <Outlet />
        <ToastContainer />
      </SkeletonTheme>
    </AuthProvider>
  );
};

const Layout = () => {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ThemeAndAuthProvider />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          { path: "create", element: <CreatePostPage /> },
          {
            path: "post/:postId",
            element: <ExpandedPostPage />,
          },
          {
            path: "edit/:postId",
            element: <ExpandedPostPage isEditing={true} />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "/login",
        element: <AuthPage />,
      },
      {
        path: "/auth-callback",
        element: <AuthCallbackPage />
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);