import { curry } from "ramda";
import { createdAt, updatedAt } from "DataManagement/SecureNotes/helpers";
import { Note, NoteCategory } from "@dashlane/communication";
import { NoteMappers } from "DataManagement/SecureNotes/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
const categoryMapper = curry(
  (categories: NoteCategory[], note: Note): string => {
    const categoryId = note.Category;
    const category = (categories || []).find((c) => c.Id === categoryId);
    return category && category.CategoryName
      ? category.CategoryName
      : "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
  }
);
const hasAttachmentsMapper = (note: Note): boolean =>
  !!note.Attachments && note.Attachments.length > 0;
const isLimitedMapper = curry(
  (
    limitedSharedItemIds: {
      [id: string]: boolean;
    },
    note: Note
  ): boolean => !!limitedSharedItemIds[note.Id]
);
export const getNoteMappers = (
  categories: NoteCategory[],
  limitedSharedItemIds: {
    [id: string]: boolean;
  }
): NoteMappers => ({
  category: categoryMapper(categories),
  createdAt: createdAt,
  hasAttachments: hasAttachmentsMapper,
  id: (note: Note) => note.Id,
  isLimited: isLimitedMapper(limitedSharedItemIds),
  lastUse: lastUseMapper,
  spaceId: (note: Note) => note.SpaceId,
  title: (note: Note) => note.Title,
  updatedAt: updatedAt,
});
