import defaultIcon from '../images/defaultProfileIcon.svg';

const getIcon = (profileIconImageKey: string | null) => {
  if (profileIconImageKey?.startsWith('blob:')) {
    return profileIconImageKey;
  } else if (profileIconImageKey) {
    return `${import.meta.env.VITE_S3_SERVER}/profile-icons/${profileIconImageKey}?time=${Date.now()}`;
  } else {
    return defaultIcon;
  }
};

export default getIcon;
