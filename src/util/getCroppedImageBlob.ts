const getCroppedImageBlob = (imageSrc: any, crop: any) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const targetWidth = 200;
      const targetHeight = 200;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      context?.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        targetWidth,
        targetHeight
      );

      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
        } else {
          resolve(blob);
        }
      }, "image/jpeg");
    };

    image.onerror = error => reject(error);
  });
};

export default getCroppedImageBlob;
