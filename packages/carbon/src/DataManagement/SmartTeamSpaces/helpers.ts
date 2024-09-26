import { curry } from "ramda";
import { Credential, CredentialCategory, Space } from "@dashlane/communication";
import { isCredentialSmartCategorized } from "DataManagement/Account/Spaces";
export const getCategory = curry(
  (categories: CredentialCategory[], categoryId: string) =>
    categories.find((c) => c.Id === categoryId)
);
const getActiveSpacesWithForceCategorization = (spaces: Space[]) => {
  return spaces.filter(
    (space) =>
      space.details?.status === "accepted" &&
      space.details?.info?.forcedDomainsEnabled
  );
};
export const getSmartCategorizedSpace = (spaces: Space[]) => {
  return (credential: Credential) => {
    const activeSpacesWithForceCategorization =
      getActiveSpacesWithForceCategorization(spaces);
    const teamDomains =
      activeSpacesWithForceCategorization?.[0]?.details?.info?.teamDomains ??
      [];
    return isCredentialSmartCategorized(credential, teamDomains)
      ? activeSpacesWithForceCategorization[0]
      : null;
  };
};
