import { Injectable } from "@dashlane/framework-application";
import { safeCast } from "@dashlane/framework-types";
import {
  PendingInvite,
  RevisionSummary,
  SharedCollectionAccess,
  Status,
} from "@dashlane/sharing-contracts";
import { CollectionDownload } from "@dashlane/server-sdk/v1";
import { SharingCryptographyService, SharingDecryptionService } from "../../..";
import { SharedCollectionsNewRepository } from "../../../sharing-collections/handlers/common/shared-collections-new.repository";
import { determineUpdatesFromSummary } from "./determine-updates-from-summary";
import { SharedCollectionState } from "../../../sharing-collections/data-access/shared-collections.state";
import { CurrentUserWithKeyPair } from "../../../sharing-carbon-helpers";
import { toSharedCollection } from "../../../utils/mappers/collection-download-mapper";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
import { PendingInvitesService } from "../../../sharing-invites/services/pending-invites.service";
import { toSharedCollectionAccess } from "../../../sharing-collections/data-access/shared-collections-repository-legacy.adapter";
import { SharedCollectionAccessLinkTypes } from "../../../utils/mappers/collection-access-types";
@Injectable()
export class SharingSyncCollectionsService {
  public constructor(
    private collectionsRepo: SharedCollectionsNewRepository,
    private userGroupsRepo: SharingUserGroupsRepository,
    private sharingCrypto: SharingCryptographyService,
    private sharingDecryption: SharingDecryptionService,
    private pendingInvitesService: PendingInvitesService
  ) {}
  public async getCollectionsChangesFromSummary(
    collectionsSummary: RevisionSummary[]
  ) {
    const currentCollections = await this.collectionsRepo.getCollections();
    const {
      newIds: newCollectionIds,
      updatedIds: updatedCollectionIds,
      unchanged: unchangedCollections,
    } = determineUpdatesFromSummary(collectionsSummary, currentCollections);
    return {
      newCollectionIds,
      updatedCollectionIds,
      unchangedCollections,
      isCollectionsSyncNeeded:
        updatedCollectionIds.length ||
        Object.keys(currentCollections).length !== collectionsSummary.length,
    };
  }
  public async syncCollections(
    updatedCollectionDownloads: CollectionDownload[],
    unchangedCollections: SharedCollectionState[],
    currentUser: CurrentUserWithKeyPair
  ) {
    const myUserGroups = Object.values(
      await this.userGroupsRepo.getUserGroups()
    );
    const {
      validatedCollections,
      pendingInvites,
      validatedSharedCollectionAccess,
    } = await updatedCollectionDownloads.reduce(
      async (result, collectionDownload) => {
        const collection = toSharedCollection(
          collectionDownload,
          myUserGroups,
          currentUser.login
        );
        const pendingDirectAccess = collectionDownload.users?.find(
          (user) =>
            user.login === currentUser.login && user.status === Status.Pending
        );
        const isValid =
          pendingDirectAccess ||
          (await this.isCollectionValid(collection, currentUser));
        const currentResult = await result;
        if (isValid) {
          currentResult.validatedCollections.push(collection);
          currentResult.validatedSharedCollectionAccess[collection.id] =
            toSharedCollectionAccess(collectionDownload);
        }
        if (pendingDirectAccess) {
          const { referrer, permission } = pendingDirectAccess;
          currentResult.pendingInvites.push({
            referrer,
            permission,
            id: collection.id,
            name: collection.name,
          });
        }
        return result;
      },
      Promise.resolve({
        validatedCollections: safeCast<SharedCollectionState[]>([]),
        pendingInvites: safeCast<PendingInvite[]>([]),
        validatedSharedCollectionAccess: safeCast<
          Record<string, SharedCollectionAccess>
        >({}),
      })
    );
    this.collectionsRepo.setCollections(
      unchangedCollections.concat(validatedCollections),
      validatedSharedCollectionAccess
    );
    const unchangedCollectionIds = unchangedCollections.map(
      (collection) => collection.id
    );
    const existingPendingInvites =
      await this.pendingInvitesService.getCollectionsInvites();
    const newPendingList = existingPendingInvites
      .filter((invite) => unchangedCollectionIds.includes(invite.id))
      .concat(pendingInvites);
    this.pendingInvitesService.setCollectionInvites(newPendingList);
  }
  private async isCollectionValid(
    collection: SharedCollectionState,
    currentUser: CurrentUserWithKeyPair
  ) {
    const { publicKey } = currentUser;
    if (!collection.accessLink?.acceptSignature) {
      return false;
    }
    const { acceptSignature } = collection.accessLink;
    const clearCollectionKey =
      await this.sharingDecryption.decryptSharedCollectionKey(
        collection,
        currentUser
      );
    if (!clearCollectionKey) {
      return false;
    }
    return this.sharingCrypto.verifyAcceptSignature(
      collection.accessLink.accessType ===
        SharedCollectionAccessLinkTypes.UserGroup
        ? collection.accessLink.groupPublicKey ?? publicKey
        : publicKey,
      acceptSignature,
      collection.id,
      clearCollectionKey
    );
  }
}
