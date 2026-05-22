import styles from "../styles/UserDetails.module.css";
import ProfileIcon from "../components/ProfileIcon";
import UsernameEditor from "./UsernameEditor";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../Hooks/useAuth";

type props = {};

export type fetchedUser = {
  Username: string;
  ProfilePic: string | null;
};

export default function UserDetails({ }: props) {
  const { userId } = useUser();

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/user/${userId}`
      );
      const user: fetchedUser = data.user;
      return user;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: fetchedUser } = useQuery({
    queryKey: ["userDetails"],
    queryFn: fetchUserDetails,
    enabled: userId !== null,
  });

  return (
    <section className={styles.user_details}>
      <ProfileIcon fetchedUser={fetchedUser} />
      <UsernameEditor fetchedUser={fetchedUser} />
    </section>
  );
}
