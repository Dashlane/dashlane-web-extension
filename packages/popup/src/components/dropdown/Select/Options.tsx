import * as React from "react";
import classNames from "classnames";
import Option from "./Option";
import styles from "../styles.css";
export interface Item<T extends string> {
  label: string;
  value: T;
  active?: boolean;
}
interface Props<T extends string> {
  items: Item<T>[];
  onSelect: (value: T) => void;
  listboxLabel: string;
  title?: string;
  small?: boolean;
  className?: string;
}
const Options = <T extends string>({
  items,
  onSelect,
  title,
  listboxLabel,
  small,
  className,
}: Props<T>) => {
  return (
    <ul
      className={classNames(styles.menuList, className, {
        [styles.smallList]: small,
      })}
      role="listbox"
      aria-label={listboxLabel}
    >
      {title && <li className={styles.subtitleItem}>{title}</li>}
      {items.map((item) => (
        <Option
          key={item.value}
          label={item.label}
          value={item.value}
          active={item.active || false}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
};
export default Options;
