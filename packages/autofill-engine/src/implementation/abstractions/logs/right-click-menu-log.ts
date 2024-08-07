import {
  AnonymousRightClickMenuActionEvent,
  DomainType,
  hashDomain,
  PageView,
  RightClickMenuFlowStep,
  UserRightClickMenuActionEvent,
} from "@dashlane/hermes";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillEngineActionsWithOptions } from "../messaging/action-serializer";
export const logRightClickMenuHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  partialLogInfo: {
    isFieldDetectedByAnalysisEngine: boolean;
    domain: string;
  }
) => {
  if (!sender.tab?.url || !sender.url) {
    return;
  }
  const { isRightClickMenuLive } = await context.state.global.get();
  if (!isRightClickMenuLive) {
    return;
  }
  const { isFieldDetectedByAnalysisEngine, domain } = partialLogInfo;
  const rightClickMenuActionEventProperties = {
    isFieldDetectedByAnalysisEngine,
    rightClickMenuFlowStep: RightClickMenuFlowStep.DisplayMenu,
  };
  const userLog = new UserRightClickMenuActionEvent(
    rightClickMenuActionEventProperties
  );
  const anonymousLog = new AnonymousRightClickMenuActionEvent({
    ...rightClickMenuActionEventProperties,
    domain: {
      type: DomainType.Web,
      id: await hashDomain(domain),
    },
    isNativeApp: false,
  });
  await context.connectors.carbon.logEvent({ event: userLog });
  await context.connectors.carbon.logEvent({ event: anonymousLog });
  await context.connectors.carbon.logPageView({
    pageView: PageView.RightClickMenu,
    browseComponent: undefined,
  });
};
