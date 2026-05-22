import { QueryClient } from "@tanstack/react-query";
import { page } from "../components/PostList";
import { fetchedUser } from "../components/UserDetails";

type data = {
  pages: page[];
};

const mutateUserDetails = (
  newValue: string,
  field: "Username" | "ProfilePic",
  queryClient: QueryClient,
  userId: string | null
) => {
  const previousPosts = queryClient.getQueryData(["posts"]);
  const previousUser = queryClient.getQueryData(["userDetails"]);

  //optimistically update posts
  queryClient.setQueryData(["posts"], (data: data) => {
    return {
      ...data,
      pages: data.pages.map(page => ({
        ...page,
        posts: (page.posts ?? []).map(post => {
          let newPost = {
            ...post,
            [field]: newValue,
          };
          return post.AuthorID === userId ? newPost : post;
        }),
      })),
    };
  });

  //optimistically update profile
  queryClient.setQueryData(["userDetails"], (data: fetchedUser) => ({
    ...data,
    [field]: newValue,
  }));

  return () => {
    queryClient.setQueryData(["posts"], previousPosts);
    queryClient.setQueryData(["userDetails"], previousUser);
  };
};

export default mutateUserDetails;
