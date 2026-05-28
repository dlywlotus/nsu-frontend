import { useInView } from "react-intersection-observer";
import styles from "../styles/PostList.module.css";
import Post from "./Post";
import { Page } from "./PostDashboard";

export type PostDetails = {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  authorId: string;
  likeCount: number
  commentCount: number;
  username: string;
  userLiked: boolean;
  profileIconImageKey: string;
};

type props = {
  pagesOfPosts: Page[];
  fetchNextPage: any;
  hasNextPage: boolean;
  selfPosted: boolean;
};

export default function PostList({
  pagesOfPosts,
  fetchNextPage,
  hasNextPage,
  selfPosted,
}: props) {
  const { ref } = useInView({
    rootMargin: "0px 0px 500px 0px",
    onChange: (inView, _) => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    },
  });

  return (
    <div className={styles.post_list}>
      {pagesOfPosts.flatMap(page => page.posts).map(post => (
        <Post
          postContent={post}
          key={post.id}
          isShowControls={selfPosted}
        />
      ))}
      <div ref={ref} className={styles.end_of_page}>
        {hasNextPage || "No more posts"}
      </div>
    </div>
  );
}
