import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { StateOperator } from "Shared/Live";
import {
  getUserMessagesSelector,
  getVisibleUserMessagesSelector,
} from "UserMessages/Store/selectors";
import { UserMessage } from "@dashlane/communication";
export const liveVisibleUserMessages$ = (): StateOperator<UserMessage[]> =>
  pipe(map(getVisibleUserMessagesSelector), distinctUntilChanged());
export const liveUserMessages$ = (): StateOperator<UserMessage[]> =>
  pipe(map(getUserMessagesSelector), distinctUntilChanged());
