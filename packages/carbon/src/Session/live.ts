import { pipe, Subject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import {
  PremiumStatus,
  SessionInfo,
  SubscriptionInformation,
  SyncState,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import {
  didOpenSelector,
  premiumStatusSelector,
  sessionInfoSelector,
  subscriptionInformationSelector,
  syncIsInProgressSelector,
  syncSelector,
  webOnboardingModeSelector,
} from "Session/selectors";
import { StateOperator } from "Shared/Live";
export const didOpen$ = (): StateOperator<boolean> =>
  pipe(map(didOpenSelector), distinctUntilChanged());
export const syncInfo$ = (): StateOperator<SyncState> =>
  pipe(map(syncSelector), distinctUntilChanged());
export const syncInProgress$ = (): StateOperator<boolean> =>
  pipe(map(syncIsInProgressSelector), distinctUntilChanged());
export const premiumStatus$ = (): StateOperator<PremiumStatus> =>
  pipe(map(premiumStatusSelector), distinctUntilChanged());
export const subscriptionInformation$ =
  (): StateOperator<SubscriptionInformation> =>
    pipe(map(subscriptionInformationSelector), distinctUntilChanged());
export const webOnboardingMode$ = (): StateOperator<WebOnboardingModeEvent> =>
  pipe(map(webOnboardingModeSelector), distinctUntilChanged());
const serviceProviderUrl$ = new Subject<string>();
export const emitServiceProviderUrl = (url: string) =>
  serviceProviderUrl$.next(url);
export const getServiceProviderUrl$ = () => serviceProviderUrl$;
export const sessionInfo$ = (): StateOperator<SessionInfo> =>
  pipe(map(sessionInfoSelector), distinctUntilChanged());
