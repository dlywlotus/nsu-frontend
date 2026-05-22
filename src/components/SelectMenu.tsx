import Select from "react-select";
import { useState } from "react";

export type option = {
  value: string;
  label: string;
};

type props = {
  options: option[];
  id?: string;
  onChange?: (option: any, id: string) => any;
};

export default function SelectMenu({ options, onChange, id }: props) {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "var(--clr-modal)",
      border: "1px solid var(--clr-neutral-300) !important",
      borderRadius: "0.75rem",
      boxShadow: "none",
      ":hover": {
        borderColor: "var(--clr-accent-400) !important",
      },
      width: "120px",
    }),
    menu: (styles: any) => ({
      ...styles,
      backgroundColor: "var(--clr-modal)",
      borderRadius: "0.75rem",
      boxShadow: "none",
      border: "1px solid var(--clr-neutral-300)",
      overflow: "hidden",
      width: "120px",
    }),
    option: (styles: any, { isFocused, isSelected }: any) => ({
      ...styles,
      backgroundColor:
        isFocused || isSelected ? "var(--clr-accent-200)" : "transparent",
      color: isFocused || isSelected ? "var(--clr-accent-400)" : "inherit",
    }),
    singleValue: (styles: any) => ({
      ...styles,
      color: "var(--clr-text)",
      fontSize: "var(--fs-300)",
    }),
    dropdownIndicator: (styles: any, { isFocused }: any) => ({
      ...styles,
      color: isFocused ? "var(--clr-accent-400)" : "var(--clr-text)",
    }),
  };

  const handleOnChange = (selected: any) => {
    setSelectedOption(selected);
    if (onChange) onChange(selected, id ?? "");
  };

  return (
    <Select
      id={id}
      value={selectedOption}
      options={options}
      isSearchable={false}
      styles={customStyles}
      onChange={handleOnChange}
    />
  );
}
