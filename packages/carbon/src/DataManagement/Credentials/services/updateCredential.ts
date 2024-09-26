import {
  BaseCredentialUpdateRequest,
  Credential,
} from "@dashlane/communication";
import { credentialSelector } from "DataManagement/Credentials/selectors/credential.selector";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import {
  saveCredentialAsPersonalDataItem,
  UpdateCredentialServices,
} from "./saveCredentialAsPersonalDataItem";
import { getUrlFields } from "./helpers";
import {
  computeAndSendModifiedCredentialActivityLog,
  shouldSendCreateOrModifiedCredentialActivityLog,
} from "DataManagement/helpers";
export async function updateCredential<UpdateModel>(
  {
    storeService,
    sessionService,
    eventLoggerService,
    applicationModulesAccess,
  }: UpdateCredentialServices,
  request: BaseCredentialUpdateRequest<UpdateModel>,
  customMapper?: (
    request: BaseCredentialUpdateRequest<UpdateModel>
  ) => Partial<Credential>
): Promise<void> {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to updateCredential");
  }
  const state = storeService.getState();
  const existingItem = credentialSelector(state, request.id);
  if (!existingItem) {
    throw new Error("Credential does not exist, cant update");
  }
  const urlFields = request.update.url
    ? getUrlFields(
        request.update.url,
        request.update.isUrlSelectedByUser,
        existingItem
      )
    : {};
  const addCustomFields = customMapper ? customMapper : () => ({});
  const itemToSave: Credential = {
    ...existingItem,
    ...urlFields,
    Password:
      request.update.password !== undefined
        ? request.update.password
        : existingItem.Password,
    Email: request.update.email ?? existingItem.Email,
    Login: request.update.login ?? existingItem.Login,
    Checked:
      request.update.isExcludedFromHealth !== undefined
        ? request.update.isExcludedFromHealth
        : existingItem.Checked,
    LinkedServices:
      request.update.linkedServices ?? existingItem.LinkedServices,
    ModificationDatetime: getUnixTimestamp(),
    ...addCustomFields(request),
  };
  saveCredentialAsPersonalDataItem(
    {
      storeService,
      sessionService,
      eventLoggerService,
      applicationModulesAccess,
    },
    itemToSave,
    existingItem
  );
  if (
    applicationModulesAccess &&
    shouldSendCreateOrModifiedCredentialActivityLog(storeService, itemToSave)
  ) {
    await computeAndSendModifiedCredentialActivityLog(
      applicationModulesAccess,
      {
        domainUrl: itemToSave.Url,
      }
    );
  }
}
