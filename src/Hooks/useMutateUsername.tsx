import { useMutation, useQueryClient } from "@tanstack/react-query";
import showError from "../util/showError";
import { protectedApi } from "./useAxiosInterceptor";
import { UserInfo } from "../components/UserDetails";

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
        },
        onError: (error) => {
            showError("Error updating username");
            console.log(error);
        },
    });

    return mutation;
};

export default useMutateUsername;
