import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import showError from "../util/showError";
import { UserInfo } from "../components/UserDetails";
import { Page } from "../components/PostDashboard";
import { useContext } from "react";
import { api, AuthContext } from "./useAuth";
import showSuccess from "../util/showSuccess";

const useMutateUsername = () => {
    const queryClient = useQueryClient();
    const { getAuthDetails } = useContext(AuthContext)

    const mutation = useMutation({
        mutationFn: async (username: string) => {
            const authDetails = await getAuthDetails();
            const res = await api.put("/user/name",
                { username },
                {
                    headers: {
                        Authorization: `Bearer ${authDetails?.accessToken}`
                    }
                });
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
                            return post.authorId === newUserData.id
                                ? {
                                    ...post,
                                    ["username"]: newUserData.username,
                                }
                                : post;

                        }),
                    })),
                };
            });
            showSuccess("Successfully changed username")
        },
        onError: (error) => {
            showError("Error updating username");
            console.log(error);
        },
    });

    return mutation;
};

export default useMutateUsername;
