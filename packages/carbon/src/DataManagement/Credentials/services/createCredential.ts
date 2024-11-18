import { defaultTo } from "ramda";
import { ParsedURL } from "@dashlane/url-parser";
import {
  BaseCredentialCreateRequest,
  Country,
  CreateCredentialResult,
  Credential,
} from "@dashlane/communication";
import { normalizeUsernames } from "DataManagement/Credentials/usernames";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { evaluatePasswordStrength } from "Health/Strength/evaluatePasswordStrength";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import {
  saveCredentialAsPersonalDataItem,
  UpdateCredentialServices,
} from "./saveCredentialAsPersonalDataItem";
import { getUrlFields } from "./helpers";
import {
  computeAndSendCreatedCredentialActivityLog,
  shouldSendCreateOrModifiedCredentialActivityLog,
} from "DataManagement/helpers";
import { getDefaultSpaceId } from "DataManagement/utils";
interface BaseCredentialModel {
  kwType: "KWAuthentifiant";
  Id: string;
  LastBackupTime: number;
  LocaleFormat: Country;
  CreationDatetime?: number;
  UserModificationDatetime?: number;
  LastUse?: number;
}
export const createBaseCredentialModel = (
  country: Country = Country.NO_TYPE
): BaseCredentialModel => {
  const creationDate = getUnixTimestamp();
  return {
    kwType: "KWAuthentifiant",
    Id: generateItemUuid(),
    CreationDatetime: creationDate,
    LastBackupTime: 0,
    LastUse: creationDate,
    LocaleFormat: country,
  };
};
export async function createCredential<CreateModel>(
  {
    storeService,
    sessionService,
    eventLoggerService,
    applicationModulesAccess,
  }: UpdateCredentialServices,
  request: BaseCredentialCreateRequest<CreateModel>,
  customMapper?: (
    model: BaseCredentialCreateRequest<CreateModel>
  ) => Partial<Credential>
): Promise<CreateCredentialResult> {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to updateCredential");
  }
  const defaultSpaceId = await getDefaultSpaceId(storeService);
  const urlFields = getUrlFields(request.url, true);
  const { email, login, secondaryLogin } = normalizeUsernames(
    request.email,
    request.login,
    request.secondaryLogin
  );
  const platformInfo = storeService.getPlatformInfo();
  const Password = defaultTo("", request.password);
  const SpaceId = defaultTo(defaultSpaceId, request.spaceId);
  const Strength = Password ? await evaluatePasswordStrength(Password) : 0;
  const addCustomFields = customMapper ? customMapper : () => ({});
  const rootDomainFromRequest = new ParsedURL(request.url).getRootDomain();
  const itemToCreate: Credential = sanitizeInputPersonalData({
    ...createBaseCredentialModel(Country[platformInfo.country]),
    AutoProtected: request.protectWithMasterPassword,
    Title: rootDomainFromRequest,
    Email: email,
    Login: login,
    SubdomainOnly: request.onlyForThisSubdomain,
    SecondaryLogin: secondaryLogin,
    Password,
    Strength,
    Status: "ACCOUNT_NOT_VERIFIED",
    SpaceId,
    AutoLogin: request.autoLogin ?? true,
    ...urlFields,
    ...addCustomFields(request),
  });
  saveCredentialAsPersonalDataItem(
    {
      storeService,
      sessionService,
      eventLoggerService,
      applicationModulesAccess,
    },
    itemToCreate
  );
  if (
    applicationModulesAccess &&
    shouldSendCreateOrModifiedCredentialActivityLog(storeService, itemToCreate)
  ) {
    await computeAndSendCreatedCredentialActivityLog(applicationModulesAccess, {
      domainUrl: itemToCreate.Url,
    });
  }
  return { credentialId: itemToCreate.Id };
}
