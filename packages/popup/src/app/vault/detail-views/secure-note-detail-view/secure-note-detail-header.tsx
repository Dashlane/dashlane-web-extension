import { memo } from "react";
import { jsx } from "@dashlane/design-system";
import { NoteDetailView } from "@dashlane/communication";
import { NoteIcon } from "../../active-tab-list/lists/secure-notes-list/secure-note-item/note-icon/note-icon";
import { openItemInWebapp } from "../helpers";
import { Header } from "../common/header";
interface SecureNoteDetailHeaderProps {
  note: NoteDetailView;
  onClose: () => void;
}
const SecureNoteDetailHeaderComponent = ({
  note,
  onClose,
}: SecureNoteDetailHeaderProps) => (
  <Header
    Icon={<NoteIcon noteType={note.color} />}
    title={note.title}
    onEdit={() => {
      void openItemInWebapp(note.id, "/notes");
    }}
    onClose={onClose}
  />
);
export const SecureNoteDetailHeader = memo(SecureNoteDetailHeaderComponent);
