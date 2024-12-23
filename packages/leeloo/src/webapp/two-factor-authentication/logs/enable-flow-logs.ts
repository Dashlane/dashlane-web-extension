import { logPageView } from "../../../libs/logs/logEvent";
import {
  BrowseComponent,
  FlowStep,
  FlowType,
  PageView,
  TwoFactorAuthenticationError,
} from "@dashlane/hermes";
import { logTwoFactorAuthenticationEvent } from "./utils";
export const logTwoFactorAuthenticationEnableStartEvent =
  logTwoFactorAuthenticationEvent.bind(
    null,
    FlowStep.Start,
    FlowType.Activation
  );
export const logTwoFactorAuthenticationEnableErrorEvent = (
  errorName: TwoFactorAuthenticationError
) =>
  logTwoFactorAuthenticationEvent(
    FlowStep.Error,
    FlowType.Activation,
    errorName
  );
export const logTwoFactorAuthenticationEnableCompleteEvent =
  logTwoFactorAuthenticationEvent.bind(
    null,
    FlowStep.Complete,
    FlowType.Activation
  );
export const logTwoFactorAuthenticationEnableCancelEvent =
  logTwoFactorAuthenticationEvent.bind(
    null,
    FlowStep.Cancel,
    FlowType.Activation
  );
export const logTwoFactorAuthenticationEnableSecurityLevelPageView =
  logPageView.bind(
    null,
    PageView.SettingsSecurityTwoFactorAuthenticationEnableSecurityLevel,
    BrowseComponent.MainApp
  );
export const logTwoFactorAuthenticationEnableBackupPhoneNumberPageView =
  logPageView.bind(
    null,
    PageView.SettingsSecurityTwoFactorAuthenticationEnableBackupPhoneNumber,
    BrowseComponent.MainApp
  );
export const logTwoFactorAuthenticationEnableQRCodelPageView = logPageView.bind(
  null,
  PageView.SettingsSecurityTwoFactorAuthenticationEnableQrCode,
  BrowseComponent.MainApp
);
export const logTwoFactorAuthenticationEnable6DigitsCodePageView =
  logPageView.bind(
    null,
    PageView.SettingsSecurityTwoFactorAuthenticationEnable6DigitsCode,
    BrowseComponent.MainApp
  );
export const logTwoFactorAuthenticationEnableBackupCodesPageView =
  logPageView.bind(
    null,
    PageView.SettingsSecurityTwoFactorAuthenticationEnableBackupCodes,
    BrowseComponent.MainApp
  );
