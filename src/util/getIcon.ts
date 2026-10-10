import defaultIcon from '../images/defaultProfileIcon.svg';

const getIcon = (profileIconImageKey: string | null) => {
  return profileIconImageKey
    ? `${import.meta.env.VITE_S3_SERVER_URL}/profile-icons/${profileIconImageKey}`
    : defaultIcon;
};

export default getIcon;
