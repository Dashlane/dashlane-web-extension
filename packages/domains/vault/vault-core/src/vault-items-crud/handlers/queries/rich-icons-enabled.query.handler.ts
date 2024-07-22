import { Observable } from "rxjs";
import { CarbonLegacyClient, PremiumStatus } from "@dashlane/communication";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { mapSuccessObservable, Result } from "@dashlane/framework-types";
import { RichIconsEnabledQuery } from "@dashlane/vault-contracts";
import { isSpaceArray } from "../../../vault-repository/carbon-guards";
export const mapToCurrentSpaceInfo = (status: unknown) => {
  if (!status) {
    return {
      richIconsEnabled: true,
    };
  }
  const premiumStatus = status as Partial<PremiumStatus>;
  if (!isSpaceArray(premiumStatus.spaces)) {
    return {
      richIconsEnabled: true,
    };
  }
  const currentSpace = premiumStatus.spaces.find(
    (space) => space.status === "accepted"
  );
  return {
    richIconsEnabled: currentSpace?.info.richIconsEnabled ?? true,
  };
};
interface CurrentSpaceVaultInfo {
  richIconsEnabled: boolean;
}
@QueryHandler(RichIconsEnabledQuery)
export class RichIconsEnabledQueryHandler
  implements IQueryHandler<RichIconsEnabledQuery>
{
  constructor(private carbon: CarbonLegacyClient) {}
  public get(): Observable<Result<CurrentSpaceVaultInfo>> {
    const { getNodePremiumStatus } = this.carbon.queries;
    return getNodePremiumStatus().pipe(
      mapSuccessObservable(mapToCurrentSpaceInfo)
    );
  }
  execute(): QueryHandlerResponseOf<RichIconsEnabledQuery> {
    return this.get().pipe(
      mapSuccessObservable((space) => {
        return space.richIconsEnabled;
      })
    );
  }
}
