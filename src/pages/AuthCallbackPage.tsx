import { useContext, useEffect } from "react"
import LoadingSpinner from "../components/LoadingSpinner"
import styles from "../styles/AuthCallbackPage.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, AuthContext } from "../Hooks/useAuth";

const AuthCallbackPage = () => {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthDetails } = useContext(AuthContext);

  useEffect(() => {
    const exchangeTokens = async () => {
      const authCode = searchParams.get("code");
      const state = searchParams.get("state");
      if (state != localStorage.getItem("state")) {
        console.log("CSRF attack attempt detected");
        return;
      }
      const res = await api.post("token", { authCode, clientId: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID }, { withCredentials: true, });
      setAuthDetails({ accessToken: res.data?.accessToken, userId: res.data?.userId })

      navigate('/');
    }

    exchangeTokens();

  }, [])

  return (
    <div className={styles.container}><LoadingSpinner isLoading={true} /></div>
  )
}

export default AuthCallbackPage
