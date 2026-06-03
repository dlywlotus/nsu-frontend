import { toast } from 'react-toastify';

const showSuccess = (message: string) => {
  toast.success(message, {
    autoClose: 5000,
    theme: 'colored',
    style: {
      backgroundColor: 'var(--clr-accent-400)',
    },
  });
};

export default showSuccess;
