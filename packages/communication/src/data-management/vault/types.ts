import type { DataModelType } from "../../DataModel/Interfaces/Common";
export enum VaultItemDisableProtectionMode {
  CannotDisable,
  DisableSpecificVaultItem,
  DisableGeneralSetting,
}
export const deleteVaultModuleItemFailureReason = Object.freeze({
  NOT_FOUND: "NOT_FOUND",
});
export type DeleteVaultModuleItemFailureReason =
  (typeof deleteVaultModuleItemFailureReason)[keyof typeof deleteVaultModuleItemFailureReason];
export interface DeleteVaultModuleItemParam {
  id: string;
  kwType?: DataModelType;
}
export interface DeleteVaultModuleItemsBulkParam {
  kwType: DataModelType;
  items: Array<DeleteVaultModuleItemParam>;
}
export type DeleteVaultModuleItemResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: {
        reason: DeleteVaultModuleItemFailureReason;
      };
    };
export type DeleteVaultModuleItemsBulkResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: {
        errors: Array<{
          id: string;
          reason: DeleteVaultModuleItemFailureReason;
        }>;
      };
    };
