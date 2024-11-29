import { logEvent } from "../../libs/logs/logEvent";
import {
  Button,
  CallToAction,
  ClickOrigin,
  UserCallToActionEvent,
  UserClickEvent,
} from "@dashlane/hermes";
const logOpenAdminConsoleModalInstall = () => {
  void logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
      chosenAction: CallToAction.InstallExtension,
      hasChosenNoAction: false,
    })
  );
};
const logOpenAdminConsoleModalSkip = () => {
  void logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
      chosenAction: CallToAction.Skip,
      hasChosenNoAction: false,
    })
  );
};
const logOpenAdminConsoleModalClose = () => {
  void logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
      hasChosenNoAction: true,
    })
  );
};
const logOpenVaultFromAdminConsoleClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.OpenVault,
      clickOrigin: ClickOrigin.LeftSideNavigationMenu,
    })
  );
};
const logOpenAdminConsoleFromVaultOnClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.OpenAdminConsole,
      clickOrigin: ClickOrigin.LeftSideNavigationMenu,
    })
  );
};
export {
  logOpenAdminConsoleFromVaultOnClick,
  logOpenAdminConsoleModalInstall,
  logOpenAdminConsoleModalSkip,
  logOpenAdminConsoleModalClose,
  logOpenVaultFromAdminConsoleClick,
};
