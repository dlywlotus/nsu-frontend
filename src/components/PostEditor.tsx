import styles from "../styles/PostEditor.module.css";
import { Post } from "./PostList";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import showError from "../util/showError";
import { protectedApi } from "../Hooks/useAxiosInterceptor";

type props = {
  postContent: Post;
};

//Zod schema
const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Max characters: 100"),
  body: z
    .string()
    .min(15, "Body must be at least 15 characters long")
    .max(1000, "Max characters: 1000"),

});

// Infer form schema type
type FormData = z.infer<typeof formSchema>;

export default function PostEditor({ postContent }: props) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (formData: FormData): Promise<any> => {
    try {
      await protectedApi.put(
        "/post", { ...formData, postId: postContent.id }
      );
      queryClient.invalidateQueries({ queryKey: ["post", postContent.id] });
      goToPost();
    } catch (error) {
      console.log(axios.isAxiosError(error) ? error?.response?.data : error);
      goToPost();
      showError("Error updating your post");
    }
  };

  const goToPost = () => {
    navigate(`/post/${postContent.id}`);
  };

  //populate react hook form on mount
  useEffect(() => {
    reset({
      title: postContent.title,
      body: postContent.body,
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TextareaAutosize
        className={styles.title_input}
        id='title'
        minRows={1}
        {...register("title")}
      />
      {errors.title && <p className={styles.err}>{errors.title.message}</p>}
      <TextareaAutosize
        className={styles.body_input}
        id='body'
        minRows={5}
        {...register("body")}
      />
      {errors.body && <p className={styles.err}>{errors.body.message}</p>}
      <div className={styles.bottom_row}>
        <button type='button' onClick={goToPost}>
          Cancel
        </button>
        <button type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Updating" : "Save"}
        </button>
      </div>
    </form>
  );
}
