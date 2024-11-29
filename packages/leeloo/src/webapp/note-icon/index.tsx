import getBackgroundColorForNoteType from "./getBackgroundColorForNoteType";
const classnames = require("classnames");
import styles from "./styles.css";
import Logo from "./note.svg?inline";
interface Props {
  noteType: string;
  className?: string;
}
export const NoteIcon = ({ noteType, className }: Props) => {
  return (
    <div
      className={classnames(styles.noteIcon, className)}
      style={{ backgroundColor: getBackgroundColorForNoteType(noteType) }}
    >
      <Logo />
    </div>
  );
};
