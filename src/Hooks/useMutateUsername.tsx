// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import getSession from "../util/getSession";
// import { useUser } from "./useAuth";
// import mutateUserDetails from "../util/mutateUserDetails";
// import showError from "../util/showError";

// const useMutateUsername = () => {
//   const queryClient = useQueryClient();
//   const { userId } = useUser();

//   const mutation = useMutation({
//     mutationFn: async (username: string) => {
//       const { token } = await getSession();

//       await axios.put(
//         `${import.meta.env.VITE_SERVER_API_URL}/auth_req/edit_user/${userId}`,
//         {
//           username,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//     },
//     onMutate: async (username: string) => {
//       const undoFn = mutateUserDetails(
//         username,
//         "Username",
//         queryClient,
//         userId
//       );
//       return undoFn;
//     },
//     onError: (err, _, undoFn) => {
//       undoFn && undoFn();
//       showError("Error updating username");
//       console.log(err);
//     },
//   });

//   return mutation;
// };

// export default useMutateUsername;
