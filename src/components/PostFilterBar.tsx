import styles from "../styles/PostFilterBar.module.css";
import { filterOptions } from "./PostDashboard";
import { useState } from "react";
import SelectMenu from "./SelectMenu";
import { categoryOptions } from "../pages/CreatePostPage";

type props = {
  filter: filterOptions;
  setFilter: React.Dispatch<React.SetStateAction<filterOptions>>;
};

const sortByOptions = [
  { value: "createdAt", label: "new" },
  { value: "likes", label: "likes" },
];

export default function PostFilterBar({ setFilter }: props) {
  const [input, setInput] = useState("");

  const onSelect = (option: any, id: string) => {
    setFilter(filter => ({ ...filter, [id]: option.value }));
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilter(filter => ({ ...filter, searchKeyword: input.trim() }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <section className={styles.filter_group}>
          <div className={styles.label}>Category:</div>
          <SelectMenu
            options={[{ value: "ALL", label: "all" }, ...categoryOptions]}
            onChange={onSelect}
            id={"category"}
          />
        </section>
        <section className={styles.filter_group}>
          <div className={styles.label}>Sort by:</div>
          <SelectMenu
            options={sortByOptions}
            onChange={onSelect}
            id={"sortBy"}
          />
        </section>
      </div>
      <form className={styles.search_bar} onSubmit={onSearch}>
        <input
          name='query'
          type='text'
          maxLength={25}
          placeholder='Search'
          onChange={e => setInput(e.target.value)}
          value={input}
        />
        <button className={styles.btn_search}>
          <i className='fa-solid fa-magnifying-glass'></i>
        </button>
      </form>
    </div>
  );
}
