import { distinctUntilChanged, Observable } from "rxjs";
import { equals as isDeepEqual } from "ramda";
import { CarbonLegacyClient, PremiumStatus } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { mapSuccessObservable, Result } from "@dashlane/framework-types";
import { isSpaceArray } from "../utils/space.guards";
export const mapToCurrentSpaceSharingInfo = (status: unknown) => {
  if (!status) {
    return {
      teamId: "",
      isSharingEnabled: false,
      isCollectionsSharingEnabled: false,
      areSensitiveLogsEnabled: false,
    };
  }
  const premiumStatus = status as Partial<PremiumStatus>;
  if (!isSpaceArray(premiumStatus.spaces)) {
    return {
      teamId: "",
      isSharingEnabled: true,
      isCollectionsSharingEnabled: false,
      areSensitiveLogsEnabled: false,
    };
  }
  const currentSpace = premiumStatus.spaces.find(
    (space) => space.status === "accepted"
  );
  const isCollectionsSharingEnabled = Boolean(
    premiumStatus.capabilities?.collectionSharing.enabled
  );
  const sharedItemsLimit = premiumStatus.capabilities?.sharingLimit.info?.limit;
  return {
    teamId: currentSpace?.teamId ?? "",
    isSharingEnabled: Boolean(
      currentSpace && !currentSpace.info.sharingDisabled
    ),
    areSensitiveLogsEnabled: Boolean(
      currentSpace?.info.collectSensitiveDataAuditLogsEnabled
    ),
    isCollectionsSharingEnabled,
    sharedItemsLimit,
  };
};
export interface CurrentSpaceSharingInfo {
  teamId: string;
  isSharingEnabled: boolean;
  isCollectionsSharingEnabled: boolean;
  sharedItemsLimit?: number;
  areSensitiveLogsEnabled: boolean;
}
@Injectable()
export class CurrentSpaceGetterService {
  public constructor(private carbon: CarbonLegacyClient) {}
  public get(): Observable<Result<CurrentSpaceSharingInfo>> {
    const { getNodePremiumStatus } = this.carbon.queries;
    return getNodePremiumStatus().pipe(
      mapSuccessObservable(mapToCurrentSpaceSharingInfo),
      distinctUntilChanged((a, b) => isDeepEqual(a, b))
    );
  }
}
