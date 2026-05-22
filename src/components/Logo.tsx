import styles from "../styles/Logo.module.css";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link className={styles.logo} to='/'>
      N<span>SU</span> Forums
    </Link>
  );
}
