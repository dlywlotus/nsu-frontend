import styles from "../styles/MainHeader.module.css";
import CreatePostButton from "./CreatePostButton";
import Logo from "./Logo";
import UserButton from "./UserButton";

type props = {};

export default function MainHeader({ }: props) {
  return (
    <div className={styles.container}>
      <Logo />
      <div className={styles.nav_btns}>
        <CreatePostButton />
        <UserButton />
      </div>
    </div>
  );
}
