import {
  BaseDataModelObject,
  Collection,
  DataModelObject,
  DataModelType,
  isCollection,
  isCredential,
  isDataModelObject,
  isNote,
  Space,
} from "@dashlane/communication";
import { CollectionDownload } from "@dashlane/server-sdk/v1";
import { PersonalData } from "Session/Store/personalData/types";
import { isPersonalSpaceEnabledSelector } from "Team/selectors";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { PERSONAL_SPACE_ID } from "DataManagement/Spaces/constants";
import {
  isDataKeyVaultItem,
  PersonalDataVaultItems,
} from "DataManagement/types";
import { CoreServices } from "Services";
import { getUniqueVaultItemIdentifier } from "./check-duplicates";
import {
  convertImportable,
  prepareCredentialForImport,
  prepareSecureNoteForImport,
} from "./utils";
const dataModelTypeDisplayedToTheUser: DataModelType[] = [
  DataModelType.KWAddress,
  DataModelType.KWAuthentifiant,
  DataModelType.KWCompany,
  DataModelType.KWDriverLicence,
  DataModelType.KWEmail,
  DataModelType.KWIDCard,
  DataModelType.KWIdentity,
  DataModelType.KWPassport,
  DataModelType.KWPaymentMean_creditCard,
  DataModelType.KWPersonalWebsite,
  DataModelType.KWPhone,
  DataModelType.KWSecureNote,
  DataModelType.KWSocialSecurityStatement,
  DataModelType.KWWebSite,
];
type AugmentedCollection =
  | {
      item: Collection;
      isShared: false;
    }
  | {
      item: null;
      isShared: true;
    };
type AugmentedCollections = Map<string, AugmentedCollection>;
const computeAugmentedCollectionKey = (name: string, spaceId: string) =>
  name + "_" + spaceId;
const getCollectionDuplicatedName = (
  name: string,
  existingCollection: AugmentedCollections
): string => {
  for (let i = 1; ; i++) {
    const newName = name + " - " + i;
    let found = false;
    existingCollection.forEach((collection) => {
      if (!collection.isShared && collection.item?.Name === newName) {
        found = true;
      }
    });
    if (!found) {
      return newName;
    }
  }
};
const SHARED_SPACE = "shared";
export const getAllExistingCollections = (
  existingSharedCollections: CollectionDownload[],
  existingCollections: Collection[]
): AugmentedCollections => {
  const collections: AugmentedCollections = new Map<
    string,
    AugmentedCollection
  >();
  existingSharedCollections.forEach((collection) => {
    collections.set(
      computeAugmentedCollectionKey(collection.name, SHARED_SPACE),
      {
        item: null,
        isShared: true,
      }
    );
  });
  existingCollections.forEach((collection) => {
    collections.set(
      computeAugmentedCollectionKey(collection.Name, collection.SpaceId),
      {
        item: collection,
        isShared: false,
      }
    );
  });
  return collections;
};
export const getExistingVaultItemUniqueIdentifiers = (
  importablePersonalData: PersonalData
): Set<string> => {
  const existingVaultItemUniqueIdentifiers = new Set<string>();
  const vaultImportableItems = Object.entries(importablePersonalData)
    .filter(([key]) => isDataKeyVaultItem(key))
    .reduce(
      (filteredPersonalData, [key, value]) => ({
        ...filteredPersonalData,
        [key]: value,
      }),
      {}
    ) as PersonalDataVaultItems;
  for (const vaultItems of Object.values(vaultImportableItems)) {
    vaultItems.forEach((item) => {
      if (isDataModelObject(item)) {
        const uniqueIdentifier = getUniqueVaultItemIdentifier(item);
        if (uniqueIdentifier) {
          existingVaultItemUniqueIdentifiers.add(uniqueIdentifier);
        }
      }
    });
  }
  return existingVaultItemUniqueIdentifiers;
};
type ImportableItemsFromUserFile = {
  itemsToImport: DataModelObject[];
  importableItemCount: number;
  duplicateItemCount: number;
};
const setSpaceId = (
  itemToImport: DataModelObject,
  hasDisablePersonalSpaceFF: boolean,
  spaces: Space[]
) => {
  if (spaces.length && hasDisablePersonalSpaceFF) {
    itemToImport.SpaceId = spaces[0].teamId;
  } else if (itemToImport.SpaceId) {
    itemToImport.SpaceId = spaces[0]?.teamId ?? PERSONAL_SPACE_ID;
  }
};
const prepareItemForImport = async (itemToImport: DataModelObject) => {
  if (isCredential(itemToImport)) {
    itemToImport = await prepareCredentialForImport(itemToImport);
  } else if (isNote(itemToImport)) {
    itemToImport = prepareSecureNoteForImport(itemToImport);
  }
  return itemToImport;
};
export const getImportableItemsFromUserFile = async (
  coreServices: CoreServices,
  itemsFromUserFile: BaseDataModelObject[],
  existingVaultItemUniqueIdentifiers: Set<string>,
  existingCollections: AugmentedCollections
): Promise<ImportableItemsFromUserFile> => {
  const { storeService } = coreServices;
  const { spaces } = storeService.getSpaceData();
  const state = storeService.getState();
  const isPersonalSpaceDisabled = !isPersonalSpaceEnabledSelector(state);
  const itemsToImport: DataModelObject[] = [];
  let importableItemCount = 0;
  let duplicateItemCount = 0;
  for (const item of itemsFromUserFile) {
    if (dataModelTypeDisplayedToTheUser.includes(item.kwType)) {
      importableItemCount++;
    } else if (
      (item.kwType as string) === "KWSecureNoteCategory" ||
      (item.kwType as string) === "KWAuthCategory"
    ) {
      continue;
    }
    const itemToImport = await prepareItemForImport(
      sanitizeInputPersonalData(convertImportable(item))
    );
    setSpaceId(itemToImport, isPersonalSpaceDisabled, spaces);
    if (isCollection(itemToImport)) {
      const existingCollectionToImport = itemsToImport.find(
        (c): c is Collection =>
          isCollection(c) &&
          c.SpaceId === itemToImport.SpaceId &&
          c.Name === itemToImport.Name
      );
      if (existingCollectionToImport) {
        existingCollectionToImport.VaultItems = [
          ...existingCollectionToImport.VaultItems,
          ...itemToImport.VaultItems,
        ];
        continue;
      }
      const existingCollectionInVault =
        existingCollections.get(
          computeAugmentedCollectionKey(itemToImport.Name, itemToImport.SpaceId)
        ) ||
        existingCollections.get(
          computeAugmentedCollectionKey(itemToImport.Name, SHARED_SPACE)
        );
      if (existingCollectionInVault && !existingCollectionInVault.isShared) {
        const collection: Collection = {
          ...itemToImport,
          Id: existingCollectionInVault.item.Id,
          VaultItems: [
            ...itemToImport.VaultItems,
            ...existingCollectionInVault.item.VaultItems,
          ],
        };
        itemsToImport.push(collection);
        continue;
      } else if (existingCollectionInVault?.isShared) {
        itemToImport.Name = getCollectionDuplicatedName(
          itemToImport.Name,
          existingCollections
        );
        itemsToImport.push(itemToImport);
        continue;
      }
    }
    if (
      isCollection(itemToImport) ||
      !existingVaultItemUniqueIdentifiers.has(
        getUniqueVaultItemIdentifier(itemToImport)
      )
    ) {
      itemsToImport.push(itemToImport);
    } else {
      duplicateItemCount++;
    }
  }
  return { itemsToImport, importableItemCount, duplicateItemCount };
};
