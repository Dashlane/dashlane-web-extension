import {
  BaseDataModelObject,
  Collection,
  DataModelType,
  ImportPersonalDataItemsResponse,
} from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { CoreServices } from "Services";
import { currentTeamIdSelector } from "TeamAdmin/Services/selectors";
import {
  computeAndSendCollectionImportActivityLog,
  computeAndSendCSVImportActivityLog,
} from "DataManagement/helpers";
import { getDebounceSync } from "DataManagement/utils";
import { groupByType, savePersonalDataItemsForImport } from "./utils";
import {
  getAllExistingCollections,
  getExistingVaultItemUniqueIdentifiers,
  getImportableItemsFromUserFile,
} from "./import-items.helpers";
export const importPersonalDataItems = async (
  coreServices: CoreServices,
  objects: BaseDataModelObject[]
): Promise<ImportPersonalDataItemsResponse> => {
  const {
    storeService,
    sessionService,
    localStorageService,
    applicationModulesAccess,
  } = coreServices;
  const state = storeService.getState();
  const debounceSync = getDebounceSync(storeService, sessionService);
  let importedItemCount = 0;
  let importedCredentialsInBusinessSpaceCount = 0;
  const existingVaultItemUniqueIdentifiers =
    getExistingVaultItemUniqueIdentifiers(state.userSession.personalData);
  const { itemsToImport, importableItemCount, duplicateItemCount } =
    await getImportableItemsFromUserFile(
      coreServices,
      objects,
      existingVaultItemUniqueIdentifiers,
      getAllExistingCollections(
        state.userSession.sharingData.collections ?? [],
        state.userSession.personalData.collections
      )
    );
  const grouped = groupByType(itemsToImport);
  for (const [dataType, items] of grouped.entries()) {
    savePersonalDataItemsForImport(
      {
        storeService,
        sessionService,
        localStorageService,
        applicationModulesAccess,
      },
      dataType,
      items
    );
    if (dataType !== DataModelType.KWCollection) {
      importedItemCount += items.length;
    }
    if (dataType === DataModelType.KWAuthentifiant) {
      const teamId = currentTeamIdSelector(state);
      importedCredentialsInBusinessSpaceCount = items.filter(
        (item) => item.SpaceId === teamId
      ).length;
      if (importedCredentialsInBusinessSpaceCount >= 1) {
        await computeAndSendCSVImportActivityLog(applicationModulesAccess, {
          domainUrl: null,
          importCount: importedCredentialsInBusinessSpaceCount,
        });
      }
    }
    if (dataType === DataModelType.KWCollection) {
      items.forEach((collection) => {
        const collectionData = collection as Collection;
        if (collectionData?.SpaceId) {
          computeAndSendCollectionImportActivityLog(applicationModulesAccess, {
            collectionName: collectionData?.Name,
            itemCount: collectionData?.VaultItems.length,
          }).catch(() => {});
        }
      });
    }
  }
  debounceSync({ immediateCall: true }, Trigger.Save);
  return {
    successCount: importedItemCount,
    totalCount: importableItemCount,
    duplicateCount: duplicateItemCount,
  };
};
