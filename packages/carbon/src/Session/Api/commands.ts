import {
  CredentialSearchOrderRequest,
  PersonalSettings,
  SubscriptionInformation,
  VerificationTokenRequest,
  VerificationTokenResponse,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type SessionCommands = {
  validateToken: Command<VerificationTokenRequest, VerificationTokenResponse>;
  validateMasterPassword: Command<string, boolean>;
  resetProtectedItemAutofillTimer: Command<void, void>;
  forceSync: Command<void, void>;
  updatePremiumChurningDismissDate: Command<void, void>;
  setCredentialSearchOrder: Command<CredentialSearchOrderRequest, void>;
  refreshSubscriptionInformation: Command<void, SubscriptionInformation>;
  updateAccountRecoveryKeyPersonalSettings: Command<
    Partial<PersonalSettings>,
    void
  >;
};
