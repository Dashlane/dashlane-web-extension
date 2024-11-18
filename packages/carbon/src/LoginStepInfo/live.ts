import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { LoginStepInfo } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { loginStepInfoSelector } from "LoginStepInfo/Store/selectors";
export const liveLoginStepInfo$ = (): StateOperator<LoginStepInfo> =>
  pipe(map(loginStepInfoSelector), distinctUntilChanged());
