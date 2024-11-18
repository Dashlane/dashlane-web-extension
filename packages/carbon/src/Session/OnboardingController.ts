import { WebOnboardingModeEvent } from "@dashlane/communication";
import { StoreService } from "Store/index";
import { SessionService } from "User/Services/types";
import * as settingsActions from "Session/Store/localSettings/actions";
import * as SessionCommunication from "Session/SessionCommunication";
export function updateWebOnboardingMode(
  storeService: StoreService,
  sessionService: SessionService,
  webOnboardingMode: WebOnboardingModeEvent
) {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session set");
  }
  storeService.dispatch(
    settingsActions.webOnboardingModeUpdated(webOnboardingMode)
  );
  const treatedWebOnboardingMode =
    storeService.getLocalSettings().webOnboardingMode;
  SessionCommunication.sendWebOnboardingModeUpdate(treatedWebOnboardingMode);
  sessionService.getInstance().user.persistLocalSettings();
}
