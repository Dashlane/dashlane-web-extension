import {
  type DataModelObject,
  type DeleteVaultModuleItemFailureReason,
  deleteVaultModuleItemFailureReason,
  type DeleteVaultModuleItemParam,
  type DeleteVaultModuleItemsBulkParam,
} from "@dashlane/communication";
import { UpdateCredentialOrigin } from "@dashlane/hermes";
import {
  type ChangeHistory,
  isChangeHistoryCandidate,
} from "DataManagement/ChangeHistory";
import { credentialSelector } from "DataManagement/Credentials/selectors/credential.selector";
import { findPersonalDataItemToDelete } from "DataManagement/Deletion";
import { getRemoveChangeHistory } from "DataManagement/Deletion/changeHistoryUpdate";
import { logDeleteVaultItem } from "DataManagement/PersonalData/logs";
import { updateProtectPasswordsSettingHandler } from "DataManagement/Settings/Api/handlers";
import Debugger from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { disableCredentialProtection } from "ProtectedItemsUnlocker/disable-credential-protection";
import type { CoreServices } from "Services";
import { protectPasswordsSettingSelector } from "Session/selectors";
import {
  deleteVaultModuleItem,
  deleteVaultModuleItemsBulk,
} from "Session/Store/personalData/actions";
import type { StoreService } from "Store";
function reportErrorForReason(reason: DeleteVaultModuleItemFailureReason) {
  const context = `[DataManagement] - Vault API`;
  const augmentedError = new Error(`${context}: ${reason}`);
  sendExceptionLog({ error: augmentedError });
  Debugger.error(augmentedError);
}
function makeErrorResult(reason: DeleteVaultModuleItemFailureReason) {
  reportErrorForReason(reason);
  return {
    success: false,
    error: {
      reason,
    },
  } as const;
}
const getDeleteVaultModuleItemChangeHistory = (
  storeService: StoreService,
  personalDataItemToDelete: DataModelObject
) => {
  let changeHistory: ChangeHistory = null;
  if (isChangeHistoryCandidate(personalDataItemToDelete)) {
    changeHistory = getRemoveChangeHistory(
      storeService,
      personalDataItemToDelete
    );
  }
  return changeHistory;
};
export const deleteVaultModuleItemHandler = async (
  { storeService, eventLoggerService }: CoreServices,
  { id, kwType }: DeleteVaultModuleItemParam
) => {
  const personalDataItemToDelete = findPersonalDataItemToDelete(
    storeService,
    id,
    kwType
  );
  if (!personalDataItemToDelete) {
    return makeErrorResult(deleteVaultModuleItemFailureReason.NOT_FOUND);
  }
  const changeHistory = getDeleteVaultModuleItemChangeHistory(
    storeService,
    personalDataItemToDelete
  );
  logDeleteVaultItem(
    storeService,
    eventLoggerService,
    personalDataItemToDelete,
    UpdateCredentialOrigin.Manual,
    null
  );
  storeService.dispatch(
    deleteVaultModuleItem({
      kwType: personalDataItemToDelete.kwType,
      id,
      changeHistory,
    })
  );
  return { success: true } as const;
};
export const deleteVaultModuleItemsBulkHandler = async (
  { storeService, eventLoggerService }: CoreServices,
  { kwType, items }: DeleteVaultModuleItemsBulkParam
) => {
  const payload: Parameters<typeof deleteVaultModuleItemsBulk>[0] = {
    kwType,
    items: [],
  };
  const errors: Array<{
    id: string;
    reason: DeleteVaultModuleItemFailureReason;
  }> = [];
  const personalDataItemsForVaultDeleteLogs: Array<DataModelObject> = [];
  for (const { id } of items) {
    let error = null;
    const personalDataItemToDelete = findPersonalDataItemToDelete(
      storeService,
      id,
      kwType
    );
    if (!personalDataItemToDelete) {
      error = {
        id,
        reason: deleteVaultModuleItemFailureReason.NOT_FOUND,
      };
      reportError(error);
      errors.push(error);
      continue;
    }
    const changeHistory = getDeleteVaultModuleItemChangeHistory(
      storeService,
      personalDataItemToDelete
    );
    payload.items.push({
      id,
      changeHistory,
    });
    personalDataItemsForVaultDeleteLogs.push(personalDataItemToDelete);
  }
  for (const personalDataItemToDelete of personalDataItemsForVaultDeleteLogs) {
    logDeleteVaultItem(
      storeService,
      eventLoggerService,
      personalDataItemToDelete,
      UpdateCredentialOrigin.Manual,
      null
    );
  }
  if (payload.items.length) {
    storeService.dispatch(deleteVaultModuleItemsBulk(payload));
  }
  if (items.length !== payload.items.length || errors.length) {
    return { success: false, error: { errors } } as const;
  }
  return { success: true } as const;
};
export const disableVaultProtectionHandler = async (
  services: CoreServices,
  itemId: string
) => {
  const state = services.storeService.getState();
  const credential = credentialSelector(state, itemId);
  if (credential) {
    const isGlobalSettingOn = protectPasswordsSettingSelector(state);
    if (isGlobalSettingOn) {
      updateProtectPasswordsSettingHandler(services, false);
      return;
    }
    disableCredentialProtection(services, itemId);
  }
};
