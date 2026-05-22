import styles from "../styles/AuthModal.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCallToAction from "./AuthCallToAction";
import AuthHeader from "./AuthHeader";
import AuthError from "./AuthError";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { AuthContext } from "../Hooks/useAuth";

// Infer form schema type
type FormData = {
  username: string;
  email: string;
  password: string;
};


export default function AuthModal() {
  const navigate = useNavigate();
  const { setAuthDetails } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isShowError, setIsShowError] = useState(false);

  const formSchema = z.object({
    username: isLogin
      ? z.string().optional()
      : z
        .string()
        .min(3, "Min length: 3 characters")
        .max(15, "Max length: 15 characters"),
    password: z
      .string()
      .min(6, "Min length: 6 characters")
      .max(30, "Max length: 30 characters"),
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const flashErrorMessage = () => {
    setIsShowError(true);
    setTimeout(() => setIsShowError(false), 2000);
  };


  const onLogin = async (formData: FormData) => {
    await signIn(formData);
    navigate("/");
  };

  const onSignUp = async (formData: FormData) => {
    await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/sign_up`, {
      "username": formData.username,
      "password": formData.password
    });
    await signIn(formData);
    navigate("/");
  };

  const signIn = async (formData: FormData) => {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_API_URL}/sign_in`,
      {
        "username": formData.username,
        "password": formData.password
      },
      { withCredentials: true }
    );
    setAuthDetails(res.data);
  };

  const onSubmit = async (formData: FormData) => {
    try {
      isLogin ? await onLogin(formData) : await onSignUp(formData);
      navigate("/");
    } catch (error) {
      console.log(error);
      flashErrorMessage();
    }
  };
  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <AuthHeader />
      <AuthError isShowError={isShowError} />
      <div className={styles.label}>Username</div>
      <input {...register("username")} />
      {errors.username && (
        <p className={styles.err}>{errors.username.message}</p>
      )}
      <div className={styles.label}>Password</div>
      <input type='password' {...register("password")} />
      {errors.password && (
        <p className={styles.err}>{errors.password.message}</p>
      )}
      <button
        type='submit'
        className={styles.btn_authenticate}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <PulseLoader
            loading={isSubmitting}
            size={8}
            color='var(--clr-body)'
            cssOverride={{ marginTop: ".1rem" }}
            speedMultiplier={1}
          />
        ) : isLogin ? (
          "Log in"
        ) : (
          "Sign up"
        )}
      </button>
      <AuthCallToAction
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        reset={reset}
      />
    </form>
  );
}
