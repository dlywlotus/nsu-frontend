import styles from "../styles/AuthHeader.module.css";

type props = {};

export default function AuthHeader({}: props) {
  return (
    <>
      <div className={styles.secondary_header}>Welcome to</div>
      <div className={styles.primary_header}>
        N<span>SU</span> Forums
      </div>
    </>
  );
}
