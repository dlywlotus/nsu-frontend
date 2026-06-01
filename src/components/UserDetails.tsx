import styles from "../styles/UserDetails.module.css";
import UsernameEditor from "./UsernameEditor";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { api, AuthContext } from "../Hooks/useAuth";
import ProfileIcon from "./ProfileIcon";

type props = {};

export type UserInfo = {
  id: string;
  username: string;
  profileIconImageKey: string | null;
};

export default function UserDetails({ }: props) {
  const { getAuthDetails } = useContext(AuthContext);

  const fetchUserDetails = async (): Promise<UserInfo | undefined> => {
    const authDetails = await getAuthDetails();
    const { data } = await api.get("/user", {
      headers: {
        Authorization: `Bearer ${authDetails?.accessToken}`
      }
    });
    console.log(data);
    return data;
  };

  const { data } = useQuery({
    queryKey: ["userDetails"],
    queryFn: fetchUserDetails,
    staleTime: 1000 * 60
  });

  return (
    <section className={styles.user_details}>
      <ProfileIcon userInfo={data} />
      <UsernameEditor userData={data} />
    </section>
  );
}
