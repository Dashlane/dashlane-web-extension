import { CoreServicesReady, EventBusService, SessionClosed } from "EventBus";
import { triggerLoginStatusChanged } from "Session/SessionCommunication";
import { CoreServices } from "Services";
import { refreshPremiumStatus } from "Session/PremiumController";
import { premiumStatusSelector, userLoginSelector } from "Session/selectors";
import { ukiSelector } from "Authentication/selectors";
import {
  createTrialExpiredUserMessage,
  isTrialExpired,
} from "UserMessages//helpers";
import { getUserMessagesByTypeSelector } from "UserMessages/Store/selectors";
import { userMessagesDismissed } from "UserMessages/Store/actions";
import { UserMessageTypes } from "@dashlane/communication";
import { resetLoginStepInfo } from "LoginStepInfo/Store/actions";
import { InitMode } from "Sdk/Default/types";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  const { storeService, wsService, sessionService } = services;
  eventBus.coreServicesReady.on(async (event: CoreServicesReady) => {
    if (event.initMode === InitMode.Resume) {
      services.sessionService.tryRestoreInstance();
      if (sessionService.isSessionStarted()) {
        console.log(
          "[background/carbon] Loading non non-resumable data from storage"
        );
        const { user } = services.sessionService.getInstance();
        await user.loadNonResumableSessionData();
        console.log(
          "[background/carbon] Done loading non non-resumable data from storage"
        );
      }
    }
  });
  eventBus.carbonSessionOpened.on(() => {
    storeService.dispatch(resetLoginStepInfo());
    const state = storeService.getState();
    const premiumStatus = premiumStatusSelector(state);
    const trialExpiredUserMessage = getUserMessagesByTypeSelector(
      state,
      UserMessageTypes.TRIAL_EXPIRED
    );
    if (
      trialExpiredUserMessage.length === 1 &&
      !isTrialExpired({ premiumStatus })
    ) {
      storeService.dispatch(
        userMessagesDismissed(createTrialExpiredUserMessage())
      );
      sessionService.getInstance().user.persistLocalSettings();
    }
  });
  eventBus.sessionClosed.on((request: SessionClosed) => {
    triggerLoginStatusChanged({
      loggedIn: false,
      login: request.login,
    });
  });
  eventBus.familyMemberLeft.on(async () => {
    const login = userLoginSelector(storeService.getState());
    const uki = ukiSelector(storeService.getState());
    await refreshPremiumStatus(storeService, wsService, login, uki);
  });
}
