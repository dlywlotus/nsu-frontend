import styles from "../styles/PostHeader.module.css";
import { PostDetails } from "./PostList";
import { formatDistanceToNowStrict } from "date-fns";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import getIcon from "../util/getIcon";

type props = {
  postContent: PostDetails;
};

const icon: Record<string, string> = {
  EVENTS: "fa-solid fa-calendar",
  STUDIES: "fa-solid fa-book",
  HOUSING: "fa-solid fa-house",
  OTHERS: "fa-solid fa-compass",
};

export default function PostHeader({ postContent }: props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const timeElapsed = formatDistanceToNowStrict(
    new Date(postContent.createdAt)
  );

  return (
    <section className={styles.post_upper}>
      <div className={styles.icon}>
        {!isLoaded && <Skeleton circle={true} width={32} height={32} />}
        <img
          src={getIcon(`${postContent.profileIconImageKey}?time=${Date.now()}`)}
          onLoad={() => setIsLoaded(true)}
          alt='user_icon'
          data-loaded={isLoaded}
        ></img>
      </div>
      <div className={styles.post_details}>
        <div className={styles.categoryAndTime}>
          <div className={styles.category}>
            <i className={icon[postContent.category]}></i>
            <span>{postContent.category}</span>
          </div>
          <span>&middot;</span>
          <span className={styles.time}>{timeElapsed} ago</span>
        </div>
        <div className={styles.name}>
          <span>{postContent.username}</span>
        </div>
      </div>
    </section>
  );
}
