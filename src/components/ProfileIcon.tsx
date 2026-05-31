import { useRef, useState } from "react";
import getCroppedImageBlob from "../util/getCroppedImageBlob";
import ImageCropper from "../components/ImageCropper";
import styles from "../styles/ProfileIcon.module.css";
import { useQueryClient, useMutation, InfiniteData } from "@tanstack/react-query";
import showError from "../util/showError";
import { UserInfo } from "./UserDetails";
import Skeleton from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import getIcon from "../util/getIcon";
import { protectedApi } from "../Hooks/useAxiosInterceptor";
import { Page } from "./PostDashboard";

type props = {
  userInfo: UserInfo | undefined;
};

export default function ProfileIcon({ userInfo }: props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<any>(null);
  const [uploadedImg, setUploadedImg] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 765px)" });

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type.startsWith("image/")) {
      // check file size first 
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
    //store image url in users table in database
    const imageFile = new File([imageBlob], "fileToUpload.jpeg", {
      type: imageBlob.type,
      lastModified: new Date().getTime()
    });
    const formData = new FormData();
    formData.append('file', imageFile);
    const res = await protectedApi.put("user/profile-icon", formData);
    return res.data
  };

  const mutation = useMutation({
    mutationFn: mutateProfilePic,
    onSuccess: async (newUserData: UserInfo) => {
      queryClient.setQueryData(['userDetails'], (oldUserData: UserInfo) => ({
        ...oldUserData,
        ["profileIconImageKey"]: `${newUserData.profileIconImageKey}?time=${Date.now()}`
      }));
      queryClient.setQueriesData({ queryKey: ["posts"] }, (data: InfiniteData<Page, unknown> | undefined) => {
        if (!data) return;
        return {
          ...data,
          pages: data?.pages.map(page => ({
            ...page,
            posts: (page.posts ?? [])?.map(post => {
              let newPost = {
                ...post,
                ["profileIconImageKey"]: `${newUserData.profileIconImageKey}?time=${Date.now()}`,
              };
              return post.authorId === newUserData.id ? newPost : post;
            }),
          })),
        };
      });
      console.log(queryClient.getQueriesData({ queryKey: ['posts'] }))
    },
    onError: (err) => {
      showError("Error uploading profile icon");
      console.log(err);
    },
  });

  const onCropComplete = async (uploadedImg: any, crop: any) => {
    try {
      setIsCropping(false);
      fileInputRef.current.value = "";
      const croppedImgBlob: any = await getCroppedImageBlob(uploadedImg, crop);
      mutation.mutate(croppedImgBlob);
    } catch (error) {
      showError("Error uploading profile icon");
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.profile_pic}>
        {userInfo ? (
          <>
            <img src={getIcon(userInfo.profileIconImageKey)} alt='default' />
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
