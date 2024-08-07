import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export interface OnboardingNotificationWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.OnboardingNotification;
  readonly configuration: OnboardingNotificationConfiguration;
}
export const isOnboardingNotificationWebcard = (
  obj: WebcardDataBase
): obj is OnboardingNotificationWebcardData => {
  return obj.webcardType === WebcardType.OnboardingNotification;
};
export enum OnboardingNotificationConfiguration {
  AfterLogin = "webOnboardingAfterLogin",
  AfterSave = "webOnboardingAfterSave",
  AfterCancel = "webOnboardingAfterCancel",
}
