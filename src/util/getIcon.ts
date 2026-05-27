import defaultIcon from '../images/defaultProfileIcon.svg';

const getIcon = (profilePic: string | null) => {
  if (profilePic?.startsWith('blob:')) {
    return profilePic;
  } else if (profilePic) {
    return defaultIcon;
  } else {
    return defaultIcon;
  }
};

export default getIcon;
