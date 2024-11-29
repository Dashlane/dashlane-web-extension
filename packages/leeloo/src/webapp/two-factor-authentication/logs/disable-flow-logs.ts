import { logPageView } from "../../../libs/logs/logEvent";
import {
  BrowseComponent,
  FlowStep,
  FlowType,
  PageView,
  TwoFactorAuthenticationError,
} from "@dashlane/hermes";
import { logTwoFactorAuthenticationEvent } from "./utils";
export const logTwoFactorAuthenticationDisableStartEvent =
  logTwoFactorAuthenticationEvent.bind(
    null,
    FlowStep.Start,
    FlowType.Deactivation
  );
export const logTwoFactorAuthenticationDisableErrorEvent = (
  errorName: TwoFactorAuthenticationError
) =>
  logTwoFactorAuthenticationEvent(
    FlowStep.Error,
    FlowType.Deactivation,
    errorName
  );
export const logTwoFactorAuthenticationDisableCompleteEvent =
  logTwoFactorAuthenticationEvent.bind(
    null,
    FlowStep.Complete,
    FlowType.Deactivation
  );
export const logTwoFactorAuthenticationDisableCancelEvent =
  logTwoFactorAuthenticationEvent.bind(
    null,
    FlowStep.Cancel,
    FlowType.Deactivation
  );
export const logTwoFactorAuthenticationDisableConfirmationPageView =
  logPageView.bind(
    null,
    PageView.SettingsSecurityTwoFactorAuthenticationDisable,
    BrowseComponent.MainApp
  );
export const logTwoFactorAuthenticationDisable6DigitsCodePageView =
  logPageView.bind(
    null,
    PageView.SettingsSecurityTwoFactorAuthenticationDisable6DigitsCode,
    BrowseComponent.MainApp
  );
export const logTwoFactorAuthenticationDisableBackupCodePageView =
  logPageView.bind(
    null,
    PageView.SettingsSecurityTwoFactorAuthenticationDisableBackupCode,
    BrowseComponent.MainApp
  );
