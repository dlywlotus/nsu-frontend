// import { useUser } from "./useAuth";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { page } from "../components/PostList";

// type data = {
//   pages: page[];
// };

// type mutationProps = {
//   postId: number;
//   isLiked: boolean;
// };

// const useMutatePostLikes = () => {
//   const { userId } = useUser();
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: async ({ postId, isLiked }: mutationProps) => {
//       if (isLiked) {
//         await axios.delete(`${import.meta.env.VITE_SERVER_API_URL}/likes`, {
//           data: { userId, postId },
//         });
//       } else {
//         await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/likes`, {
//           userId,
//           postId,
//         });
//       }
//     },
//     onMutate: async ({ postId, isLiked }: mutationProps) => {
//       const previousData = queryClient.getQueryData(["posts"]);

//       //Copy over every post in every page except the post being liked
//       queryClient.setQueryData(["posts"], (data: data) => {
//         return {
//           ...data,
//           pages: data.pages.map(page => ({
//             ...page,
//             posts: page.posts.map(post => {
//               let newPost = {
//                 ...post,
//                 LikeCount: isLiked ? post.LikeCount - 1 : post.LikeCount + 1,
//                 UserLiked: !post.UserLiked,
//               };
//               return post.ID === postId ? newPost : post;
//             }),
//           })),
//         };
//       });
//       return { previousData };
//     },
//     onError: (err, _, context) => {
//       queryClient.setQueryData(["posts"], context?.previousData);
//       console.log(err);
//     },
//   });

//   return mutation;
// };

// export default useMutatePostLikes;
