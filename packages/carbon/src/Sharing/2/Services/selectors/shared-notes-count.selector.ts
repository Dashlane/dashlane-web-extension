import { createSelector } from "reselect";
import { sortedSharedItemIdsSelector } from "Sharing/2/Services/selectors/sorted-shared-item-ids.selector";
import { notesSelector } from "DataManagement/SecureNotes/selectors/notes.selector";
import { isShared } from "Sharing/2/Services/is-shared";
export const sharedNotesCountSelector = createSelector(
  sortedSharedItemIdsSelector,
  notesSelector,
  (sortedSharedItemIds, notes) => {
    const predicate = isShared(sortedSharedItemIds);
    const sharedNotes = notes.filter(predicate);
    return sharedNotes.length;
  }
);
