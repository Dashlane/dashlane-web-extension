import { WebOnboardingModeEvent } from "@dashlane/communication";
export const makeContextContent = (
  webOnboardingMode: WebOnboardingModeEvent
): string => {
  const isWebOnboardingMode = Boolean(
    webOnboardingMode.flowLoginCredentialOnWeb ||
      webOnboardingMode.flowSaveCredentialOnWeb
  );
  return isWebOnboardingMode ? "onboarding" : "";
};
