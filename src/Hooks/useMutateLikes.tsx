import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { protectedApi } from "./useAxiosInterceptor";
import { PostDetails } from "../components/PostList";
import { Page } from "../components/PostDashboard";

type MutationProps = {
    postId: string;
    isLiked: boolean;
}

const useMutateLikes = () => {
    const queryClient = useQueryClient()

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
        if (isLiked) {
            await protectedApi.delete(`like/${postId}`);
        } else {
            await protectedApi.post(`like/${postId}`);
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