import { curry, defaultTo } from "ramda";
import { Note, NoteCategory, NoteDetailView } from "@dashlane/communication";
import { dataModelDetailView } from "DataManagement/views";
import { detailView as categoryDetailView } from "DataManagement/SecureNotes/views/category";
import { createdAt, updatedAt } from "DataManagement/SecureNotes/helpers";
const defaultToEmptyString = defaultTo("");
export const detailView = curry(
  (
    getCategory: (categoryId: string) => NoteCategory | undefined,
    note: Note
  ): NoteDetailView => {
    const category = getCategory(note.Category);
    return {
      ...dataModelDetailView(note),
      category: categoryDetailView(category),
      color: note.Type,
      content: defaultToEmptyString(note.Content),
      createdAt: createdAt(note),
      secured: defaultTo(false, note.Secured),
      title: defaultToEmptyString(note.Title),
      updatedAt: updatedAt(note),
    };
  }
);
