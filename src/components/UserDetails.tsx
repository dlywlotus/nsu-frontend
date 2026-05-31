import styles from "../styles/UserDetails.module.css";
import UsernameEditor from "./UsernameEditor";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Hooks/useAuth";
import { protectedApi } from "../Hooks/useAxiosInterceptor";
import ProfileIcon from "./ProfileIcon";

type props = {};

export type UserInfo = {
  id: string;
  username: string;
  profileIconImageKey: string | null;
};

export default function UserDetails({ }: props) {
  const { authDetails } = useContext(AuthContext);

  const fetchUserDetails = async (): Promise<UserInfo | undefined> => {
    if (!authDetails) return;

    const { data } = await protectedApi.get("/user");
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
