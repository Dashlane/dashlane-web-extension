import { firstValueFrom } from "rxjs";
import {
  ApplicationModulesAccess,
  DataModelObject,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  DataModelType,
  isCredential,
  isNote,
  isSecret,
  RemovePersonalDataItemFailureReason,
  RemovePersonalDataItemResponse,
} from "@dashlane/communication";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { Debugger } from "Logs/Debugger";
import { removePersonalItem } from "Session/Store/personalData/actions";
import { ChangeHistory } from "DataManagement/ChangeHistory/";
import { getRemoveChangeHistory } from "DataManagement/Deletion/changeHistoryUpdate";
import { StoreService } from "Store/";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { sendExceptionLog } from "Logs/Exception";
import { PersonalData } from "Session/Store/personalData/types";
import { logDeleteVaultItem } from "DataManagement/PersonalData/logs";
import { EventLoggerService } from "Logs/EventLogger";
import { UpdateCredentialOrigin } from "@dashlane/hermes";
import { currentTeamIdSelector } from "TeamAdmin/Services/selectors";
import { computeAndSendDeletedCredentialActivityLog } from "DataManagement/helpers";
const deletablePersonalDataStoreKeys = [
  "addresses",
  "bankAccounts",
  "companies",
  "credentialCategories",
  "credentials",
  "driverLicenses",
  "emails",
  "fiscalIds",
  "idCards",
  "identities",
  "notes",
  "passkeys",
  "passports",
  "paymentCards",
  "paypalAccounts",
  "personalWebsites",
  "phones",
  "secrets",
  "secureFileInfo",
  "socialSecurityIds",
] satisfies (keyof PersonalData)[];
export function findPersonalDataItemToDelete(
  storeService: StoreService,
  itemToDeleteId: string,
  kwType?: DataModelType
): DataModelObject | null {
  let itemToDelete: DataModelObject | null = null;
  const personalData = storeService.getPersonalData();
  const matchingPersonalDataStoreLookupKey = kwType
    ? DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType] ?? null
    : null;
  if (kwType && !matchingPersonalDataStoreLookupKey) {
    return null;
  }
  const personalDataStoreLookupKeys = matchingPersonalDataStoreLookupKey
    ? [matchingPersonalDataStoreLookupKey]
    : deletablePersonalDataStoreKeys;
  for (const lookupKey of personalDataStoreLookupKeys) {
    itemToDelete = findDataModelObject<DataModelObject>(
      itemToDeleteId,
      personalData[lookupKey]
    );
    if (itemToDelete) {
      break;
    }
  }
  return itemToDelete as DataModelObject | null;
}
function makeErrorResult(
  message: string,
  reason: RemovePersonalDataItemFailureReason
) {
  const context = `[DataManagement] - deletePersonalDataItem`;
  const augmentedError = new Error(`${context}: ${message}`);
  sendExceptionLog({ error: augmentedError });
  Debugger.error(augmentedError);
  return {
    success: false,
    reason,
    message,
  } as const;
}
function attemptRefuseItemGroup(
  sharingItemsApi: SharingItemsApi,
  itemId: string
) {
  return sharingItemsApi.commands
    .refuseSharedItem({ vaultItemId: itemId })
    .then((result) => {
      if (isFailure(result)) {
        throw new Error(
          "Unexpected sharingItemsApi.commands.refuseSharedItem functional error, throwing..."
        );
      }
      return;
    })
    .catch((err: Error) => {
      return makeErrorResult(
        err.message,
        RemovePersonalDataItemFailureReason.LEAVE_SHARING_FAILED
      );
    });
}
type SharingItemsApi = ReturnType<
  ApplicationModulesAccess["createClients"]
>["sharingItems"];
async function ensureShouldAttemptRefuseItemGroup(
  sharingItemsApi: SharingItemsApi,
  itemId: string
): Promise<boolean | ReturnType<typeof makeErrorResult>> {
  const itemSharingStatusResult = await firstValueFrom(
    sharingItemsApi.queries.getSharingStatusForItem({
      itemId,
    })
  );
  if (isFailure(itemSharingStatusResult)) {
    return makeErrorResult(
      `Unable to retrieve item's sharing status.`,
      RemovePersonalDataItemFailureReason.INTERNAL_ERROR
    );
  }
  const { isSharedViaUserGroup, isShared } = getSuccess(
    itemSharingStatusResult
  );
  if (!isShared) {
    return false;
  }
  if (isSharedViaUserGroup) {
    return makeErrorResult(
      "Unshare the item before deleting it",
      RemovePersonalDataItemFailureReason.FORBIDDEN_GROUP_ITEM
    );
  }
  const isLastAdminForItemResult = await firstValueFrom(
    sharingItemsApi.queries.getIsLastAdminForItem({
      itemId,
    })
  );
  if (isFailure(isLastAdminForItemResult)) {
    return makeErrorResult(
      "Unable to determine if user is the last admin for shared item",
      RemovePersonalDataItemFailureReason.INTERNAL_ERROR
    );
  }
  const { isLastAdmin } = getSuccess(isLastAdminForItemResult);
  if (isLastAdmin) {
    return makeErrorResult(
      "Unshare the item before deleting it",
      RemovePersonalDataItemFailureReason.FORBIDDEN_LAST_ADMIN
    );
  }
  return true;
}
export interface DeletePersonalDataServices {
  storeService: StoreService;
  eventLoggerService: EventLoggerService;
  sharingItemsApi: SharingItemsApi;
  applicationModulesAccess?: ApplicationModulesAccess;
}
export async function deletePersonalDataItem(
  {
    storeService,
    eventLoggerService,
    applicationModulesAccess,
    sharingItemsApi,
  }: DeletePersonalDataServices,
  itemToDeleteId: string,
  options?: {
    ignoreSharing: boolean;
  }
): Promise<RemovePersonalDataItemResponse> {
  let changeHistory: ChangeHistory = null;
  try {
    if (!storeService.isAuthenticated()) {
      return makeErrorResult(
        "No session available to delete personal item",
        RemovePersonalDataItemFailureReason.NOT_AUTHORIZED
      );
    }
    const itemToDelete = findPersonalDataItemToDelete(
      storeService,
      itemToDeleteId
    );
    if (!itemToDelete) {
      return makeErrorResult(
        `Unable to find personal item to delete: ${itemToDeleteId}`,
        RemovePersonalDataItemFailureReason.NOT_FOUND
      );
    }
    const isCredentialItemToDelete = isCredential(itemToDelete);
    if (
      isCredentialItemToDelete ||
      isNote(itemToDelete) ||
      isSecret(itemToDelete)
    ) {
      if (!options?.ignoreSharing) {
        const shouldAttemptRefuseItemGroup =
          await ensureShouldAttemptRefuseItemGroup(
            sharingItemsApi,
            itemToDelete.Id
          );
        if (typeof shouldAttemptRefuseItemGroup !== "boolean") {
          const errorResult = shouldAttemptRefuseItemGroup;
          return errorResult;
        }
        if (shouldAttemptRefuseItemGroup === true) {
          const refuseItemGroupErrorResult = await attemptRefuseItemGroup(
            sharingItemsApi,
            itemToDelete.Id
          );
          if (refuseItemGroupErrorResult) {
            return refuseItemGroupErrorResult;
          }
        }
      }
      changeHistory = getRemoveChangeHistory(storeService, itemToDelete);
    }
    logDeleteVaultItem(
      storeService,
      eventLoggerService,
      itemToDelete,
      UpdateCredentialOrigin.Manual,
      null
    );
    const removePersonalItemAction = removePersonalItem(
      itemToDelete.kwType,
      itemToDelete.Id,
      changeHistory
    );
    storeService.dispatch(removePersonalItemAction);
    if (isCredentialItemToDelete && applicationModulesAccess !== undefined) {
      const teamId = currentTeamIdSelector(storeService.getState());
      if (itemToDelete.SpaceId === teamId) {
        await computeAndSendDeletedCredentialActivityLog(
          applicationModulesAccess,
          { domainUrl: itemToDelete.Url }
        );
      }
    }
    return { success: true };
  } catch (error) {
    return makeErrorResult(
      error.message,
      RemovePersonalDataItemFailureReason.INTERNAL_ERROR
    );
  }
}
