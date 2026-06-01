import { useNavigate } from "react-router-dom";
import styles from "../styles/Post.module.css";
import type { PostDetails } from "./PostList";
import PostSocialCounters from "./PostSocialCounters";
import PostControls from "./PostControls"
import PostHeader from "./PostHeader";
import PostEditor from "./PostEditor";

type props = {
  postContent: PostDetails;
  isShowControls?: boolean;
  isExpanded?: boolean;
  isEditing?: boolean;
};

export default function Post({
  postContent,
  isShowControls = false,
  isExpanded = false,
  isEditing = false,
}: props) {
  const navigate = useNavigate();

  const expandPost = () => {
    navigate(`/post/${postContent.id}`);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        onClick={isExpanded ? undefined : expandPost}
        data-expanded={isExpanded}
        data-editable={isShowControls}
      >
        <PostHeader postContent={postContent} />
        {isEditing && <PostEditor postContent={postContent} />}
        {!isEditing && (
          <>
            <div className={styles.post_title}>{postContent.title}</div>
            <p className={styles.post_body}>{postContent.body}</p>
          </>
        )}
        <PostSocialCounters postContent={postContent} />
        {isShowControls && <PostControls postId={postContent.id} />}
      </div>
      <div className={styles.back_shadow}></div>
    </div>
  );
}
