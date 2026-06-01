import { useRef, useEffect, useContext } from "react";
import styles from "../styles/UserMenu.module.css";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DarkModeButton from "./DarkModeButton";
import { api, AuthContext } from "../Hooks/useAuth";

type props = {
  buttonRef: React.MutableRefObject<any>;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserMenu({
  buttonRef,
  isMenuOpen,
  setIsMenuOpen,
}: props) {
  const queryClient = useQueryClient();
  const modalRef = useRef<any>();
  const navigate = useNavigate();
  const { getAuthDetails, setAuthDetails } = useContext(AuthContext);

  const onLogout = async () => {
    try {
      const authDetails = await getAuthDetails();
      // Invalidate refresh token
      await api.post("sign_out", {},
        {
          withCredentials: true,
          headers:
            { Authorization: `Bearer ${authDetails?.accessToken}` },
        })
      setAuthDetails(null);
      navigate("/");
      queryClient.clear();
    } catch (error) {
      console.log(error)
    }
  };

  const viewProfile = () => {
    queryClient.removeQueries({ queryKey: ["posts"] });
    navigate("/profile");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      // Close modal if clicked outside both modal and button
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className={styles.modal} ref={modalRef} data-open={isMenuOpen}>
        <div className={styles.dark_mode}>
          <div>Theme </div>
          <DarkModeButton />
        </div>
        <div onClick={viewProfile}>View Profile</div>
        <div onClick={onLogout}>Logout</div>
      </div>
    </>
  );
}
