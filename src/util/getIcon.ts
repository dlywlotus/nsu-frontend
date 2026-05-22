import supabase from "../supabase";
import defaultIcon from "../images/defaultProfileIcon.svg";

const getIcon = (profilePic: string | null) => {
  if (profilePic?.startsWith("blob:")) {
    return profilePic;
  } else if (profilePic) {
    return supabase.storage.from("profile_icons").getPublicUrl(profilePic).data
      .publicUrl;
  } else {
    return defaultIcon;
  }
};

export default getIcon;
