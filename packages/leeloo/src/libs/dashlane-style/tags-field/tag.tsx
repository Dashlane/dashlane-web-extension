import * as React from "react";
import classnames from "classnames";
import styles from "./styles.css";
interface TagProps {
  validate: (tag: string) => boolean;
  value: string;
  handleEdit: (tag: string) => void;
  handleRemove: (tag: string) => void;
}
export const Tag = (props: TagProps) => {
  const { value, validate, handleEdit, handleRemove } = props;
  const tagsClassName = classnames(styles.tag, {
    [styles.invalid]: !validate(value),
  });
  const onRemove: React.MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    handleRemove(value);
  };
  const onEdit: React.MouseEventHandler<HTMLElement> = () => {
    handleEdit(value);
  };
  return (
    <span className={tagsClassName} onClick={onEdit}>
      <span className={styles.tagContent}>{value}</span>
      <span className={styles.close} onClick={onRemove} />
    </span>
  );
};
