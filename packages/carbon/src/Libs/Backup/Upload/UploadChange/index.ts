import { curry, find, propEq, reject } from "ramda";
import {
  UploadChange,
  UploadChangeAction,
} from "Libs/Backup/Upload/UploadChange/types";
export { UploadChange, UploadChangeAction };
const hasMatchingId = propEq("itemId");
export type IsEditionUploadChange = (obj: UploadChange) => boolean;
export const isEditionUploadChange: IsEditionUploadChange = propEq(
  "action",
  "EDIT"
);
export type IsRemovalUploadChange = (obj: UploadChange) => boolean;
export const isRemovalUploadChange: IsRemovalUploadChange = propEq(
  "action",
  "REMOVE"
);
export type FindUploadChange = {
  (v1: string): (v2: UploadChange[]) => UploadChange;
  (v1: string, v2: UploadChange[]): UploadChange;
};
export const findUploadChange: FindUploadChange = curry(
  (id: string, change: UploadChange[]) =>
    find<UploadChange>(hasMatchingId(id), change)
);
export const countEditionUploadChanges = (uploadChanges: UploadChange[]) =>
  uploadChanges.filter((c: UploadChange) => isEditionUploadChange(c)).length;
export const countDeletionUploadChanges = (uploadChanges: UploadChange[]) =>
  uploadChanges.filter((c: UploadChange) => isRemovalUploadChange(c)).length;
export type IsSettingUploadChange = (obj: UploadChange) => boolean;
export const isSettingUploadChange: IsSettingUploadChange = propEq(
  "kwType",
  "KWSettingsManagerApp"
);
export const getUploadChangesWithoutSettings = (
  uploadChanges: UploadChange[]
) => {
  return reject(isSettingUploadChange, uploadChanges);
};
