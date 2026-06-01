import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { PostDetails } from "../components/PostList";
import { Page } from "../components/PostDashboard";
import { api, AuthContext } from "./useAuth";
import { useContext } from "react";

type MutationProps = {
    postId: string;
    isLiked: boolean;
}

const useMutateLikes = () => {
    const queryClient = useQueryClient()
    const { getAuthDetails } = useContext(AuthContext)

    const getUpdatedPost = (data: PostDetails, isLiked: boolean) => {
        if (!data) {
            return data;
        }

        return {
            ...data,
            likeCount: isLiked
                ? data.likeCount - 1
                : data.likeCount + 1,
            userLiked: !data.userLiked,
        }
    }

    const mutationFunction = async ({ postId, isLiked }: MutationProps) => {
        const authDetails = await getAuthDetails();

        if (isLiked) {
            await api.delete(`like/${postId}`, { headers: { Authorization: `Bearer ${authDetails?.accessToken}` } });
        } else {
            await api.post(`like/${postId}`, {}, { headers: { Authorization: `Bearer ${authDetails?.accessToken}` } });
        }
    }

    const mutation = useMutation({
        mutationFn: mutationFunction,
        onMutate: ({ postId, isLiked }) => {
            const previousExpandedPostData = queryClient.getQueryData(["post", postId])
            const previousPostListData = queryClient.getQueriesData({ queryKey: ["posts"] })

            queryClient.setQueryData(["post", postId], (data: PostDetails) => { return getUpdatedPost(data, isLiked) });
            queryClient.setQueriesData({ queryKey: ["posts"] }, (data: InfiniteData<Page, unknown> | undefined) => {
                if (!data) {
                    return data;
                }

                return {
                    ...data,
                    pages: data?.pages.map(page => ({
                        ...page,
                        posts: page.posts.map(post => {
                            return post.id === postId ? getUpdatedPost(post, isLiked) : post;
                        }),
                    })),
                };
            });
            return { previousExpandedPostData, previousPostListData }
        },
        onError: (error, { postId }, context) => {
            console.log(error);
            queryClient.setQueryData(["post", postId], () => context?.previousExpandedPostData)
            if (context?.previousPostListData) {
                context.previousPostListData.forEach(([queryKey, oldData]) => {
                    queryClient.setQueryData(queryKey, oldData);
                });
            }
        }
    })

    return mutation;
}

export default useMutateLikes