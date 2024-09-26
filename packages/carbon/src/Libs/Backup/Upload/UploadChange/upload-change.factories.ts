import { Optional } from "utility-types";
import { BaseDataModelObject, DataModelType } from "@dashlane/communication";
import {
  UploadChange,
  UploadChangeAction,
  UploadChangeStatus,
} from "Libs/Backup/Upload/UploadChange/types";
export interface CreateUploadChangeParams {
  itemId: string;
  kwType: DataModelType;
  action?: UploadChangeAction;
}
export const createUploadChange = ({
  itemId,
  kwType,
  action = "EDIT",
  status = UploadChangeStatus.ReadyForNextSync,
}: Optional<UploadChange, "action" | "status">): UploadChange => ({
  itemId,
  kwType,
  action,
  status,
});
const toCreateParams = (item: BaseDataModelObject) => ({
  itemId: item.Id,
  kwType: item.kwType,
});
export const createUploadChangeForItem = (item: BaseDataModelObject) =>
  createUploadChange(toCreateParams(item));
export const createUploadChangeForDeletion =
  (kwType: DataModelType) => (deletedItemId: string) =>
    createUploadChange({
      itemId: deletedItemId,
      kwType,
      action: "REMOVE",
    });
