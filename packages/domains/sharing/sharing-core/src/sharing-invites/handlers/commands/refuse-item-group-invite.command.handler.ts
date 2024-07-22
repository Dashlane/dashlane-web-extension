import { firstValueFrom, tap } from "rxjs";
import {
  CarbonLegacyClient,
  PremiumStatus,
  SharedItemContent,
} from "@dashlane/communication";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  failure,
  getSuccess,
  isFailure,
  isSuccess,
  mapFailureObservable,
  mapSuccessObservable,
  mapSuccessResultObservable,
  success,
} from "@dashlane/framework-types";
import {
  getRefuseItemGroupInviteFunctionalError,
  RefuseItemGroupInviteCommand,
  RefuseItemGroupInviteNotFoundError,
} from "@dashlane/sharing-contracts";
import { createAuditLogDetails } from "../../carbon-helpers/sharing-data";
import { getActiveSpaces } from "../../../sharing-items/helpers/get-active-spaces";
import { getEmailInfoForSharedItem } from "../../utils";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
import { SharingSyncService } from "../../../sharing-common";
import { SharedItemContentGetterService } from "../common/shared-item-content-getter.service";
@CommandHandler(RefuseItemGroupInviteCommand)
export class RefuseItemGroupInviteCommandHandler
  implements ICommandHandler<RefuseItemGroupInviteCommand>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private serverApiClient: ServerApiClient,
    private sharedItemContent: SharedItemContentGetterService,
    private itemGroupsGetter: ItemGroupsGetterService,
    private featureFlips: FeatureFlipsClient,
    private sharingSync: SharingSyncService
  ) {}
  async execute(
    command: RefuseItemGroupInviteCommand
  ): CommandHandlerResponseOf<RefuseItemGroupInviteCommand> {
    const {
      body: { itemGroupId },
    } = command;
    const itemGroupResult = await firstValueFrom(
      this.itemGroupsGetter.getForItemGroupId(itemGroupId)
    );
    if (isFailure(itemGroupResult)) {
      throw new Error(
        `Failed to retrieve item group for pending item group with`
      );
    }
    const itemGroup = getSuccess(itemGroupResult);
    if (itemGroup === undefined) {
      return failure(new RefuseItemGroupInviteNotFoundError());
    }
    const itemContent = await this.sharedItemContent.getSharedItemContent(
      itemGroupId
    );
    const auditLogDetails = await this.prepareAuditLogDetails(itemContent);
    return firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice
        .refuseItemGroup({
          groupId: itemGroup.groupId,
          revision: itemGroup.revision,
          itemsForEmailing: [getEmailInfoForSharedItem(itemContent)],
          auditLogDetails,
        })
        .pipe(
          mapFailureObservable((response) => {
            if (response.tag === "BusinessError") {
              return getRefuseItemGroupInviteFunctionalError(response.code);
            }
            throw new Error(response.message);
          }),
          mapSuccessResultObservable((response) => {
            if (
              response.data.itemGroupErrors === undefined ||
              response.data.itemGroupErrors.length === 0
            ) {
              return success(undefined);
            }
            if (response.data.itemGroupErrors.length > 0) {
              throw new Error(`Error when refusing an item group invite`);
            }
            throw new Error("Unknown server error");
          }),
          tap(async (data) => {
            if (isSuccess(data)) {
              await this.sharingSync.scheduleSync();
            }
          })
        )
    );
  }
  private async prepareAuditLogDetails(itemContent: SharedItemContent) {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    const activeSpace$ = carbonState({
      path: "userSession.localSettings.premiumStatus",
    }).pipe(
      mapSuccessObservable((state) => {
        const premiumStatus = state as Partial<PremiumStatus>;
        return getActiveSpaces(premiumStatus)[0];
      })
    );
    const { userFeatureFlips } = this.featureFlips.queries;
    const featureFlipResult = await firstValueFrom(
      userFeatureFlips().pipe(
        mapSuccessObservable(
          (ff) => ff["audit_logs_sharing"] && ff["send_activity_log"]
        )
      )
    );
    const areAuditLogsEnabled = isSuccess(featureFlipResult)
      ? featureFlipResult.data ?? false
      : false;
    if (!areAuditLogsEnabled) {
      return undefined;
    }
    const activeSpaceResult = await firstValueFrom(activeSpace$);
    if (isFailure(activeSpaceResult)) {
      return undefined;
    }
    const auditLogsEnabledForSpace =
      getSuccess(activeSpaceResult)?.info.collectSensitiveDataAuditLogsEnabled;
    return auditLogsEnabledForSpace
      ? createAuditLogDetails(auditLogsEnabledForSpace, itemContent)
      : undefined;
  }
}
