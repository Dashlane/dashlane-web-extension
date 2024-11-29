import React from "react";
import classNames from "classnames";
import { SecureNote } from "@dashlane/vault-contracts";
import { Link, redirect } from "../../../../libs/router";
import { NoteIcon } from "../../../note-icon";
import { editPanelIgnoreClickOutsideClassName } from "../../../variables";
import { useProtectedItemsUnlocker } from "../../../unlock-items/useProtectedItemsUnlocker";
import { LockedItemType, UnlockerAction } from "../../../unlock-items/types";
import styles from "./styles.css";
const THRESHOLD = 30;
interface NoteSearchItemProps {
  note: SecureNote;
  detailRoute: string;
  onSelectNote: () => void;
}
const preventDragAndDrop = (e: React.DragEvent<HTMLElement>) =>
  e.preventDefault();
const getAbbreviatedContent = (isSecured = false, content = "") => {
  if (isSecured) {
    return "*******";
  }
  if (content.length > THRESHOLD) {
    return content.slice(0, THRESHOLD - 3) + "\u2026";
  }
  return content;
};
export const NoteSearchItem = ({
  detailRoute,
  note,
  onSelectNote,
}: NoteSearchItemProps) => {
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { color, content, isSecured, title } = note;
  const isNoteLocked = isSecured && !areProtectedItemsUnlocked;
  const noteClicked = (e: React.MouseEvent<HTMLElement>) => {
    onSelectNote();
    if (isNoteLocked) {
      e.preventDefault();
      e.stopPropagation();
      openProtectedItemsUnlocker({
        action: UnlockerAction.Show,
        itemType: LockedItemType.SecureNote,
        successCallback: () => {
          redirect(detailRoute);
        },
      });
    }
  };
  const abbreviatedContent = getAbbreviatedContent(isSecured, content);
  return (
    <div
      className={classNames(styles.item, editPanelIgnoreClickOutsideClassName)}
    >
      <Link
        onClick={noteClicked}
        to={!isNoteLocked ? detailRoute : ""}
        className={styles.link}
        onDragStart={preventDragAndDrop}
        onDrop={preventDragAndDrop}
      >
        <div className={styles.logoCell}>
          <NoteIcon noteType={color} className={styles.icon} />
        </div>
        <div className={styles.info}>
          <div className={styles.title} title={title.slice(0, 30)}>
            {title}
          </div>
          <div className={styles.name} title={abbreviatedContent}>
            {abbreviatedContent}
          </div>
        </div>
      </Link>
    </div>
  );
};
