import { Injectable } from "@dashlane/framework-application";
import { Permission, SharedCollection } from "@dashlane/sharing-contracts";
import {
  SharingCryptographyService,
  SharingDecryptionService,
} from "../../../sharing-crypto/";
import {
  SharingUserGroupRecipient,
  SharingUserGroupsService,
  SharingUserRecipient,
  SharingUsersService,
} from "../../../sharing-common";
import { SharingCollectionsGateway } from "./sharing-collections.gateway";
@Injectable()
export class SharingCollectionsService {
  public constructor(
    private sharingCollectionsGateway: SharingCollectionsGateway,
    private sharingCrypto: SharingCryptographyService,
    private sharingDecryption: SharingDecryptionService,
    private sharingUserGroups: SharingUserGroupsService,
    private sharingUsers: SharingUsersService
  ) {}
  public async createCollection(
    collectionId: string,
    teamId: string,
    collectionName: string,
    defaultItemPermissions: Permission,
    userRecipients: SharingUserRecipient[],
    userGroupRecipients: SharingUserGroupRecipient[]
  ) {
    const collectionKey = await this.sharingCrypto.createResourceKey();
    const resource = { resourceKey: collectionKey, uuid: collectionId };
    const users = await this.sharingUsers.createSignedUserInvites(
      userRecipients,
      resource
    );
    const userGroups =
      userGroupRecipients.length > 0
        ? await this.sharingUserGroups.createSignedUserGroupInvites(
            userGroupRecipients,
            resource
          )
        : undefined;
    const { publicKey, privateKey } =
      await this.sharingCrypto.createRecipientKeyPair(collectionKey);
    return this.sharingCollectionsGateway.createCollection({
      collectionId,
      collectionName,
      publicKey,
      privateKey,
      users,
      userGroups,
      teamId: Number(teamId),
    });
  }
  public async renameCollection(
    collection: SharedCollection,
    updatedName: string
  ) {
    const { revision, uuid: collectionId } = collection;
    await this.sharingCollectionsGateway.renameCollection({
      collectionId,
      revision,
      updatedName,
    });
  }
  public async inviteCollectionMembers(
    collection: SharedCollection,
    userRecipients: SharingUserRecipient[],
    userGroupRecipients: SharingUserGroupRecipient[]
  ) {
    const { revision, uuid: collectionId } = collection;
    const collectionKeyClear =
      await this.sharingDecryption.decryptCollectionKey(collection);
    if (!collectionKeyClear) {
      throw new Error("Cannot decrypt collection key.");
    }
    const usersPromise = userRecipients.length
      ? this.sharingUsers.createSignedUserInvites(
          userRecipients,
          { resourceKey: collectionKeyClear, uuid: collection.uuid },
          false
        )
      : undefined;
    const userGroupsPromise = userGroupRecipients.length
      ? this.sharingUserGroups.createSignedUserGroupInvites(
          userGroupRecipients,
          { resourceKey: collectionKeyClear, uuid: collection.uuid }
        )
      : undefined;
    const [users, userGroups] = await Promise.all([
      usersPromise,
      userGroupsPromise,
    ]);
    return await this.sharingCollectionsGateway.inviteCollectionMembers({
      revision,
      collectionId,
      users,
      userGroups,
    });
  }
  public async updateCollectionMembers(
    collection: SharedCollection,
    userRecipients?: SharingUserRecipient[],
    userGroupRecipients?: SharingUserGroupRecipient[]
  ) {
    const { revision, uuid: collectionId } = collection;
    return await this.sharingCollectionsGateway.updateCollectionMembers({
      revision,
      collectionId,
      users: userRecipients,
      userGroups: userGroupRecipients,
    });
  }
}
