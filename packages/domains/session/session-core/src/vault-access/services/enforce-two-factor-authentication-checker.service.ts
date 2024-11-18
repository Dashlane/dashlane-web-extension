import { distinctUntilChanged, filter, map, Observable, startWith } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { NotAllowedReason } from "@dashlane/session-contracts";
import {
  CarbonLegacyClient,
  TwoFactorAuthenticationInfoRequestStatus,
} from "@dashlane/communication";
import { isSuccess } from "@dashlane/framework-types";
import { PostLoginRequirementsChecker } from "./post-login-requirements.types";
import { shallowEqualArrays } from "shallow-equal";
@Injectable()
export class EnforceTwoFactorAuthenticationChecker
  implements PostLoginRequirementsChecker
{
  public readonly name = "enforce-two-factor-authentication";
  constructor(private readonly carbon: CarbonLegacyClient) {}
  check(): Observable<NotAllowedReason[]> {
    const { liveTwoFactorAuthenticationInfo } = this.carbon.queries;
    const twoFactorAuthenticationInfo$ =
      liveTwoFactorAuthenticationInfo(undefined);
    return twoFactorAuthenticationInfo$.pipe(
      filter((twoFactorAuthenticationInfo) => {
        if (!isSuccess(twoFactorAuthenticationInfo)) {
          return true;
        }
        return (
          twoFactorAuthenticationInfo.data.status ===
            TwoFactorAuthenticationInfoRequestStatus.READY ||
          twoFactorAuthenticationInfo.data.status ===
            TwoFactorAuthenticationInfoRequestStatus.ERROR
        );
      }),
      map((twoFactorAuthenticationInfo) => {
        if (!isSuccess(twoFactorAuthenticationInfo)) {
          throw new Error("twoFactorAuthenticationInfo query has failed");
        }
        const shouldEnforceTwoFactorAuthentication =
          twoFactorAuthenticationInfo.data.status ===
            TwoFactorAuthenticationInfoRequestStatus.READY &&
          twoFactorAuthenticationInfo.data.shouldEnforceTwoFactorAuthentication;
        if (shouldEnforceTwoFactorAuthentication) {
          return [NotAllowedReason.Requires2FAEnforcement];
        }
        return [];
      }),
      startWith([]),
      distinctUntilChanged((a, b) => shallowEqualArrays(a, b))
    );
  }
}
