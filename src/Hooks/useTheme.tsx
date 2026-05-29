import { useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.classList.add("no-transitions");
    document.documentElement.setAttribute("data-theme", theme);

    setTimeout(() => {
      document.documentElement.classList.remove("no-transitions");
    }, 50);
  }, [theme]);

  return { theme, setTheme };
};

export default useTheme;
