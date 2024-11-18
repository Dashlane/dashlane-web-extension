import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  PASSWORD_LIMIT_FEATURE_FLIPS,
  passwordLimitApi,
} from "@dashlane/vault-contracts";
const PASSWORD_NEAR_LIMIT_THRESHOLD = 5;
export type UseCredentialLimitResult =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      shouldShowNearLimitContent: boolean;
      shouldShowAtOrOverLimitContent: boolean;
      passwordsLeft?: number;
    };
export function useCredentialLimitStatus(): UseCredentialLimitResult {
  const hasFreeFrozenStateFF = useFeatureFlip(
    PASSWORD_LIMIT_FEATURE_FLIPS.B2CFreeUserFrozenState
  );
  const credentialLimitStatus = useModuleQuery(
    passwordLimitApi,
    "getPasswordLimitStatus"
  );
  if (
    credentialLimitStatus.status !== DataStatus.Success ||
    hasFreeFrozenStateFF === undefined ||
    hasFreeFrozenStateFF === null
  ) {
    return { isLoading: true };
  }
  const { hasLimit } = credentialLimitStatus.data;
  if (!hasLimit) {
    return {
      isLoading: false,
      shouldShowAtOrOverLimitContent: false,
      shouldShowNearLimitContent: false,
    };
  }
  const shouldShowNearLimitContent =
    credentialLimitStatus.data.passwordsLeft > 0 &&
    credentialLimitStatus.data.passwordsLeft <= PASSWORD_NEAR_LIMIT_THRESHOLD;
  const getShouldShowAtOrOverLimitContent = () => {
    if (hasFreeFrozenStateFF) {
      return hasLimit && credentialLimitStatus.data.passwordsLeft === 0;
    }
    return hasLimit && credentialLimitStatus.data.passwordsLeft <= 0;
  };
  return {
    isLoading: false,
    shouldShowNearLimitContent,
    shouldShowAtOrOverLimitContent: getShouldShowAtOrOverLimitContent(),
    passwordsLeft: credentialLimitStatus.data.passwordsLeft,
  };
}
