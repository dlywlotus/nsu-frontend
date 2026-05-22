import styles from "../styles/AuthCallToAction.module.css";

type props = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  reset: any;
};

export default function AuthCallToAction({
  isLogin,
  setIsLogin,
  reset,
}: props) {
  const onClick = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const message = isLogin
    ? "Don't have an account ? "
    : "Already have an account ? ";

  return (
    <div className={styles.small_text}>
      {message}
      <span className={styles.link} onClick={onClick}>
        {isLogin ? "Sign up" : "Login"}
      </span>
    </div>
  );
}
