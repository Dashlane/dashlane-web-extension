import { Injectable } from "@dashlane/framework-application";
import {
  AnomalyCriticalityValues,
  ExceptionLoggingClient,
} from "@dashlane/framework-contracts";
import { ItemGroupDownload, UserDownload } from "@dashlane/server-sdk/v1";
import { SharedItem } from "@dashlane/sharing-contracts";
import { SharingUsersService } from "../../../sharing-common";
import { SharingCommonGateway } from "../../../sharing-common/services/sharing.gateway";
@Injectable()
export class SharingSyncResendInvitesService {
  public constructor(
    private readonly sharingUsersService: SharingUsersService,
    private readonly sharingCommonGateway: SharingCommonGateway,
    private readonly exceptionLoggingClient: ExceptionLoggingClient
  ) {}
  public async checkPublicKeysAndResendInvites(
    itemGroup: ItemGroupDownload,
    sharedItem: SharedItem,
    itemGroupKey: ArrayBuffer
  ) {
    const publicKeyUsers = (itemGroup.users || []).filter(
      (user) =>
        user.rsaStatus === "publicKey" &&
        user.proposeSignatureUsingAlias === true
    );
    const resendPublicKey = publicKeyUsers.map((user) =>
      this.resendPublicKeyInvite(user, sharedItem, itemGroupKey)
    );
    await Promise.all(resendPublicKey);
  }
  private async resendPublicKeyInvite(
    user: UserDownload,
    sharedItem: SharedItem,
    itemGroupKey: ArrayBuffer
  ): Promise<void> {
    try {
      const userInvites =
        await this.sharingUsersService.createSignedUserInvites(
          [{ login: user.userId, permission: user.permission }],
          {
            resourceKey: itemGroupKey,
            uuid: sharedItem.sharedItemId,
          },
          false
        );
      if (!userInvites.length) {
        throw new Error("Cannot create signed user invite");
      }
      await this.sharingCommonGateway.updateItemGroupMembers({
        revision: sharedItem.revision,
        groupId: sharedItem.sharedItemId,
        users: [
          {
            userId: user.userId,
            groupKey: userInvites[0].resourceKey,
            proposeSignature: userInvites[0].proposeSignature,
          },
        ],
      });
    } catch (error) {
      this.exceptionLoggingClient.commands.reportAnomaly({
        criticality: AnomalyCriticalityValues.CRITICAL,
        message: "Error when trying to resend the public key",
        moduleName: "SharingSyncModule",
        useCaseName: "sharing-sync-resend-invites.service",
        applicationComponent: "Sharing",
        anomalyType: "exception",
        origin: "uncaughtException",
      });
    }
  }
}
