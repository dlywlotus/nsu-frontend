import { useContext, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostFilterBar from "./PostFilterBar";
import PostList, { PostDetails } from "./PostList";
import LoadingSpinner from "./LoadingSpinner"
import axios from "axios";
import { api, AuthContext } from "../Hooks/useAuth";

export type filterOptions = {
  sortBy: "createdAt" | "likes";
  category: "EVENTS" | "STUDIES" | "HOUSING" | "OTHERS" | "ALL";
  searchKeyword: string;
};

export type Page = {
  curPage: number;
  pageCount: number;
  posts: PostDetails[];
}


type props = {
  selfPosted?: boolean;
};

export default function PostDashboard({ selfPosted = false }: props) {
  const { getAuthDetails } = useContext(AuthContext)
  const [filter, setFilter] = useState<filterOptions>({
    sortBy: "createdAt",
    category: "ALL",
    searchKeyword: "",
  });

  const fetchPosts = async ({ pageParam }: { pageParam: number }) => {

    try {
      const authDetails = await getAuthDetails();
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

      const config = authDetails?.accessToken
        ? {
          headers: {
            Authorization: `Bearer ${authDetails?.accessToken}`
          }
        }
        : {};

      const data = (await api.get(queryURI, config)).data;
      console.log(data)
      return data;
    } catch (error) {
      console.log(axios.isAxiosError(error) ? error.response?.data : error);
      throw error;
    }
  };

  const { data, isError, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", filter, selfPosted],
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
