import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { Notifications } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { notificationsStatusSelector } from "Session/Store/notifications/selectors";
export function notificationsStatus$(): StateOperator<Notifications> {
  const selector = notificationsStatusSelector;
  return pipe(map(selector), distinctUntilChanged());
}
