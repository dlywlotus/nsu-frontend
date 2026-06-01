import defaultIcon from '../images/defaultProfileIcon.svg';

const getIcon = (profileIconImageKey: string | null) => {
  return profileIconImageKey
    ? `${import.meta.env.VITE_S3_SERVER}/profile-icons/${profileIconImageKey}`
    : defaultIcon;
};

export default getIcon;
