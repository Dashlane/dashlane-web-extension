import { AutofillConfirmationPasswordLessWebcardData } from "./autofill-confirmation-password-less";
import {
  AccountFrozenDropdownWebcardData,
  AutofillDropdownWebcardData,
  SelfCorrectingDropdownWebcardData,
} from "./autofill-dropdown-webcard";
import { AutologinSelectionWebcardData } from "./autologin-selection-webcard";
import { B2CFrozenDialogWebcardData } from "./b2c-frozen-dialog-webcard";
import { DataCaptureWebcardData } from "./data-capture-webcard";
import { FeedbackNotificationWebcardData } from "./feedback-notification-webcard";
import { FollowUpNotificationWebcardData } from "./follow-up-notification-webcard";
import { LinkedWebsiteUpdateConfirmationData } from "./linked-website-update-confirmation-webcard";
import { MasterPasswordWebcardData } from "./master-password-webcard";
import { OnboardingNotificationWebcardData } from "./onboarding-notification-webcard";
import { PhishingPreventionWebcardData } from "./phishing-prevention-webcard";
import { SavePasswordWebcardData } from "./save-password-webcard";
import { UserVerificationWebcardData } from "./user-verification-webcard";
import { WarnGeneratedPasswordWebcardData } from "./warn-generated-password-webcard";
import { WebauthnCreateConfirmationWebcardData } from "./webauthn-create-confirmation-webcard";
import { WebauthnGetConfirmationWebcardData } from "./webauthn-get-confirmation-webcard";
import { WebauthnPasskeySelectionWebcardData } from "./webauthn-passkey-selection-webcard";
export type WebcardData =
  | AccountFrozenDropdownWebcardData
  | AutofillConfirmationPasswordLessWebcardData
  | AutofillDropdownWebcardData
  | AutologinSelectionWebcardData
  | B2CFrozenDialogWebcardData
  | DataCaptureWebcardData
  | FeedbackNotificationWebcardData
  | FollowUpNotificationWebcardData
  | LinkedWebsiteUpdateConfirmationData
  | MasterPasswordWebcardData
  | OnboardingNotificationWebcardData
  | PhishingPreventionWebcardData
  | SavePasswordWebcardData
  | SelfCorrectingDropdownWebcardData
  | UserVerificationWebcardData
  | WarnGeneratedPasswordWebcardData
  | WebauthnCreateConfirmationWebcardData
  | WebauthnGetConfirmationWebcardData
  | WebauthnPasskeySelectionWebcardData;
