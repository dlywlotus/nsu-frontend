import CommentSection, { CommentDetails } from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import Post from "../components/Post";
import styles from "../styles/ExpandedPostPage.module.css";
import type { PostDetails } from "../components/PostList";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { protectedApi } from "../Hooks/useAxiosInterceptor";

type props = {
  isEditing?: boolean;
};


// TODO: Find out when to cache and when to invalidate queries 
// TODO: Set up fetching and styling
// TODO: Set up user profile page
// TODO: Set up a route that fetches all comments for a given post 

export default function ExpandedPostPage({ isEditing = false }: props) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const navBack = () => {
    navigate("/");
    // queryClient.removeQueries({ queryKey: ["posts"] });
  };

  const fetchPost = async (): Promise<PostDetails> => {
    const res = await protectedApi.get(`/post/${postId}`);
    return res.data;
  };

  const fetchComments = async (): Promise<CommentDetails[]> => {
    const res = await protectedApi.get(`/post/${postId}/comments`);
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
      {isPostError && <div>Error loading post 😢</div>}
      {isFetchingPost && <LoadingSpinner isLoading={isFetchingPost} />}
      {postDetails && (
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
