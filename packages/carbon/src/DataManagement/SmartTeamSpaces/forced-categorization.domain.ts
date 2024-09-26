import { partition } from "ramda";
import {
  BaseDataModelObject,
  Credential,
  DataModelType,
  Email,
  GeneratedPassword,
  isGeneratedPassword,
  PremiumStatusSpace,
} from "@dashlane/communication";
import { PendingCredentialInvite } from "@dashlane/sharing-contracts";
import {
  ForceCategorizable,
  ForceCategorizableFieldsGetter,
  ForceCategorizableKWType,
  ForceCategorizationTeamSpacePick,
  PersonalDataItemTypeFromKWType,
  SpaceWithForceCategorization,
  TeamDomainsMatchResult,
} from "DataManagement/SmartTeamSpaces/forced-categorization.domain-types";
import { getBestUrl } from "DataManagement/Credentials/url";
import { findAssociatedCredential } from "DataManagement/GeneratedPassword/associated-credential";
import { getUserAddedLinkedWebsiteDomains } from "DataManagement/LinkedWebsites";
const someFieldsMatchTeamDomains = (
  fields: string[],
  teamDomains: string[]
): boolean => {
  return (teamDomains || []).some((domain: string) => {
    if (typeof domain !== "string") {
      return false;
    }
    const lowerCasedDomain = domain.toLowerCase();
    return (fields || []).some((field) => {
      return typeof field === "string"
        ? field.toLowerCase().includes(lowerCasedDomain)
        : false;
    });
  });
};
const getCredentialFieldsForForcedCategorization = (
  credential: Credential
): string[] => [
  credential.Login,
  credential.SecondaryLogin,
  credential.Email,
  getBestUrl(credential),
  ...getUserAddedLinkedWebsiteDomains(credential),
];
const getSharedItemFieldsForForcedCategorization = (
  item: PendingCredentialInvite
): string[] => [
  item.login,
  item.secondaryLogin,
  item.email,
  item.url,
  ...(item.linkedDomains ?? []),
];
const getGeneratedPasswordFieldsForForcedCategorization = (
  generatedPassword: GeneratedPassword,
  credentials: Credential[]
) => {
  const generatedPasswordFields = [generatedPassword.Domain];
  const associatedCredential = findAssociatedCredential(
    generatedPassword,
    credentials
  );
  const associatedCredentialFields = associatedCredential
    ? getCredentialFieldsForForcedCategorization(associatedCredential)
    : [];
  return [...generatedPasswordFields, ...associatedCredentialFields];
};
const getEmailFieldsForForcedCategorization = (email: Email) => [email.Email];
const FORCED_CATEGORIZATION_FIELDS: {
  [k in ForceCategorizableKWType]: ForceCategorizableFieldsGetter<
    PersonalDataItemTypeFromKWType<k>
  >;
} = {
  [DataModelType.KWAuthentifiant]: getCredentialFieldsForForcedCategorization,
  [DataModelType.KWGeneratedPassword]:
    getGeneratedPasswordFieldsForForcedCategorization,
  [DataModelType.KWEmail]: getEmailFieldsForForcedCategorization,
};
function getFieldsForForcedCategorization<T extends ForceCategorizable>(
  item: T
): string[] {
  const getFieldsFn = FORCED_CATEGORIZATION_FIELDS[item.kwType];
  return getFieldsFn ? getFieldsFn(item) : [];
}
const isItemTeamSpace = (itemSpaceId: string) => (space: PremiumStatusSpace) =>
  itemSpaceId === space.teamId;
export const isTeamSpaceQuarantined = (space: PremiumStatusSpace) =>
  space.status === "revoked";
export const isTeamSpaceAfterGracePeriod = (space: PremiumStatusSpace) =>
  isTeamSpaceQuarantined(space) && Boolean(space.shouldDelete);
export const ForceCategorizableKWTypes = [
  DataModelType.KWAuthentifiant,
  DataModelType.KWEmail,
  DataModelType.KWGeneratedPassword,
];
export const pickBestTeamSpaceForForcedCategorizationForSharedItem = (
  spaces: SpaceWithForceCategorization["details"][],
  item: PendingCredentialInvite
): ForceCategorizationTeamSpacePick | null => {
  const fields = getSharedItemFieldsForForcedCategorization(item);
  const itemSpaceId = item.spaceId;
  return pickBestTeamSpace(spaces, fields, itemSpaceId);
};
export const pickBestTeamSpaceForForcedCategorization = (
  spaces: SpaceWithForceCategorization["details"][],
  item: ForceCategorizable,
  credentials: Credential[]
): ForceCategorizationTeamSpacePick | null => {
  const itemSpaceId = item.SpaceId;
  const fields = isGeneratedPassword(item)
    ? getGeneratedPasswordFieldsForForcedCategorization(item, credentials)
    : getFieldsForForcedCategorization(item);
  return pickBestTeamSpace(spaces, fields, itemSpaceId);
};
const pickBestTeamSpace = (
  spaces: SpaceWithForceCategorization["details"][],
  fields: string[],
  itemSpaceId: string
) => {
  const domainsMatchingResults = spaces.reduce((acc, space) => {
    const matchesDomains = someFieldsMatchTeamDomains(
      fields,
      space.info.teamDomains
    );
    return { ...acc, [space.teamId]: matchesDomains };
  }, {});
  const matchingSpaces = spaces.filter(
    (space) =>
      domainsMatchingResults[space.teamId] ||
      (isTeamSpaceQuarantined(space) && space.teamId === itemSpaceId)
  );
  const [quarantinedSpaces, nonQuarantinedSpaces] = partition(
    isTeamSpaceQuarantined,
    matchingSpaces
  );
  const [quarantinedSpacesAfterGracePeriod, quarantinedSpacesInGracePeriod] =
    partition(isTeamSpaceAfterGracePeriod, quarantinedSpaces);
  const [itemNonQuarantinedSpace, otherNonQuarantinedSpaces] = partition(
    isItemTeamSpace(itemSpaceId),
    nonQuarantinedSpaces
  );
  const orderedMatchingSpaces = [
    ...quarantinedSpacesAfterGracePeriod,
    ...quarantinedSpacesInGracePeriod,
    ...itemNonQuarantinedSpace,
    ...otherNonQuarantinedSpaces,
  ] as SpaceWithForceCategorization["details"][];
  if (orderedMatchingSpaces.length === 0) {
    return null;
  }
  const bestMatchingSpace = orderedMatchingSpaces[0];
  if (
    bestMatchingSpace.teamId === itemSpaceId &&
    !isTeamSpaceQuarantined(bestMatchingSpace)
  ) {
    return null;
  }
  return {
    teamSpace: bestMatchingSpace,
    domainsMatchResult: domainsMatchingResults[bestMatchingSpace.teamId]
      ? TeamDomainsMatchResult.SomeFieldsMatch
      : TeamDomainsMatchResult.NoFieldMatch,
  };
};
export function isItemForceCategorizable(
  item: BaseDataModelObject
): item is ForceCategorizable {
  return item.kwType in FORCED_CATEGORIZATION_FIELDS;
}
export const isItemToForceCategorize = <T extends ForceCategorizable>(
  item: T,
  space: PremiumStatusSpace
) => {
  if (!space?.info) {
    return false;
  }
  const { forcedDomainsEnabled, teamDomains } = space.info;
  if (!forcedDomainsEnabled) {
    return false;
  }
  const fields = getFieldsForForcedCategorization(item);
  return someFieldsMatchTeamDomains(fields, teamDomains);
};
