import * as React from "react";
import classNames from "classnames";
import { Link } from "../../../../libs/router";
import { editPanelIgnoreClickOutsideClassName } from "../../../variables";
import styles from "./styles.css";
interface PersonalInfoSearchItemProps {
  icon: JSX.Element;
  title: string;
  text: string;
  style?: React.CSSProperties;
  detailRoute: string;
  onSelectPersonalInfo: () => void;
}
const preventDragAndDrop = (e: React.DragEvent<HTMLElement>) =>
  e.preventDefault();
export const PersonalInfoSearchItem = (props: PersonalInfoSearchItemProps) => {
  const { icon, text, title, detailRoute, onSelectPersonalInfo } = props;
  return (
    <div className={styles.container} style={props.style}>
      <div
        className={classNames(
          styles.item,
          editPanelIgnoreClickOutsideClassName
        )}
      >
        <Link
          onClick={() => {
            onSelectPersonalInfo();
          }}
          to={detailRoute}
          className={styles.link}
          onDragStart={preventDragAndDrop}
          onDrop={preventDragAndDrop}
        >
          <div className={styles.logoCell}>{icon}</div>
          <div className={styles.info}>
            <div className={styles.title}>{title}</div>
            <div className={styles.name}>{text}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
