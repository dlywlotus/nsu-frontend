import styles from "../styles/AuthError.module.css";

type props = {
  isShowError: boolean;
};

export default function AuthError({ isShowError }: props) {
  return (
    <div className={styles.error} data-shown={isShowError}>
      Invalid email or password!
    </div>
  );
}
