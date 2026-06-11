import styles from "../styles/AuthError.module.css";

type props = {
  isShowError: boolean;
  authError: string;
};

export default function AuthError({ isShowError, authError }: props) {
  return (
    <div className={styles.error} data-shown={isShowError}>
      {authError}
    </div>
  );
}
