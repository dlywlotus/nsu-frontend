import styles from "../styles/CommentSection.module.css";
import CommentBar from "./CommentBar";
import Comment from "./Comment";

// TODO Add profileIcon, username field to comments

export type CommentDetails = {
  id: number;
  body: string;
  postId: string;
  authorId: string;
  parentCommentId: number;
  createdAt: string;
  nestedComments: CommentDetails[]
}

type props = {
  comments: CommentDetails[];
  postId: string;
};

export default function CommentSection({ comments, postId }: props) {
  return (
    <div className={styles.container}>
      <CommentBar postId={postId} parentCommentId={null} />
      <div className={styles.comment_list}>
        {comments?.map(comment => (
          <Comment key={comment.id} commentData={comment} />
        ))}
      </div>
    </div>
  );
}
