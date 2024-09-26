import { Secret } from "@dashlane/communication";
import { SharingData } from "Session/Store/sharingData/types";
import { getLimitedSharedItemIds } from "Sharing/2/Services/limited-shared-items";
import { getSharingDataWithCollections } from "Sharing/2/Services/collection-helpers";
export function handleLimitedSharedSecrets(
  secrets: Secret[],
  sharingData: SharingData,
  userId: string
): Secret[] {
  const sharingDataWithCollections = getSharingDataWithCollections(sharingData);
  const limitedSharedItemIds = getLimitedSharedItemIds(
    sharingData,
    sharingDataWithCollections.collections,
    sharingDataWithCollections.itemGroups,
    userId
  );
  return secrets.map((secret: Secret) => ({
    ...secret,
    ...(limitedSharedItemIds[secret.Id] ? { limitedPermissions: true } : {}),
  }));
}
