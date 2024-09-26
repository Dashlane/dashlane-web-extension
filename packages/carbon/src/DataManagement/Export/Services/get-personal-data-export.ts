import { firstValueFrom } from "rxjs";
import { Permission, SharingItemsClient } from "@dashlane/sharing-contracts";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import {
  BaseDataModelObject,
  GetPersonalDataExportErrorMessage,
  GetPersonalDataExportRequest,
  GetPersonalDataExportResult,
  isDataModelObject,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { State } from "Store";
import { getDashlaneSecureExport } from "DataManagement/Export/Services/get-dashlane-secure-export";
import { makeDataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { makeFlexibleMarkerCryptoConfig } from "Libs/CryptoCenter/transportable-data";
import { PERSONAL_SPACE_ID } from "DataManagement/Spaces/constants";
import { PersonalDataVaultItems } from "DataManagement/types";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { addressesSelector } from "DataManagement/PersonalInfo/Address/selectors";
import { bankAccountsSelector } from "DataManagement/BankAccounts/selectors";
import { collectionsSelector } from "DataManagement/Collections";
import { companiesSelector } from "DataManagement/PersonalInfo/Company/selectors";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { idCardsSelector } from "DataManagement/Ids/IdCards/selectors";
import { driverLicensesSelector } from "DataManagement/Ids/DriverLicenses/selectors";
import { emailsSelector } from "DataManagement/PersonalInfo/Email/selectors";
import { fiscalIdsSelector } from "DataManagement/Ids/FiscalIds/selectors";
import { identitiesSelector } from "DataManagement/PersonalInfo/Identity/selectors";
import { secretsSelector } from "DataManagement/Secrets/selectors/secrets.selector";
import { notesSelector } from "DataManagement/SecureNotes/selectors/notes.selector";
import { passkeysSelector } from "DataManagement/Passkeys/selectors";
import { passportsSelector } from "DataManagement/Ids/Passports/selectors";
import { paymentCardsSelector } from "DataManagement/PaymentCards/selectors";
import { personalWebsitesSelector } from "DataManagement/PersonalInfo/PersonalWebsite/selectors";
import { phonesSelector } from "DataManagement/PersonalInfo/Phone/selectors";
import { socialSecurityIdsSelector } from "DataManagement/Ids/SocialSecurityIds/selectors";
import { isForcedDomainsEnabledSelector } from "../Api/isForcedDomainsEnabled.selector";
import { getCSVExport } from "./get-csv-export";
const NO_SERVER_KEY = "";
type PersonalDataItems =
  PersonalDataVaultItems[keyof PersonalDataVaultItems][number];
export const filterNonExportableData = async <T extends PersonalDataItems>(
  data: T[],
  isForcedDomainsEnabled: boolean,
  sharingItemsClient: SharingItemsClient
): Promise<T[]> => {
  const itemIds = data.map((item) => item.Id);
  const sharedItemsPermissions = await firstValueFrom(
    sharingItemsClient.queries.getPermissionForItems({
      itemIds,
    })
  );
  if (isFailure(sharedItemsPermissions)) {
    throw new Error(`Could not retrieve item permission for export`);
  }
  const sharedItemsPermissionsResult = getSuccess(sharedItemsPermissions);
  return data.filter((item) => {
    let isItemInForcedSpace = false;
    const isItemLimitedPermissions =
      sharedItemsPermissionsResult[item.Id] === Permission.Limited;
    if (isForcedDomainsEnabled && isDataModelObject(item)) {
      isItemInForcedSpace = item.SpaceId !== PERSONAL_SPACE_ID;
    }
    return !isItemInForcedSpace && !isItemLimitedPermissions;
  });
};
type ExportableAndQuarantinableItems = PersonalDataVaultItems[keyof Omit<
  PersonalDataVaultItems,
  "credentialCategories"
>][number];
const filterQuarantinedData = <T extends ExportableAndQuarantinableItems>(
  state: State,
  data: T[]
): T[] => {
  const quarantinedSpaces = quarantinedSpacesSelector(state);
  return filterOutQuarantinedItems(data, quarantinedSpaces);
};
export const getFilteredPersonalData = async (
  state: State,
  sharingItemsClient: SharingItemsClient
): Promise<PersonalDataVaultItems> => {
  const isForcedDomainsEnabled = isForcedDomainsEnabledSelector(state);
  const filteredQuarantinedCredentials = filterQuarantinedData(
    state,
    credentialsSelector(state)
  );
  const exportableCredentials = await filterNonExportableData(
    filteredQuarantinedCredentials,
    isForcedDomainsEnabled,
    sharingItemsClient
  );
  const filteredQuarantinedSecrets = filterQuarantinedData(
    state,
    secretsSelector(state)
  );
  const exportableSecrets = await filterNonExportableData(
    filteredQuarantinedSecrets,
    isForcedDomainsEnabled,
    sharingItemsClient
  );
  const filteredQuarantineNotes = filterQuarantinedData(
    state,
    notesSelector(state)
  );
  const exportableNotes = await filterNonExportableData(
    filteredQuarantineNotes,
    isForcedDomainsEnabled,
    sharingItemsClient
  );
  return {
    addresses: filterQuarantinedData(state, addressesSelector(state)),
    bankAccounts: filterQuarantinedData(state, bankAccountsSelector(state)),
    collections: filterQuarantinedData(state, collectionsSelector(state)),
    companies: filterQuarantinedData(state, companiesSelector(state)),
    credentials: exportableCredentials,
    driverLicenses: filterQuarantinedData(state, driverLicensesSelector(state)),
    emails: filterQuarantinedData(state, emailsSelector(state)),
    fiscalIds: filterQuarantinedData(state, fiscalIdsSelector(state)),
    idCards: filterQuarantinedData(state, idCardsSelector(state)),
    identities: filterQuarantinedData(state, identitiesSelector(state)),
    notes: exportableNotes,
    passkeys: filterQuarantinedData(state, passkeysSelector(state)),
    passports: filterQuarantinedData(state, passportsSelector(state)),
    paymentCards: filterQuarantinedData(state, paymentCardsSelector(state)),
    personalWebsites: filterQuarantinedData(
      state,
      personalWebsitesSelector(state)
    ),
    phones: filterQuarantinedData(state, phonesSelector(state)),
    secrets: exportableSecrets,
    socialSecurityIds: filterQuarantinedData(
      state,
      socialSecurityIdsSelector(state)
    ),
  };
};
export async function getPersonalDataExport(
  services: CoreServices,
  getPersonalDataExportRequest: GetPersonalDataExportRequest
): Promise<GetPersonalDataExportResult> {
  const { storeService } = services;
  const state = storeService.getState();
  const { exportType, password } = getPersonalDataExportRequest;
  const sharingItemsClient =
    services.applicationModulesAccess.createClients().sharingItems;
  const filteredPersonalData = await getFilteredPersonalData(
    state,
    sharingItemsClient
  );
  switch (exportType) {
    case "csv":
      return {
        success: true,
        response: {
          filename: "dashlane-credential-export.zip",
          content: await getCSVExport(filteredPersonalData),
        },
      };
    case "secure-dashlane": {
      if (!password) {
        return {
          success: false,
          error: {
            code: GetPersonalDataExportErrorMessage.UNDEFINED_PASSWORD_ERROR,
          },
        };
      }
      const encryptorService = makeDataEncryptorService(storeService);
      const cryptoConfig = makeFlexibleMarkerCryptoConfig("argon2d");
      encryptorService.setInstance(
        { raw: password },
        NO_SERVER_KEY,
        cryptoConfig
      );
      const vaultData = Object.values(filteredPersonalData)
        .flat()
        .map((vaultItem: BaseDataModelObject) => ({ ...vaultItem }));
      return {
        success: true,
        response: {
          filename: "Dashlane Export.dash",
          content: await getDashlaneSecureExport(
            encryptorService.getInstance(),
            vaultData
          ),
        },
      };
    }
    default:
      return {
        success: false,
        error: {
          code: GetPersonalDataExportErrorMessage.UNSUPPORTED_DATATYPE_ERROR,
        },
      };
  }
}
