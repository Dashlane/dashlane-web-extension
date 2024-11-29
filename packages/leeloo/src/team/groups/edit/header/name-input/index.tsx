import { KeyboardEvent, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { Heading } from "@dashlane/design-system";
import LoadingSpinner from "../../../../../libs/dashlane-style/loading-spinner";
import styles from "./styles.css";
import pencilIcon from "./pencil.svg";
interface Props {
  onNameChanged?: (newName: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  defaultValue?: string;
  editable: boolean;
  saving?: boolean;
}
export const NameInput = ({
  onNameChanged,
  defaultValue,
  editable,
  saving,
}: Props) => {
  const input = useRef<HTMLInputElement>(null);
  const [groupName, setGroupName] = useState<string | undefined>(defaultValue);
  const [editing, setEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    if (editing) {
      input.current?.focus();
    }
  }, [editing, input]);
  const handleNameContainerClicked = () => {
    if (editable) {
      setEditing(true);
    }
  };
  const saveName = () => {
    const newName = input.current?.value.trim();
    setEditing(false);
    setGroupName(newName ? newName : defaultValue);
    if (onNameChanged && newName) {
      onNameChanged(newName).then(({ success, error = null }) => {
        const stayInEditMode = !success;
        setEditing(stayInEditMode);
        setErrorMessage(success ? null : error);
      });
    }
  };
  const handleKeyUpOnNameInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      saveName();
    }
  };
  const showErrorMessage = Boolean(errorMessage);
  return (
    <Heading
      as="h1"
      color="ds.text.neutral.standard"
      textStyle="ds.title.section.large"
    >
      {!editing && (
        <div
          className={classnames(styles.nameContainer, {
            [styles.hoverableContainer]: editable,
          })}
          onClick={handleNameContainerClicked}
        >
          {groupName}
          {saving ? (
            <LoadingSpinner
              size={20}
              containerClassName={styles.nameEditIcon}
            />
          ) : (
            <img className={styles.nameEditIcon} src={pencilIcon} />
          )}
        </div>
      )}

      {editing && (
        <div className={styles.editNameContainer}>
          <input
            ref={input}
            type="text"
            className={classnames(styles.nameInput, {
              [styles.error]: showErrorMessage,
            })}
            defaultValue={groupName}
            onBlur={saveName}
            onKeyUp={handleKeyUpOnNameInput}
          />
        </div>
      )}

      {editing && showErrorMessage ? (
        <div className={styles.errorMessage}>{errorMessage}</div>
      ) : null}
    </Heading>
  );
};
