import { useCredentialLimitStatus } from "../api";
export function useShowPasswordLimit(): {
  shouldDisplayPasswordLimitAlmostReachedBanner: boolean;
  shouldDisplayPasswordLimitBanner: boolean;
  passwordsLeft?: number;
} | null {
  const credentialLimitStatus = useCredentialLimitStatus();
  if (credentialLimitStatus.isLoading) {
    return null;
  }
  return {
    shouldDisplayPasswordLimitAlmostReachedBanner:
      credentialLimitStatus.shouldShowNearLimitContent,
    shouldDisplayPasswordLimitBanner:
      credentialLimitStatus.shouldShowAtOrOverLimitContent,
    passwordsLeft: credentialLimitStatus.passwordsLeft,
  };
}
