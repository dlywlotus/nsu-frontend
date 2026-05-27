import { useContext, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostFilterBar from "./PostFilterBar";
import PostList, { Post } from "./PostList";
import LoadingSpinner from "./LoadingSpinner"
import { protectedApi } from "../Hooks/useAxiosInterceptor";
import axios from "axios";
import { AuthContext } from "../Hooks/useAuth";

export type filterOptions = {
  sortBy: "createdAt" | "likes";
  category: "EVENTS" | "STUDIES" | "HOUSING" | "OTHERS" | "ALL";
  searchKeyword: string;
};

export type Page = {
  curPage: number;
  pageCount: number;
  posts: Post[];
}


type props = {
  selfPosted?: boolean;
};

export default function PostDashboard({ selfPosted = false }: props) {
  const { authDetails } = useContext(AuthContext)
  const [filter, setFilter] = useState<filterOptions>({
    sortBy: "createdAt",
    category: "ALL",
    searchKeyword: "",
  });

  const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
    try {
      let queryURI = `/posts?page=${pageParam}&size=${10}&sort=${filter.sortBy},desc`

      if (filter.searchKeyword !== "") {
        queryURI += `&searchInput=${filter.searchKeyword}`
      }

      if (filter.category !== "ALL") {
        queryURI += `&category=${filter.category}`
      }

      if (selfPosted && authDetails?.userId !== null) {
        queryURI += `&authorId=${authDetails?.userId}`
      }

      console.log(`Post fetching query: ${queryURI}`)
      const data = (await protectedApi.get(queryURI)).data;
      console.log(data)
      return data;
    } catch (error) {
      console.log(axios.isAxiosError(error) ? error.response?.data : error);
      throw new Error("Failed to fetch posts")
    }
  };

  const { data, isError, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", filter, selfPosted, authDetails?.userId],
      queryFn: fetchPosts,
      initialPageParam: 0,
      getNextPageParam: (lastPage: Page) => {
        // page number is 0 indexed
        return lastPage.curPage >= lastPage.pageCount - 1
          ? null
          : lastPage.curPage + 1
      },
      retry: 3,
      retryDelay: 1000
    });

  return (
    <>
      <PostFilterBar filter={filter} setFilter={setFilter} />
      {isError && <div>Error loading posts 😢</div>}
      {isFetching && <LoadingSpinner isLoading={isFetching} />}
      {data && (
        <PostList
          pagesOfPosts={data.pages}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          selfPosted={selfPosted}
        />
      )}
    </>
  );
}
