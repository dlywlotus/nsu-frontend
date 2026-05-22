import { toast } from "react-toastify";

const showError = (message: string) => {
  toast.error(message, {
    autoClose: 5000,
    theme: "colored",
    style: {
      backgroundColor: "var(--clr-error)",
    },
  });
};

export default showError;
