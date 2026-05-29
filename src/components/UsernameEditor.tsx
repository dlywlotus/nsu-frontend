import { useState } from "react";
import styles from "../styles/UsernameEditor.module.css";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "./LoadingSpinner";
import useMutateUsername from "../Hooks/useMutateUsername";
import { UserInfo } from "./UserDetails";
import Skeleton from "react-loading-skeleton";
import { confirmAlert } from "react-confirm-alert";

type props = {
  userData: UserInfo | undefined;
};

//Zod schema
const formSchema = z.object({
  username: z
    .string()
    .min(3, "Min length: 3 chars")
    .max(15, "Max length: 15 chars"),
});

// Infer form schema type
type FormData = z.infer<typeof formSchema>;

export default function UsernameEditor({ userData }: props) {
  const username = userData?.username;
  const [isEditing, setIsEditing] = useState(false);
  const mutation = useMutateUsername();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: FormData): Promise<any> => {
    if (formData.username === username) return;

    confirmAlert({
      title: "Confirmation",
      message: "Your login username will change. Are you sure you want to continue?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            mutation.mutate(formData.username);
            setIsEditing(false);
          }
        },
        {
          label: "No",
          onClick: () => { setIsEditing(false); },
        },
      ],
    });
  };

  const onStartEditing = () => {
    setIsEditing(true);
    //fill input field with fetched name
    reset({
      username: username,
    });
  };

  if (!userData)
    return (
      <Skeleton
        width={250}
        style={{
          marginBlock: "1.5rem 2rem",
          padding: "0.5rem",
          borderRadius: ".75rem",
        }}
      />
    );

  return (
    <>
      {isEditing ? (
        <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
          <input type='text' {...register("username")} autoFocus />
          <button className={styles.btn_save}>
            <i className='fa-solid fa-check'></i>
          </button>
          {errors.username && (
            <p className={styles.err}>{errors.username.message}</p>
          )}
        </form>
      ) : (
        <div className={styles.container}>
          <div className={styles.name}>{username}</div>
          <button className={styles.btn_edit} onClick={onStartEditing}>
            <i className='fa-solid fa-pen'></i>
          </button>
        </div>
      )}

      {isSubmitting && <LoadingSpinner isLoading={isSubmitting} />}
    </>
  );
}
