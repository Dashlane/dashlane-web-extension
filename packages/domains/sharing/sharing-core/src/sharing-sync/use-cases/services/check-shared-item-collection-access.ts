import {
  Permission,
  SharedItemAccessLinkTypes,
  Status,
} from "@dashlane/sharing-contracts";
import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import { AccessData } from "../../../sharing-items/data-adapters/item-group-adapter.types";
import {
  SharedCollectionAccessLinkTypes,
  SharedCollectionState,
} from "../../../sharing-collections/data-access/shared-collections.state";
import { TypeOfArray } from "../../../utils/type-of-array";
type CollectionMember = TypeOfArray<ItemGroupDownload["collections"]>;
interface Access {
  permission: Permission;
  member?: CollectionMember;
  collection?: SharedCollectionState;
}
export const findCollectionAccess = (
  members: CollectionMember[] | undefined,
  myCollections: SharedCollectionState[]
): Access => {
  const accessLink: Access = { permission: Permission.Limited };
  if (!members) {
    return accessLink;
  }
  for (const currentMember of members) {
    if (
      currentMember.status === Status.Accepted &&
      currentMember.itemGroupKey
    ) {
      if (currentMember.permission === Permission.Admin) {
        accessLink.permission = Permission.Admin;
      }
      if (
        !accessLink.collection ||
        accessLink.collection.accessLink?.accessType !==
          SharedCollectionAccessLinkTypes.User
      ) {
        const myCollection = myCollections.find(
          (coll) => coll.id === currentMember.uuid && coll.accessLink
        );
        if (myCollection) {
          accessLink.collection = myCollection;
        }
      }
      if (
        accessLink.permission === Permission.Admin &&
        accessLink.collection?.accessLink?.accessType ===
          SharedCollectionAccessLinkTypes.User
      ) {
        break;
      }
    }
  }
  return accessLink;
};
export const checkCollectionAccess = (
  itemGroup: ItemGroupDownload,
  myCollections: SharedCollectionState[]
): AccessData | null => {
  const access = findCollectionAccess(itemGroup.collections, myCollections);
  if (access.collection && access.member) {
    const { collection, member } = access;
    const { permission, acceptSignature, proposeSignature, itemGroupKey } =
      member;
    if (itemGroupKey) {
      if (
        collection.accessLink?.accessType ===
        SharedCollectionAccessLinkTypes.User
      ) {
        const { encryptedResourceKey: collectionKey } = collection.accessLink;
        if (collectionKey) {
          const resolvedDecryptionLink = {
            permission,
            acceptSignature,
            proposeSignature,
            encryptedResourceKey: itemGroupKey,
            collectionEncryptedKey: collectionKey,
            collectionPrivateKey: collection.privateKey,
            accessType: SharedItemAccessLinkTypes.CollectionUser,
          };
          return {
            link: resolvedDecryptionLink,
            permission: access.permission,
          };
        }
      }
    }
  }
  return null;
};
