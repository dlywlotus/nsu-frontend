import { useNavigate } from "react-router-dom";
import styles from "../styles/CreatePostButton.module.css";
import { useMediaQuery } from "react-responsive";
import { useContext } from "react";
import { AuthContext } from "../Hooks/useAuth";

type props = {};

export default function CreatePostButton({ }: props) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 765px)" });
  const { authDetails } = useContext(AuthContext);

  const onClick = () => navigate(authDetails ? "/create" : "/auth");

  return (
    <button className={styles.btn_create} onClick={onClick}>
      <i className='fa-solid fa-plus'></i>
      {!isMobile && <span>Post</span>}
    </button>
  );
}
