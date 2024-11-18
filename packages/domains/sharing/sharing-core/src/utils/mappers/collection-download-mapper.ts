import { CollectionDownload } from "@dashlane/server-sdk/v1";
import { Permission, SharingUserGroup } from "@dashlane/sharing-contracts";
import { SharedCollectionState } from "../../sharing-collections/data-access/shared-collections.state";
import { crawlForAccessData } from "./crawl-collection-access-data";
export const toSharedCollection = (
  collectionDownload: CollectionDownload,
  userGroups: SharingUserGroup[],
  login: string
): SharedCollectionState => {
  const { link, permission, otherAdminsFound, isAccepted } = crawlForAccessData(
    collectionDownload,
    login,
    userGroups
  );
  const isLastAdmin = permission === Permission.Admin && !otherAdminsFound;
  const {
    name,
    privateKey,
    publicKey,
    revision,
    uuid: id,
  } = collectionDownload;
  return {
    id,
    name,
    privateKey,
    publicKey,
    revision,
    accessLink: link,
    isLastAdmin,
    isAccepted,
    permission,
  };
};
