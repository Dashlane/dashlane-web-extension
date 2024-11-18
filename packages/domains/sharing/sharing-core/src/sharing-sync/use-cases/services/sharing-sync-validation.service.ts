import { Injectable } from "@dashlane/framework-application";
import { SharingCryptographyService, SharingDecryptionService } from "../../..";
import {
  SharedItem,
  SharedItemDecryptionLink,
  Status,
} from "@dashlane/sharing-contracts";
import { CurrentUserWithKeyPair } from "../../../sharing-carbon-helpers";
import { UserGroupDownload } from "@dashlane/server-sdk/v1";
import { getPublicKey } from "./sharing-sync-items-helpers";
@Injectable()
export class SharingSyncValidationService {
  public constructor(
    private sharingDecryption: SharingDecryptionService,
    private sharingCrypto: SharingCryptographyService
  ) {}
  public async isUserGroupValid(
    userGroup: UserGroupDownload,
    currentUser: CurrentUserWithKeyPair
  ) {
    const { publicKey, login } = currentUser;
    const meAsGroupMember = userGroup.users.find(
      (user) => user.userId === login
    );
    if (!meAsGroupMember?.groupKey?.length) {
      return false;
    }
    if (meAsGroupMember.status === Status.Pending) {
      return meAsGroupMember;
    }
    if (meAsGroupMember.status !== Status.Accepted) {
      return false;
    }
    if (!meAsGroupMember.acceptSignature) {
      return false;
    }
    const userGroupKey =
      await this.sharingDecryption.decryptResourceKeyViaUserMember(
        { encryptedResourceKey: meAsGroupMember.groupKey },
        currentUser
      );
    if (!userGroupKey) {
      return false;
    }
    return this.sharingCrypto.verifyAcceptSignature(
      publicKey,
      meAsGroupMember.acceptSignature,
      userGroup.groupId,
      userGroupKey
    );
  }
  public async isSharedItemValid(
    sharedItem: SharedItem,
    currentUser: CurrentUserWithKeyPair
  ) {
    return this.isSharedItemAccessValid(
      sharedItem.sharedItemId,
      sharedItem.accessLink,
      currentUser
    );
  }
  public async isSharedItemAccessValid(
    sharedItemId: string,
    accessLink: SharedItemDecryptionLink | undefined,
    currentUser: CurrentUserWithKeyPair
  ): Promise<
    | {
        isValid: false;
      }
    | {
        isValid: true;
        itemGroupKey: ArrayBuffer;
      }
  > {
    const { publicKey } = currentUser;
    if (!accessLink?.acceptSignature) {
      return { isValid: false };
    }
    const { acceptSignature } = accessLink;
    const itemGroupKey =
      await this.sharingDecryption.decryptItemGroupKeyFromAccessLink(
        accessLink,
        currentUser
      );
    if (!itemGroupKey) {
      return { isValid: false };
    }
    const isAcceptSignatureValid =
      await this.sharingCrypto.verifyAcceptSignature(
        getPublicKey(accessLink) ?? publicKey,
        acceptSignature,
        sharedItemId,
        itemGroupKey
      );
    if (!isAcceptSignatureValid) {
      return { isValid: false };
    }
    return {
      isValid: true,
      itemGroupKey,
    };
  }
}
