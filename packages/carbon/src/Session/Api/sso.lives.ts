import { SSOMigrationInfo } from "@dashlane/communication";
import {
  isSSOUserSelector,
  ssoMigrationInfoSelector,
} from "Session/sso.selectors";
import { StateOperator } from "Shared/Live";
import { map, pipe } from "rxjs";
export const isSSOUser$ = (): StateOperator<boolean> =>
  pipe(map(isSSOUserSelector));
export const ssoMigrationInfo$ = (): StateOperator<SSOMigrationInfo> =>
  pipe(map(ssoMigrationInfoSelector));
