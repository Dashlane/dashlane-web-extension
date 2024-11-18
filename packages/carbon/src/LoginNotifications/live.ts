import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { LoginNotification } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { loginNotificationListSelector } from "LoginNotifications/selectors";
export const loginNotificationList$ = (): StateOperator<LoginNotification[]> =>
  pipe(map(loginNotificationListSelector), distinctUntilChanged());
