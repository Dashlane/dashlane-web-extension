import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { StateOperator } from "Shared/Live";
import {
  protectPasswordsSettingSelector,
  richIconsSettingSelector,
} from "Session/selectors";
export const protectPasswordsSetting$ = (): StateOperator<boolean> =>
  pipe(map(protectPasswordsSettingSelector), distinctUntilChanged());
export const richIconsSetting$ = (): StateOperator<boolean> =>
  pipe(map(richIconsSettingSelector), distinctUntilChanged());
