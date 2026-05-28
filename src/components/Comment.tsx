import { useState } from "react";
import styles from "../styles/Comment.module.css";
import { CommentDetails } from "./CommentSection";
import { formatDistanceToNowStrict } from "date-fns";
import CommentBar from "./CommentBar"
import getIcon from "../util/getIcon";

type props = {
  commentData: CommentDetails;
};

export default function Comment({ commentData }: props) {
  const [isReplying, setIsReplying] = useState(false);
  const timeElapsed = formatDistanceToNowStrict(
    new Date(commentData.createdAt)
  );

  return (
    <div className={styles.container}>

      <img src={getIcon(commentData.profileIconImageKey)} alt='icon' />
      <div className={styles.main_content}>
        <div className={styles.header}>
          <div className={styles.nameAndTime}>
            <span className={styles.author}>
              {commentData.username} &middot;{" "}
            </span>
            <span className={styles.time}>{timeElapsed} ago</span>
          </div>
          {commentData.parentCommentId === null && (
            <button
              className={styles.btn_reply}
              onClick={() => setIsReplying(!isReplying)}
            >
              <i className='fa-solid fa-reply'></i>
            </button>
          )}
        </div>
        <div className={styles.comment_body}>{commentData.body}</div>
        {(commentData.nestedComments || isReplying) && (
          <div className={styles.replies}>
            {commentData.nestedComments &&
              commentData.nestedComments.map(c => (
                <Comment key={c.id} commentData={c} />
              ))}
            {isReplying && (
              <CommentBar
                postId={commentData.postId}
                parentCommentId={commentData.id}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
