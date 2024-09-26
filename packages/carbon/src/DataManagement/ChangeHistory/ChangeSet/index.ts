import { defaultTo, isNil } from "ramda";
import {
  BaseDataModelObject,
  CredentialLinkedServices,
  LinkedWebsite,
  PlatformInfo,
} from "@dashlane/communication";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import {
  ChangeSet,
  ChangeSetCurrentData,
  KWAuthentifiantCurrentData,
  KWSecureNoteCurrentData,
  SignificantProperties,
  SignificantPropertiesByType,
} from "DataManagement/ChangeHistory/ChangeSet/types";
import { Change } from "DataManagement/ChangeHistory/types";
export {
  ChangeSet,
  ChangeSetCurrentData,
  KWAuthentifiantCurrentData,
  KWSecureNoteCurrentData,
  SignificantProperties,
};
const significantPropertiesByType: SignificantPropertiesByType = {
  KWAuthentifiant: {
    Email: "",
    Login: "",
    Note: "",
    Password: "",
    SecondaryLogin: "",
    Title: "",
    Url: "",
    UserSelectedUrl: "",
    LinkedServices: {
      associated_domains: [],
    },
  },
  KWSecureNote: {
    Content: "",
    Title: "",
  },
  KWSecret: {
    Content: "",
    Title: "",
  },
};
export function getChangedPropertiesForRemoval(
  oldItem: BaseDataModelObject
): SignificantProperties[] {
  const significantPropertiesForType =
    significantPropertiesByType[oldItem.kwType];
  const significantProperties = Object.keys(
    significantPropertiesForType
  ) as SignificantProperties[];
  return significantProperties.filter((property) => {
    if (property === "LinkedServices") {
      return (
        oldItem[property]?.associated_domains &&
        oldItem[property].associated_domains.length > 0
      );
    }
    return (
      oldItem[property] &&
      oldItem[property] !== significantPropertiesForType[property]
    );
  });
}
const areStringListsEquivalent = (
  list1: string[],
  list2: string[]
): boolean => {
  return (
    list1.length === list2.length &&
    list1.sort().join("") === list2.sort().join("")
  );
};
export function getChangedProperties(
  oldItem: BaseDataModelObject,
  newItem: BaseDataModelObject
): SignificantProperties[] {
  const significantPropertiesForType =
    significantPropertiesByType[oldItem.kwType];
  const significantProperties = Object.keys(
    significantPropertiesForType
  ) as SignificantProperties[];
  return significantProperties.filter((property) => {
    if (property === "LinkedServices") {
      const oldLinkedWebsitesDomains = (
        oldItem[property]?.associated_domains ?? []
      ).map((linkedWebsite: LinkedWebsite) => linkedWebsite.domain);
      const newLinkedWebsitesDomains = (
        newItem[property]?.associated_domains ?? []
      ).map((linkedWebsite: LinkedWebsite) => linkedWebsite.domain);
      return !areStringListsEquivalent(
        oldLinkedWebsitesDomains,
        newLinkedWebsitesDomains
      );
    }
    return (
      oldItem[property] &&
      oldItem[property] !== "" &&
      oldItem[property] !== newItem[property]
    );
  });
}
export interface GetChangeSetParams {
  change: Change;
  deviceName: string;
  oldItem: BaseDataModelObject;
  userLogin: string;
  platformInfo: PlatformInfo;
}
export function getChangeSet(params: GetChangeSetParams): ChangeSet {
  const { change, deviceName, oldItem, userLogin, platformInfo } = params;
  if (isNil(oldItem)) {
    return null;
  }
  const changedProperties =
    change.type === "removal"
      ? getChangedPropertiesForRemoval(oldItem)
      : getChangedProperties(oldItem, change.updatedItem);
  if (changedProperties.length === 0) {
    return null;
  }
  return {
    kwType: "KWChangeSet",
    ChangedProperties: changedProperties,
    CurrentData: getCurrentData(oldItem),
    Id: generateItemUuid(),
    Platform: platformInfo.platformName,
    DeviceName: deviceName || "",
    ModificationDate: getUnixTimestamp(),
    Removed: defaultTo(false, change.type === "removal"),
    User: userLogin,
  };
}
export function getCurrentData(
  oldItem: BaseDataModelObject
): ChangeSetCurrentData {
  const significantProperties = Object.keys(
    significantPropertiesByType[oldItem.kwType]
  ) as SignificantProperties[];
  return significantProperties.reduce((currentData, property) => {
    if (property === "LinkedServices") {
      currentData[property] = oldItem[property]?.associated_domains
        ? oldItem[property]
        : ({ associated_domains: [] } as CredentialLinkedServices);
    } else {
      currentData[property] = oldItem[property] || "";
    }
    return currentData;
  }, {} as ChangeSetCurrentData);
}
