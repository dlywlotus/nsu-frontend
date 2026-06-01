import { useRef, useState } from "react";
import getCroppedImageBlob from "../util/getCroppedImageBlob";
import ImageCropper from "../components/ImageCropper";
import styles from "../styles/ProfileIcon.module.css";
import showError from "../util/showError";
import { UserInfo } from "./UserDetails";
import Skeleton from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import getIcon from "../util/getIcon";
import useMutateProfileIcon from "../Hooks/useMutateProfileIcon";

type props = {
  userInfo: UserInfo | undefined;
};

export default function ProfileIcon({ userInfo }: props) {
  const mutateProfileIcon = useMutateProfileIcon();
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

  const onCropComplete = async (uploadedImg: any, crop: any) => {
    try {
      setIsCropping(false);
      fileInputRef.current.value = "";
      const croppedImgBlob: any = await getCroppedImageBlob(uploadedImg, crop);
      mutateProfileIcon.mutate(croppedImgBlob);
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
