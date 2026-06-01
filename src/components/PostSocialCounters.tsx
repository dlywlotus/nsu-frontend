import styles from "../styles/PostSocialCounters.module.css";
import PostLikes from "./PostLikes"
import { PostDetails } from "./PostList";

type props = {
  postContent: PostDetails;
};

export default function PostSocialCounters({ postContent }: props) {
  return (
    <section className={styles.social_counters}>
      <PostLikes
        postId={postContent.id}
        count={postContent.likeCount}
        isLiked={postContent.userLiked}
      />
      <div className={styles.comment_count}>
        <i className='fa-solid fa-comment'></i>
        <span>{postContent.commentCount}</span>
      </div>
    </section>
  );
}
