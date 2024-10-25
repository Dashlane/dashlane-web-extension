import {
  CredentialSearchOrder,
  NodePremiumStatus,
  PremiumStatus,
  SubscriptionInformation,
  UserMessage,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import { LoginStepInfoState } from "LoginStepInfo/types";
export interface LocalSettings {
  uki: string | null;
  lastSync: number;
  premiumStatus: PremiumStatus | null;
  nodePremiumStatus: NodePremiumStatus | null;
  subscriptionInformation: SubscriptionInformation | null;
  deviceName: string | null;
  webOnboardingMode: WebOnboardingModeEvent;
  premiumChurningDismissDate: number | null;
  credentialSearchOrder: CredentialSearchOrder;
  userMessages: UserMessage[];
  loginStepInfo: LoginStepInfoState;
}
