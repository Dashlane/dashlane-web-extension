import {
  UploadChange,
  UploadChangeStatus,
} from "Libs/Backup/Upload/UploadChange/types";
export const filterOutUploadedChanges = (
  changes: UploadChange[],
  uploadedItemIds: string[]
) =>
  changes.filter(
    ({ itemId, status }) =>
      !uploadedItemIds.includes(itemId) ||
      status !== UploadChangeStatus.ScheduledForSync
  );
const updateChangeStatus =
  (status: UploadChangeStatus) =>
  (change: UploadChange): UploadChange => ({
    ...change,
    status,
  });
export const markChangeAsScheduled = updateChangeStatus(
  UploadChangeStatus.ScheduledForSync
);
export const markChangeAsReadyForNextSync = updateChangeStatus(
  UploadChangeStatus.ReadyForNextSync
);
