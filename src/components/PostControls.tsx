import styles from "../styles/PostControls.module.css";
import { useQueryClient } from "@tanstack/react-query";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { api, AuthContext } from "../Hooks/useAuth";
import { useContext } from "react";

type props = {
  postId: string;
};

export default function PostControls({ postId }: props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getAuthDetails } = useContext(AuthContext);

  const deletePost = async (postId: string) => {
    try {
      const authDetails = await getAuthDetails();
      await api.delete(`/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${authDetails?.accessToken}`
          }
        });
      queryClient.refetchQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully", {
        autoClose: 5000,
        theme: "colored",
        style: {
          backgroundColor: "var(--clr-success)",
        },
      });
    } catch (error) {
      console.log(axios.isAxiosError(error) ? error?.response?.data : error);
    }
  };

  const editPost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/edit/${postId}`);
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    confirmAlert({
      title: "Delete post",
      message: "Are you sure you want to continue?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deletePost(postId),
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  return (
    <div className={styles.post_controls}>
      <button onClick={onDelete}>
        <i className='fa-solid fa-trash'></i>
      </button>
      <button onClick={editPost}>
        <i className='fa-solid fa-pen'></i>
      </button>
    </div>
  );
}
