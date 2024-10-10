import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { twoFactorAuthenticationInfoSelector } from "Authentication/TwoFactorAuthentication/selectors";
import { StateOperator } from "Shared/Live";
import { TwoFactorAuthenticationInfo } from "@dashlane/communication";
export const twoFactorAuthenticationInfo$ =
  (): StateOperator<TwoFactorAuthenticationInfo> =>
    pipe(map(twoFactorAuthenticationInfoSelector), distinctUntilChanged());
