import { Note, NoteDetailView } from "@dashlane/communication";
import { detailView } from "DataManagement/SecureNotes/views/detail";
export function viewNote(note: Note): NoteDetailView | undefined {
  if (!note) {
    return undefined;
  }
  return detailView(note);
}
