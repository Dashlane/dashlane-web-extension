import { Enum } from "typescript-string-enums";
export type OnboardingType =
  | "saveApp"
  | "saveWeb"
  | "loginWeb"
  | "importPasswords"
  | "addMobile"
  | "tryAutofill";
export const WebOnboardingLeelooStep = Enum(
  "SHOW_LOGIN_USING_EXTENSION_NOTIFICATION",
  "SHOW_SAVE_SITES_DIALOG",
  "SHOW_PASSWORD_SAVE_SUCCESS",
  "SHOW_WEB_SAVE_AND_AUTOLOGIN_COMPLETED",
  "SHOW_PASSWORD_IMPORT",
  "SHOW_GET_MOBILE_DIALOG"
);
export type WebOnboardingLeelooStep = Enum<typeof WebOnboardingLeelooStep>;
export const WebOnboardingPopoverStep = Enum("SHOW_LOGIN_NOTIFICATION");
export type WebOnboardingPopoverStep = Enum<typeof WebOnboardingPopoverStep>;
export type WebOnboardingFlowLoginCredentialOnWebSite = {
  domain: string;
  url: string;
} | null;
export interface WebOnboardingCompletedSteps {
  saveCredentialInApp?: boolean | undefined;
  loginCredentialOnWeb?: boolean | undefined;
  saveCredentialOnWeb?: boolean | undefined;
  importPasswordsShown?: boolean | undefined;
  onboardingHubShown?: boolean | undefined;
  addMobileOnWeb?: boolean | undefined;
  tryAutofillOnWeb?: boolean | undefined;
}
export interface WebOnboardingModeEvent {
  flowCredentialInApp?: boolean;
  flowLoginCredentialOnWeb?: boolean;
  flowLoginCredentialOnWebSite?: WebOnboardingFlowLoginCredentialOnWebSite;
  flowSaveCredentialOnWeb?: boolean;
  flowImportPasswords?: boolean;
  flowAddMobileOnWeb?: boolean;
  flowTryAutofillOnWeb?: boolean;
  leelooStep?: WebOnboardingLeelooStep | null;
  popoverStep?: WebOnboardingPopoverStep | null;
  completedSteps?: WebOnboardingCompletedSteps;
}
export interface WebOnboardingModeMaverickEvent {
  type: string;
  webOnboardingMode: WebOnboardingModeEvent;
}
