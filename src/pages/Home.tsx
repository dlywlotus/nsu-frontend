import PostDashboard from "../components/PostDashboard";
import styles from "../styles/Home.module.css";

type props = {};

export default function Home({ }: props) {
  return (
    <div className={styles.wrapper}>
      <PostDashboard />
    </div>
  );
}
