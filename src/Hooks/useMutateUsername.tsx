import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import showError from "../util/showError";
import { protectedApi } from "./useAxiosInterceptor";
import { UserInfo } from "../components/UserDetails";
import { Page } from "../components/PostDashboard";

const useMutateUsername = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (username: string) => {
            const res = await protectedApi.put("/user/name", { username });
            return res.data;
        },
        onSuccess: async (newUserData: UserInfo) => {
            queryClient.setQueryData(['userDetails'], (oldUserData: UserInfo) => ({
                ...oldUserData,
                ["username"]: newUserData.username,
            }));
            queryClient.setQueriesData({ queryKey: ["posts"] }, (data: InfiniteData<Page, unknown> | undefined) => {
                if (!data) return;
                return {
                    ...data,
                    pages: data?.pages.map(page => ({
                        ...page,
                        posts: (page.posts ?? [])?.map(post => {
                            let newPost = {
                                ...post,
                                ["username"]: newUserData.username,
                            };
                            return post.authorId === newUserData.id ? newPost : post;
                        }),
                    })),
                };
            });
        },
        onError: (error) => {
            showError("Error updating username");
            console.log(error);
        },
    });

    return mutation;
};

export default useMutateUsername;
