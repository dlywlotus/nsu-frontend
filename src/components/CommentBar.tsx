import { useMutation } from "@tanstack/react-query";
import styles from "../styles/CommentBar.module.css";
import { useContext, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import showError from "../util/showError";
import { api, AuthContext } from "../Hooks/useAuth";
import { CommentDetails } from "./CommentSection";
import { PostDetails } from "./PostList";
import axios from "axios";

type props = {
  postId: string;
  parentCommentId: number | null;
};

type MutationProps = {
  input: string
  postId: string;
  parentCommentId: number | null;
}


export default function CommentBar({ postId, parentCommentId }: props) {
  const [input, setInput] = useState("");
  const { authDetails, getAuthDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ input, postId, parentCommentId }: MutationProps): Promise<CommentDetails> => {
      const authDetails = await getAuthDetails();
      const res = await api.post("/comment",
        {
          body: input,
          postId,
          parentCommentId
        },
        {
          headers: {
            Authorization: `Bearer ${authDetails?.accessToken}`
          }
        }
      );
      return res.data;
    },
    onSuccess: (newComment) => {
      //insert new parent/child comment into comments array
      queryClient.setQueryData(["post", postId, "comments"], (comments: CommentDetails[]) => {
        return parentCommentId
          ? comments.map(c => c.id === parentCommentId
            ? { ...c, nestedComments: [newComment, ...(c.nestedComments ?? [])] }
            : c
          )
          : [newComment, ...comments]
      }

      );

      queryClient.setQueryData(["post", postId], (post: PostDetails): PostDetails => ({
        ...post, commentCount: post.commentCount + 1
      }))

    },
    onError: (error) => {
      console.log(axios.isAxiosError(error) ? error?.response?.data : error)
      if (axios.isAxiosError(error) && error.status == 429) {
        showError("Too many requests! Try again later.")
      } else {
        showError("Error creating comment");
      }
    },
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!authDetails) {
      return navigate("/login");
    }
    if (input === "") return;
    mutation.mutate({ input, postId, parentCommentId });
    setInput("");
  };

  return (
    <form className={styles.comment_bar} onSubmit={onSubmit}>
      <TextareaAutosize
        className={styles.comment_input}
        minRows={1}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={parentCommentId ? "Reply" : "Add a comment"}
      />
      <button className={styles.btn_send}>
        <i className='fa-solid fa-paper-plane'></i>
      </button>
      {mutation.isPending && <LoadingSpinner isLoading={mutation.isPending} />}
    </form>
  );
}
