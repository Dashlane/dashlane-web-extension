import { curry, defaultTo } from "ramda";
import { Note, NoteCategory, NoteItemView } from "@dashlane/communication";
import { dataModelItemView } from "DataManagement/views";
import { detailView as categoryDetailView } from "DataManagement/SecureNotes/views/category";
import { createdAt, updatedAt } from "DataManagement/SecureNotes/helpers";
const defaultToEmptyString = defaultTo("");
const abbreviate = (content: string): string => {
  const threshold = 30;
  if (content.length > threshold) {
    return content.slice(0, threshold - 3) + "\u2026";
  }
};
export const itemView = curry(
  (
    getCategory: (categoryId: string) => NoteCategory | undefined,
    note: Note
  ): NoteItemView => {
    const category = getCategory(note.Category);
    const content = note.Secured
      ? "*******"
      : abbreviate(defaultToEmptyString(note.Content));
    return {
      ...dataModelItemView(note),
      abbrContent: content,
      category: categoryDetailView(category),
      color: note.Type,
      createdAt: createdAt(note),
      secured: note.Secured || false,
      title: defaultToEmptyString(note.Title),
      updatedAt: updatedAt(note),
    };
  }
);
export const listView = (
  getCategory: (categoryId: string) => NoteCategory | undefined,
  notes: Note[]
) => {
  const view = itemView(getCategory);
  return notes.map(view);
};
