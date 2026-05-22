import { useRef, useState } from "react";
import getCroppedImageBlob from "../util/getCroppedImageBlob";
import ImageCropper from "../components/ImageCropper";
import supabase from "../supabase";
import styles from "../styles/ProfileIcon.module.css";
import axios from "axios";
import getSession from "../util/getSession";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import mutateUserDetails from "../util/mutateUserDetails";
import { useUser } from "../Hooks/useAuth";
import showError from "../util/showError";
import { fetchedUser } from "./UserDetails";
import Skeleton from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import getIcon from "../util/getIcon";

type props = {
  fetchedUser: fetchedUser | undefined;
};

export default function ProfileIcon({ fetchedUser }: props) {
  const { userId } = useUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<any>(null);
  const [uploadedImg, setUploadedImg] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 765px)" });

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImg(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    } else {
      showError("Please upload a valid image file");
    }
  };

  const mutateProfilePic = async (imageBlob: Blob) => {
    const { token } = await getSession();

    //delete old image from storage if it exists
    if (fetchedUser?.ProfilePic) {
      const { error } = await supabase.storage
        .from("profile_icons")
        .remove([fetchedUser?.ProfilePic]);

      if (error) {
        throw new Error(error.message);
      }
    }

    const newImageName = `User_${userId}_${Date.now()}.jpeg`;

    //upload new image to storage
    const { error: storageError } = await supabase.storage
      .from("profile_icons")
      .upload(newImageName, imageBlob, {
        cacheControl: "31536000",
      });

    if (storageError) throw new Error(storageError.message);

    //store image url in users table in database
    await axios.put(
      `${import.meta.env.VITE_SERVER_API_URL}/auth_req/edit_user/${userId}`,
      {
        profilePic: newImageName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const mutation = useMutation({
    mutationFn: mutateProfilePic,
    onMutate: imageBlob => {
      const tempImageURl = URL.createObjectURL(imageBlob);
      const undoFn = mutateUserDetails(
        tempImageURl,
        "ProfilePic",
        queryClient,
        userId
      );
      return undoFn;
    },
    onError: (err, _, undo) => {
      undo && undo();
      showError("Error uploading profile icon");
      console.log(err);
    },
  });

  const onCropComplete = async (img: any, crop: any) => {
    try {
      setIsCropping(false);
      fileInputRef.current.value = "";
      const croppedImgBlob: any = await getCroppedImageBlob(img, crop);
      mutation.mutate(croppedImgBlob);
    } catch (error) {
      showError("Error uploading profile icon");
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.profile_pic}>
        {fetchedUser ? (
          <>
            <img src={getIcon(fetchedUser.ProfilePic)} alt='default' />
            <input type='file' ref={fileInputRef} onChange={handleImgUpload} />
            <span className={styles.text}>Edit image</span>
          </>
        ) : (
          <Skeleton
            circle={true}
            width={isMobile ? 150 : 200}
            height={isMobile ? 150 : 200}
          />
        )}
      </div>
      {isCropping && (
        <ImageCropper imageSrc={uploadedImg} onCropComplete={onCropComplete} />
      )}
    </>
  );
}
