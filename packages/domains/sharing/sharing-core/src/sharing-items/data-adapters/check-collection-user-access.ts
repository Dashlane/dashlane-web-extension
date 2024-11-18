import {
  SharedCollection,
  SharedItemAccessLinkTypes,
  Status,
} from "@dashlane/sharing-contracts";
import { AccessData } from "../../utils/mappers/item-group-adapter.types";
import { ItemGroup } from "../../sharing-common";
import { getHighestPermission } from "../../utils/get-highest-permission";
import { filterCollectionMembers } from "./filter-collection-members";
export const checkCollectionUserAccess = (
  itemGroup: ItemGroup,
  login: string,
  allCollections: SharedCollection[]
): AccessData | null => {
  const myCollections = allCollections.filter((collection) =>
    collection.users?.some(
      (user) =>
        user.login === login &&
        user.status === Status.Accepted &&
        !user.proposeSignatureUsingAlias &&
        user.collectionKey
    )
  );
  const collectionUserMembers = filterCollectionMembers(
    itemGroup.collections,
    myCollections
  );
  if (collectionUserMembers?.length) {
    const collectionUserMember = collectionUserMembers[0];
    const resolvedPermission = getHighestPermission(collectionUserMembers);
    if (collectionUserMember.itemGroupKey) {
      const { permission, acceptSignature, proposeSignature } =
        collectionUserMember;
      const collection = myCollections.find(
        (coll) => coll.uuid === collectionUserMember.uuid
      );
      const userInCollection = collection?.users?.find(
        (user) => user.login === login
      );
      if (
        userInCollection &&
        collection &&
        collection.privateKey &&
        userInCollection.collectionKey
      ) {
        const resolvedDecryptionLink = {
          permission,
          acceptSignature,
          proposeSignature,
          encryptedResourceKey: collectionUserMember.itemGroupKey,
          collectionEncryptedKey: userInCollection.collectionKey,
          collectionPrivateKey: collection.privateKey,
          collectionPublicKey: collection.publicKey,
          accessType: SharedItemAccessLinkTypes.CollectionUser,
        };
        return {
          link: resolvedDecryptionLink,
          permission: resolvedPermission,
        };
      }
    }
  }
  return null;
};
