import CommentSection, { CommentDetails } from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import Post from "../components/Post";
import styles from "../styles/ExpandedPostPage.module.css";
import type { PostDetails } from "../components/PostList";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { api, AuthContext } from "../Hooks/useAuth";

type props = {
  isEditing?: boolean;
};


export default function ExpandedPostPage({ isEditing = false }: props) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getAuthDetails } = useContext(AuthContext);

  const navBack = () => {
    navigate("/");
  };

  const fetchPost = async (): Promise<PostDetails> => {
    const authDetails = await getAuthDetails();
    const res = await api.get(`/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${authDetails?.accessToken}`
      }
    });
    return res.data;
  };

  const fetchComments = async (): Promise<CommentDetails[]> => {
    const authDetails = await getAuthDetails();
    const res = await api.get(`/post/${postId}/comments`, {
      headers: {
        Authorization: `Bearer ${authDetails?.accessToken}`
      }
    });
    console.log(res.data);
    return res.data;
  }

  const { data: postDetails, isFetching: isFetchingPost, isError: isPostError } = useQuery({
    queryKey: ["post", postId],
    queryFn: fetchPost,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const { data: comments, isFetching: isFetchingComments, isError: isCommentsError } = useQuery({
    queryKey: ["post", postId, "comments"],
    queryFn: fetchComments,
    staleTime: 1000 * 60  // 1 minute
  });


  return (
    <div className={styles.wrapper}>
      {isPostError && <div>Error loading posts</div>}
      {isFetchingPost && <LoadingSpinner isLoading={isFetchingPost} />}
      {!isPostError && postDetails && (
        <div className={styles.container}>
          <Post
            postContent={postDetails}
            isExpanded={true}
            isEditing={isEditing}
          />
          {isCommentsError && <div>Error loading post 😢</div>}
          {isFetchingComments && <LoadingSpinner isLoading={isFetchingPost} />}
          {comments && <CommentSection comments={comments} postId={postDetails.id} />}
          <button className={styles.btn_back} onClick={navBack}>
            <i className='fa-solid fa-arrow-left'></i>
          </button>
        </div>
      )}
    </div>
  );
}
