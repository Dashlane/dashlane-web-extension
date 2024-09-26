import { Note, NoteCategory, NoteDetailView } from "@dashlane/communication";
import { getCategory } from "DataManagement/SecureNotes/helpers";
import { detailView } from "DataManagement/SecureNotes/views/detail";
export function viewNote(
  note: Note,
  categories: NoteCategory[]
): NoteDetailView | undefined {
  if (!note) {
    return undefined;
  }
  const getCategoryById = getCategory(categories);
  return detailView(getCategoryById, note);
}
