import styles from "../styles/AuthModal.module.css";
import AuthHeader from "./AuthHeader";

export default function AuthModal() {
  const navToGoogleLoginPage = () => {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    const state = crypto.randomUUID();
    localStorage.setItem("state", state);

    url.search = new URLSearchParams({
      response_type: "code",
      scope: "openid profile email",
      client_id: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID,
      nonce: crypto.randomUUID(),
      redirect_uri: `${import.meta.env.VITE_CLIENT_SERVER_URL}/auth-callback`,
      state: state
    }).toString();

    window.location.href = url.toString();
  }


  return (
    <div className={styles.container} >
      <AuthHeader />
      <button className={styles.btn_authenticate} onClick={navToGoogleLoginPage}>Continue with Google</button>
    </div>
  );
}

