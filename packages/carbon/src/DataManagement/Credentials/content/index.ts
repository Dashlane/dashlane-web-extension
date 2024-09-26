import { Credential } from "@dashlane/communication";
import { SpaceData } from "Session/Store/spaceData";
import { SharingData } from "Session/Store/sharingData/types";
import {
  isCredentialSmartCategorized,
  isSpaceQuarantined,
} from "DataManagement/Account/Spaces/index";
import { getLimitedSharedItemIds } from "Sharing/2/Services/limited-shared-items";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
import { getSharingDataWithCollections } from "Sharing/2/Services/collection-helpers";
export function fixCredentialWithMissingTitle(
  credential: Credential
): Credential {
  if (!credential.Title) {
    return Object.assign({}, credential, {
      Title: getDomainForCredential(credential),
    });
  }
  return credential;
}
export function fixCredentialsWithMissingTitles(
  credentials: Credential[]
): Credential[] {
  return credentials.map(fixCredentialWithMissingTitle);
}
export function removeCredentialsWithQuarantinedSpaces(
  spaceData: SpaceData,
  credentials: Credential[]
): Credential[] {
  if (!spaceData.spaces || spaceData.spaces.length === 0) {
    return credentials;
  }
  const itemsToRemove: Credential[] = [];
  spaceData.spaces.filter(isSpaceQuarantined).forEach((space) => {
    const teamDomains =
      space.details.info && space.details.info["teamDomains"]
        ? space.details.info["teamDomains"]
        : [];
    credentials
      .filter((credential) =>
        isCredentialSmartCategorized(credential, teamDomains)
      )
      .forEach((credential) => {
        const isQuarantined =
          credential.SpaceId !== "" &&
          credential.SpaceId === space.details.teamId;
        if (isQuarantined) {
          itemsToRemove.push(credential);
        }
      });
  });
  return credentials.filter(
    (credential) => !itemsToRemove.includes(credential)
  );
}
export function handleLimitedSharedCredentialsPassword(
  credentials: Credential[],
  sharingData: SharingData,
  userId: string
): Credential[] {
  const sharingDataWithCollections = getSharingDataWithCollections(sharingData);
  const limitedSharedItemIds = getLimitedSharedItemIds(
    sharingData,
    sharingDataWithCollections.collections,
    sharingDataWithCollections.itemGroups,
    userId
  );
  return credentials.map((cred) => {
    if (limitedSharedItemIds[cred.Id]) {
      return Object.assign({}, cred, {
        Password: "************",
        limitedPermissions: true,
      });
    }
    return cred;
  });
}
