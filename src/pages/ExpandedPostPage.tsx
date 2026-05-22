import styles from "../styles/ExpandedPostPage.module.css";

type props = {
  isEditing?: boolean;
};

export default function ExpandedPostPage({ isEditing = false }: props) {
  return (
    <div className={styles.wrapper}>
    </div>
  );
}
