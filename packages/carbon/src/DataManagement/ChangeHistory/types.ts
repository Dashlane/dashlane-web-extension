import {
  BaseDataModelObject,
  Credential,
  DataModelType,
  isCredential,
  isNote,
  isSecret,
  Note,
  Secret,
} from "@dashlane/communication";
import { TransactionType } from "Libs/Backup/Transactions/types";
import { ChangeSet } from "DataManagement/ChangeHistory/ChangeSet/types";
export interface ChangeHistory extends BaseDataModelObject {
  ObjectId: string;
  ObjectTitle: string;
  ObjectType: TransactionType;
  ChangeSets: ChangeSet[];
  SpaceId?: string;
}
export type ChangeHistoryCandidate = Credential | Note | Secret;
export const isChangeHistoryCandidate = (
  x: BaseDataModelObject
): x is ChangeHistoryCandidate => isCredential(x) || isNote(x) || isSecret(x);
export interface RemovalChange {
  type: "removal";
  itemId: string;
  itemKwType: DataModelType;
}
export interface UpdateChange {
  type: "update";
  updatedItem: ChangeHistoryCandidate;
}
export type Change = RemovalChange | UpdateChange;
