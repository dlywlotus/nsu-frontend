import styles from "../styles/PostLikes.module.css";
import { useNavigate } from "react-router-dom";
// import useMutatePostLikes from "../Hooks/useMutatePostLikes";
// import useMutateExpandedPostLikes from "../Hooks/useMutateExpandedPostLikes";
// import { useContext } from "react";
// import { AuthContext } from "../Hooks/useAuth";

type props = {
  postId: string;
  count: number;
  isLiked: boolean;
  isExpanded?: boolean;
};

export default function PostLikes({
  postId,
  count,
  isLiked,
  isExpanded,
}: props) {
  const navigate = useNavigate();
  // const { authDetails } = useContext(AuthContext);
  // //optimistically updates post likes for a specific post in the main page
  // const mutatePostLikes = useMutatePostLikes();
  // //optimistically updates post likes in expanded post page
  // const mutateExpandedPostLikes = useMutateExpandedPostLikes();

  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    // if (authDetails != null) {
    //   isExpanded
    //     ? mutateExpandedPostLikes.mutate({ postId, isLiked })
    //     : mutatePostLikes.mutate({ postId, isLiked });
    // } else {
    //   navigate("/auth");
    // }
  };

  return (
    <button className={styles.btn_like} onClick={onClick} data-liked={isLiked}>
      <i className='fa-solid fa-fire'></i>
      <span>{count}</span>
    </button>
  );
}
