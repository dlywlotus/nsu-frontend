import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserInfo } from "../components/UserDetails";
import { Page } from "../components/PostDashboard";
import showError from "../util/showError";
import { api, AuthContext } from "./useAuth";
import { useContext } from "react";

const useMutateProfileIcon = () => {
    const queryClient = useQueryClient();
    const { getAuthDetails } = useContext(AuthContext)

    const mutateProfilePic = async (imageBlob: Blob) => {
        const authDetails = await getAuthDetails();
        const imageFile = new File([imageBlob], "fileToUpload.jpeg", {
            type: imageBlob.type,
            lastModified: new Date().getTime()
        });
        const formData = new FormData();
        formData.append('file', imageFile);
        const res = await api.put("user/profile-icon",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${authDetails?.accessToken}`
                }
            });
        return res.data
    };

    const mutation = useMutation({
        mutationFn: mutateProfilePic,
        onSuccess: async (newUserData: UserInfo) => {
            queryClient.setQueryData(['userDetails'], (oldUserData: UserInfo) => ({
                ...oldUserData,
                ["profileIconImageKey"]: newUserData.profileIconImageKey
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
                                    ["profileIconImageKey"]: newUserData.profileIconImageKey,
                                }
                                : post;
                        }),
                    })),
                };
            });
        },
        onError: (err) => {
            showError("Error uploading profile icon");
            console.log(err);
        },
    });

    return mutation;
}

export default useMutateProfileIcon