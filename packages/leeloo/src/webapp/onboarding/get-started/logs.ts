import { logEvent } from "../../../libs/logs/logEvent";
import {
  Button,
  CallToAction,
  ClickOrigin,
  UserCallToActionEvent,
  UserClickEvent,
} from "@dashlane/hermes";
const logTaskAddPasswordClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.AddNow,
      clickOrigin: ClickOrigin.AdminOnboardingChecklist,
    })
  );
};
const logTaskTryAutofillClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.TryNow,
      clickOrigin: ClickOrigin.AdminOnboardingChecklist,
    })
  );
};
const logTaskOpenAdminConsoleClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.Open,
      clickOrigin: ClickOrigin.AdminOnboardingChecklist,
    })
  );
};
const logTaskInstallExtensionClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.DownloadExtension,
      clickOrigin: ClickOrigin.AdminOnboardingChecklist,
    })
  );
};
const logLinkSharingCenterClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.OpenSharingCenter,
      clickOrigin: ClickOrigin.AdminOnboardingChecklist,
    })
  );
};
const logTaskInviteMembersClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.InviteNow,
      clickOrigin: ClickOrigin.AdminOnboardingChecklist,
    })
  );
};
const logOpenModal = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.Close,
      clickOrigin: ClickOrigin.AdminOnboardingChecklist,
    })
  );
};
const logModalDismissOnboarding = () => {
  void logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Cancel, CallToAction.Close],
      chosenAction: CallToAction.Close,
      hasChosenNoAction: false,
    })
  );
};
const logModalCancel = () => {
  void logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Cancel, CallToAction.Close],
      chosenAction: CallToAction.Cancel,
      hasChosenNoAction: false,
    })
  );
};
const logModalClose = () => {
  void logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Cancel, CallToAction.Close],
      hasChosenNoAction: true,
    })
  );
};
const logAdminProfilingResume = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.Resume,
      clickOrigin: ClickOrigin.AdminProfiling,
    })
  );
};
const logAdminProfilingStart = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.Start,
      clickOrigin: ClickOrigin.AdminProfiling,
    })
  );
};
export {
  logOpenModal,
  logModalDismissOnboarding,
  logModalCancel,
  logModalClose,
  logTaskInviteMembersClick,
  logLinkSharingCenterClick,
  logTaskAddPasswordClick,
  logTaskTryAutofillClick,
  logTaskOpenAdminConsoleClick,
  logTaskInstallExtensionClick,
  logAdminProfilingStart,
  logAdminProfilingResume,
};
