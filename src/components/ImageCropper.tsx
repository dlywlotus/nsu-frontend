import styles from "../styles/ImageCropper.module.css";
import Cropper from "react-easy-crop";
import { useState } from "react";

type props = {
  imageSrc: any;
  onCropComplete: (uploadedImg: any, crop: any) => Promise<void>;
};

type area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function ImageCropper({ imageSrc, onCropComplete }: props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<area | null>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          cropShape='round'
          onCropAreaChange={(_, croppedAreaPixels) =>
            setCropArea(croppedAreaPixels)
          }
        />
        <button
          className={styles.btn_save}
          onClick={() => {
            onCropComplete(imageSrc, cropArea);
          }}
        >
          <i className='fa-solid fa-check'></i>
        </button>
      </div>
    </div>
  );
}
