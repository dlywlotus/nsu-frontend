import styles from "../styles/CreatePostPage.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import SelectMenu from "../components/SelectMenu";
import showError from "../util/showError";
import { useContext } from "react";
import { AuthContext } from "../Hooks/useAuth";
import axios, { Axios, AxiosError } from "axios";

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
  category: z.enum(["EVENTS", "STUDIES", "HOUSING", "OTHERS"]),
});

const categoryOptions = [
  { value: "EVENTS", label: "events" },
  { value: "STUDIES", label: "studies" },
  { value: "HOUSING", label: "housing" },
  { value: "OTHERS", label: "others" },
];

// Infer form schema type
type FormData = z.infer<typeof formSchema>;

export default function CreatePostModal() {
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: categoryOptions[0].value,
    },
  });

  const onSelect = (option: any, _: string) => {
    reset({
      category: option.value,
    });
  };
  const onSubmit = async (formData: FormData): Promise<any> => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/post`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authDetails?.accessToken}`
          }
        }
      )
    } catch (error) {
      if (error instanceof AxiosError)
        console.log(error.response?.data);
      else {
        console.log(error);
      }
      showError("Error creating post");
    } finally {
      navigate("/");
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>Create post</div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label htmlFor='title'>Title</label>
          <TextareaAutosize
            className={styles.title_input}
            id='title'
            minRows={1}
            {...register("title")}
          />
          {errors.title && <p className={styles.err}>{errors.title.message}</p>}

          <label htmlFor='body'>Body</label>
          <TextareaAutosize
            className={styles.body_input}
            id='body'
            minRows={5}
            {...register("body")}
          />
          {errors.body && <p className={styles.err}>{errors.body.message}</p>}

          <div className={styles.label}>Category</div>
          <SelectMenu options={categoryOptions} onChange={onSelect} />
          <button type='submit'>
            {isSubmitting ? "...Posting" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
