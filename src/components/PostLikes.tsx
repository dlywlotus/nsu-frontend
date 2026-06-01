import { useContext } from "react";
import styles from "../styles/PostLikes.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Hooks/useAuth";
import useMutateLikes from "../Hooks/useMutateLikes";


type props = {
  postId: string;
  count: number;
  isLiked: boolean;
};

export default function PostLikes({
  postId,
  count,
  isLiked,
}: props) {
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const mutateLikes = useMutateLikes();

  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!authDetails) {
      navigate("/auth");
    }

    mutateLikes.mutate({ postId, isLiked })
  };

  return (
    <button className={styles.btn_like} onClick={onClick} data-liked={isLiked}>
      <i className='fa-solid fa-fire'></i>
      <span>{count}</span>
    </button>
  );
}
