import { colors, jsx, NotesIcon } from "@dashlane/ui-components";
import { NoteType } from "@dashlane/communication";
import { getBackgroundColorForNoteType } from "./getBackgroundColorForNoteType";
interface Props {
  noteType: NoteType;
}
export const NoteIcon = ({ noteType }: Props) => {
  return (
    <div
      sx={{
        alignItems: "center",
        borderRadius: "4px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        display: "flex",
        height: "32px",
        justifyContent: "center",
        width: "48px",
        backgroundColor: getBackgroundColorForNoteType(noteType),
      }}
    >
      <NotesIcon color={colors.white} size={20} />
    </div>
  );
};
