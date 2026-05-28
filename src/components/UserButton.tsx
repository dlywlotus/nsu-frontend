import styles from "../styles/UserButton.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import UserMenu from "./UserMenu";
import { AuthContext } from "../Hooks/useAuth";


type props = {};

export default function UserButton({ }: props) {
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const buttonRef = useRef<any>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToAuth = () => {
    navigate("/auth");
  };

  return (
    <>
      {authDetails ? (
        <>
          <button
            className={styles.btn_icon}
            onMouseDown={openMenu}
            ref={buttonRef}
          >
            <i className='fa-solid fa-user'></i>
          </button>
          <UserMenu
            buttonRef={buttonRef}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </>
      ) : (
        <button className={styles.btn_icon} onClick={goToAuth} ref={buttonRef}>
          <i className='fa-solid fa-right-to-bracket'></i>
        </button>
      )}
    </>
  );
}
