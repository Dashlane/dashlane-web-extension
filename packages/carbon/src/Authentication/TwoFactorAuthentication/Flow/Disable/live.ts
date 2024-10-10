import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { TwoFactorAuthenticationFlowStageData } from "@dashlane/communication";
import { getTwoFactorAuthenticationDisableStageData } from "Authentication/TwoFactorAuthentication/Flow/Disable/Store/selectors";
import { StateOperator } from "Shared/Live";
export const twoFactorAuthenticationDisableFlow$ =
  (): StateOperator<TwoFactorAuthenticationFlowStageData> =>
    pipe(
      map(getTwoFactorAuthenticationDisableStageData),
      distinctUntilChanged()
    );
