import useTheme from "../Hooks/useTheme";
import Switch from "react-switch";

export default function DarkModeButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
  };

  return (
    <Switch
      checked={theme === "dark"}
      onChange={toggleTheme}
      onColor='#c78d94'
      offColor='#121212'
      handleDiameter={20}
      uncheckedIcon={false}
      checkedIcon={false}
      width={60}
    />
  );
}
