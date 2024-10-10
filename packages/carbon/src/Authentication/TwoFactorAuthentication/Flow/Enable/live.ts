import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { TwoFactorAuthenticationEnableFlowStageData } from "@dashlane/communication";
import { getTwoFactorAuthenticationEnableStageData } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/selectors";
import { StateOperator } from "Shared/Live";
export const twoFactorAuthenticationEnableFlow$ =
  (): StateOperator<TwoFactorAuthenticationEnableFlowStageData> =>
    pipe(
      map(getTwoFactorAuthenticationEnableStageData),
      distinctUntilChanged()
    );
