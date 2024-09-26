import type { Note } from "@dashlane/communication";
import { SharingData } from "Session/Store/sharingData/types";
import { getLimitedSharedItemIds } from "Sharing/2/Services/limited-shared-items";
import { getSharingDataWithCollections } from "Sharing/2/Services/collection-helpers";
export function handleLimitedSharedNotes(
  notes: Note[],
  sharingData: SharingData,
  userId: string
): Note[] {
  const sharingDataWithCollections = getSharingDataWithCollections(sharingData);
  const limitedSharedItemIds = getLimitedSharedItemIds(
    sharingData,
    sharingDataWithCollections.collections,
    sharingDataWithCollections.itemGroups,
    userId
  );
  return notes.map((note: Note) => ({
    ...note,
    ...(limitedSharedItemIds[note.Id] ? { limitedPermissions: true } : {}),
  }));
}
