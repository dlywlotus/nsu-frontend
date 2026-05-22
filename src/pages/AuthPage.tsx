import AuthModal from "../components/AuthModal";
import styles from "../styles/AuthPage.module.css";

export default function AuthPage() {
  return (
    <div className={styles.backdrop}>
      <AuthModal />
    </div>
  );
}
