import styles from "../styles/LoadingSpinner.module.css";
import ClipLoader from "react-spinners/ClipLoader";

type props = {
  isLoading: boolean;
};

export default function LoadingSpinner({ isLoading }: props) {
  return (
    <div className={styles.wrapper}>
      <ClipLoader
        color={"#c78d94"}
        loading={isLoading}
        size={40}
        cssOverride={{ marginTop: "2rem" }}
        speedMultiplier={1}
      />
    </div>
  );
}
