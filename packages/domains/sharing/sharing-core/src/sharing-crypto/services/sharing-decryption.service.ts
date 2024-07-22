import { Injectable } from "@dashlane/framework-application";
import { Status, UserGroupDownload } from "@dashlane/server-sdk/v1";
import { base64ToArrayBuffer, pemToPkcs8 } from "@dashlane/framework-encoding";
import {
  CollectionUserAccess,
  CollectionUserGroupAccess,
  SharedCollection,
  SharedCollectionUser,
  SharedCollectionUserGroup,
  SharedItem,
  SharedItemAccessLinkTypes,
} from "@dashlane/sharing-contracts";
import { SharingCryptographyService } from "./sharing-cryptography.service";
import {
  CurrentUserWithKeyPair,
  CurrentUserWithKeysGetterService,
  UserGroupsGetterService,
} from "../../sharing-carbon-helpers";
import {
  SharedCollectionAccessLinkTypes,
  SharedCollectionState,
} from "../../sharing-collections/data-access/shared-collections.state";
@Injectable()
export class SharingDecryptionService {
  public constructor(
    private sharingCrypto: SharingCryptographyService,
    private currentUserGetter: CurrentUserWithKeysGetterService,
    private userGroupsGetter: UserGroupsGetterService
  ) {}
  public async decryptItemGroupKey(sharedItem: SharedItem) {
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const { accessLink } = sharedItem;
    if (accessLink?.accessType === SharedItemAccessLinkTypes.User) {
      return this.decryptResourceKeyViaUserMember(accessLink, currentUser);
    }
    if (accessLink?.accessType === SharedItemAccessLinkTypes.UserGroup) {
      return this.decryptViaGroupMember(accessLink, currentUser);
    }
    if (accessLink?.accessType === SharedItemAccessLinkTypes.CollectionUser) {
      return this.decryptViaCollectionUserMember(accessLink, currentUser);
    }
    if (
      accessLink?.accessType === SharedItemAccessLinkTypes.CollectionUserGroup
    ) {
      return this.decryptViaCollectionUserGroupMember(accessLink, currentUser);
    }
    return null;
  }
  public async decryptSharedItemContent(
    sharedItem: SharedItem,
    content: string
  ) {
    try {
      const itemGroupKey = await this.decryptItemGroupKey(sharedItem);
      if (!itemGroupKey) {
        return null;
      }
      const itemKey = await this.sharingCrypto.decryptSecureData(
        itemGroupKey,
        base64ToArrayBuffer(sharedItem.itemKey)
      );
      return this.sharingCrypto.decryptContentAndConvertXMLToVaultItem(
        itemKey,
        content
      );
    } catch (error) {
      return null;
    }
  }
  public async decryptSharedCollectionKey(
    collection: SharedCollectionState,
    currentUser: CurrentUserWithKeyPair
  ) {
    const { accessLink } = collection;
    if (accessLink?.accessType === SharedCollectionAccessLinkTypes.User) {
      return this.decryptResourceKeyViaUserMember(accessLink, currentUser);
    }
    if (accessLink?.accessType === SharedCollectionAccessLinkTypes.UserGroup) {
      return this.decryptViaGroupMember(accessLink, currentUser);
    }
  }
  public async decryptResourceKeyViaUserMember(
    accessLink: {
      encryptedResourceKey: string;
    },
    currentUser: CurrentUserWithKeyPair
  ) {
    try {
      return await this.sharingCrypto.decryptResourceKey(
        pemToPkcs8(currentUser.privateKey),
        base64ToArrayBuffer(accessLink.encryptedResourceKey)
      );
    } catch {
      return null;
    }
  }
  public async decryptUserGroupKey(
    currentUser: CurrentUserWithKeyPair,
    resourceKey: string
  ) {
    return this.sharingCrypto.decryptResourceKey(
      pemToPkcs8(currentUser.privateKey),
      base64ToArrayBuffer(resourceKey)
    );
  }
  private async decryptViaGroupMember(
    accessLink: {
      encryptedResourceKey: string;
      groupEncryptedKey?: string;
      groupPrivateKey?: string;
    },
    currentUser: CurrentUserWithKeyPair
  ) {
    const { encryptedResourceKey, groupEncryptedKey, groupPrivateKey } =
      accessLink;
    if (!groupEncryptedKey || !groupPrivateKey) {
      return null;
    }
    try {
      const clearUserGroupPrivateKey =
        await this.sharingCrypto.decryptEncapsulatedPrivateKey(
          pemToPkcs8(currentUser.privateKey),
          groupEncryptedKey,
          groupPrivateKey
        );
      return await this.sharingCrypto.decryptResourceKey(
        clearUserGroupPrivateKey,
        base64ToArrayBuffer(encryptedResourceKey)
      );
    } catch (error) {
      return null;
    }
  }
  private async decryptViaCollectionUserMember(
    accessLink: CollectionUserAccess,
    currentUser: CurrentUserWithKeyPair
  ) {
    const {
      encryptedResourceKey,
      collectionEncryptedKey,
      collectionPrivateKey,
    } = accessLink;
    if (!collectionEncryptedKey || !collectionPrivateKey) {
      return null;
    }
    const clearCollectionPrivateKey =
      await this.sharingCrypto.decryptEncapsulatedPrivateKey(
        pemToPkcs8(currentUser.privateKey),
        collectionEncryptedKey,
        collectionPrivateKey
      );
    return await this.sharingCrypto.decryptResourceKey(
      clearCollectionPrivateKey,
      base64ToArrayBuffer(encryptedResourceKey)
    );
  }
  private async decryptViaCollectionUserGroupMember(
    accessLink: CollectionUserGroupAccess,
    currentUser: CurrentUserWithKeyPair
  ) {
    const {
      encryptedResourceKey,
      collectionEncryptedKey,
      collectionPrivateKey,
      groupEncryptedKey,
      groupPrivateKey,
    } = accessLink;
    if (
      !collectionEncryptedKey ||
      !collectionPrivateKey ||
      !groupEncryptedKey ||
      !groupPrivateKey
    ) {
      return null;
    }
    const clearUserGroupPrivateKey =
      await this.sharingCrypto.decryptEncapsulatedPrivateKey(
        pemToPkcs8(currentUser.privateKey),
        groupEncryptedKey,
        groupPrivateKey
      );
    const clearCollectionPrivateKey =
      await this.sharingCrypto.decryptEncapsulatedPrivateKey(
        clearUserGroupPrivateKey,
        collectionEncryptedKey,
        collectionPrivateKey
      );
    return await this.sharingCrypto.decryptResourceKey(
      clearCollectionPrivateKey,
      base64ToArrayBuffer(encryptedResourceKey)
    );
  }
  public async decryptCollectionKey(
    collectionDownload: SharedCollection,
    expectedStatus: Status = Status.Accepted
  ) {
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const userMemberOfCollection = collectionDownload.users?.find(
      (user) =>
        user.login === currentUser.login &&
        user.status === expectedStatus &&
        user.collectionKey
    );
    if (userMemberOfCollection?.collectionKey) {
      return await this.decryptCollectionKeyViaUserMember(
        userMemberOfCollection,
        currentUser
      );
    }
    const userGroups = await this.userGroupsGetter.getCarbonUserGroups();
    const myUserGroups = userGroups.filter((userGroup) =>
      userGroup.users.some(
        (user) =>
          user.userId === currentUser.login &&
          user.status === expectedStatus &&
          !user.proposeSignatureUsingAlias &&
          user.groupKey
      )
    );
    const userGroupMemberOfCollection = collectionDownload.userGroups?.find(
      (userGroup) =>
        myUserGroups.some(
          (userGroupPair) => userGroupPair.groupId === userGroup.uuid
        ) &&
        userGroup.status === expectedStatus &&
        userGroup.collectionKey
    );
    if (userGroupMemberOfCollection?.collectionKey) {
      return await this.decryptCollectionKeyViaGroupMember(
        userGroupMemberOfCollection,
        currentUser,
        myUserGroups
      );
    }
    return null;
  }
  private async decryptCollectionKeyViaUserMember(
    userMemberOfCollection: SharedCollectionUser,
    currentUser: CurrentUserWithKeyPair
  ) {
    if (!userMemberOfCollection.collectionKey) {
      return null;
    }
    try {
      return await this.sharingCrypto.decryptResourceKey(
        pemToPkcs8(currentUser.privateKey),
        base64ToArrayBuffer(userMemberOfCollection.collectionKey)
      );
    } catch {
      return null;
    }
  }
  private async decryptCollectionKeyViaGroupMember(
    userGroupMemberOfCollection: SharedCollectionUserGroup,
    currentUser: CurrentUserWithKeyPair,
    myUserGroups: UserGroupDownload[]
  ) {
    if (!userGroupMemberOfCollection.collectionKey) {
      return null;
    }
    try {
      const userGroup = myUserGroups.find(
        ({ groupId }) => groupId === userGroupMemberOfCollection.uuid
      );
      const userMemberOfUserGroup = userGroup?.users.find(
        ({ userId }) => userId === currentUser.login
      );
      if (!userMemberOfUserGroup?.groupKey || !userGroup) {
        return null;
      }
      const clearUserGroupPrivateKey =
        await this.sharingCrypto.decryptEncapsulatedPrivateKey(
          pemToPkcs8(currentUser.privateKey),
          userMemberOfUserGroup.groupKey,
          userGroup.privateKey
        );
      return await this.sharingCrypto.decryptResourceKey(
        clearUserGroupPrivateKey,
        base64ToArrayBuffer(userGroupMemberOfCollection.collectionKey)
      );
    } catch {
      return null;
    }
  }
}
