import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./main.css";
import PostExpandViewPage from "./pages/ExpandedPostPage";
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
import AxiosInterceptorProvider from "./Hooks/useAxiosInterceptor";

const queryClient = new QueryClient();

const ThemeProvider = () => {
  useTheme(); //dark / light mode
  return (
    <SkeletonTheme
      baseColor='var(--clr-body)'
      highlightColor='var(--clr-highlight)'
      duration={1}
    >
      <Outlet />
      <ToastContainer />
    </SkeletonTheme>
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
    element: <ThemeProvider />,
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
            element: <PostExpandViewPage />,
          },
          {
            path: "edit/:postId",
            element: <PostExpandViewPage isEditing={true} />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AxiosInterceptorProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AxiosInterceptorProvider>
    </AuthProvider>
  </StrictMode>
);