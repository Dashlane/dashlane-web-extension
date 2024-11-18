import { curry } from "ramda";
import { createdAt, updatedAt } from "DataManagement/SecureNotes/helpers";
import { Note } from "@dashlane/communication";
import { NoteMappers } from "DataManagement/SecureNotes/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
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
export const getNoteMappers = (limitedSharedItemIds: {
  [id: string]: boolean;
}): NoteMappers => ({
  createdAt: createdAt,
  hasAttachments: hasAttachmentsMapper,
  id: (note: Note) => note.Id,
  isLimited: isLimitedMapper(limitedSharedItemIds),
  lastUse: lastUseMapper,
  spaceId: (note: Note) => note.SpaceId,
  title: (note: Note) => note.Title,
  updatedAt: updatedAt,
});
