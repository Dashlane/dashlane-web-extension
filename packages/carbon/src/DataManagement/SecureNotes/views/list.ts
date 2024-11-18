import { curry, defaultTo } from "ramda";
import { Note, NoteItemView } from "@dashlane/communication";
import { dataModelItemView } from "DataManagement/views";
import { createdAt, updatedAt } from "DataManagement/SecureNotes/helpers";
const defaultToEmptyString = defaultTo("");
const abbreviate = (content: string): string => {
  const threshold = 30;
  if (content.length > threshold) {
    return content.slice(0, threshold - 3) + "\u2026";
  }
};
export const itemView = curry((note: Note): NoteItemView => {
  const content = note.Secured
    ? "*******"
    : abbreviate(defaultToEmptyString(note.Content));
  return {
    ...dataModelItemView(note),
    abbrContent: content,
    color: note.Type,
    createdAt: createdAt(note),
    secured: note.Secured || false,
    title: defaultToEmptyString(note.Title),
    updatedAt: updatedAt(note),
  };
});
export const listView = (notes: Note[]) => {
  const view = itemView();
  return notes.map(view);
};
