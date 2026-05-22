// import styles from '../styles/NotFoundPage.module.css';
import { Link } from "react-router-dom";

type props = {};

export default function NotFoundPage({}: props) {
  return (
    <>
      <div>Looks like you are lost!</div>
      <Link to='/'>Go back home</Link>
    </>
  );
}
