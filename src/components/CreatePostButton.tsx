import { useNavigate } from "react-router-dom";
import styles from "../styles/CreatePostButton.module.css";
import { useMediaQuery } from "react-responsive";

type props = {};

export default function CreatePostButton({ }: props) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 765px)" });

  const onClick = () => navigate("/create");

  return (
    <button className={styles.btn_create} onClick={onClick}>
      <i className='fa-solid fa-plus'></i>
      {!isMobile && <span>Post</span>}
    </button>
  );
}
