import { curry, defaultTo } from "ramda";
import { Note, NoteDetailView } from "@dashlane/communication";
import { dataModelDetailView } from "DataManagement/views";
import { createdAt, updatedAt } from "DataManagement/SecureNotes/helpers";
const defaultToEmptyString = defaultTo("");
export const detailView = curry((note: Note): NoteDetailView => {
  return {
    ...dataModelDetailView(note),
    color: note.Type,
    content: defaultToEmptyString(note.Content),
    createdAt: createdAt(note),
    secured: defaultTo(false, note.Secured),
    title: defaultToEmptyString(note.Title),
    updatedAt: updatedAt(note),
  };
});
