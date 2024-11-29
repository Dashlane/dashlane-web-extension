import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  PASSWORD_LIMIT_FEATURE_FLIPS,
  passwordLimitApi,
} from "@dashlane/vault-contracts";
export const useIsB2CUserFrozen = (): boolean | null => {
  const isUserFrozen = useModuleQuery(passwordLimitApi, "isFreeUserFrozen");
  const hasFrozenStateFF = useFeatureFlip(
    PASSWORD_LIMIT_FEATURE_FLIPS.B2CFreeUserFrozenState
  );
  if (isUserFrozen.status === DataStatus.Loading) {
    return null;
  }
  if (
    isUserFrozen.status === DataStatus.Error ||
    !isUserFrozen.data ||
    !hasFrozenStateFF
  ) {
    return false;
  }
  return true;
};
export const usePreventCopyForFrozenUser = (): boolean | null => {
  const isUserFrozen = useIsB2CUserFrozen();
  const hasFrozenStateFF = useFeatureFlip(
    PASSWORD_LIMIT_FEATURE_FLIPS.B2CPreventCopy
  );
  if (
    isUserFrozen === null ||
    hasFrozenStateFF === undefined ||
    hasFrozenStateFF === null
  ) {
    return null;
  }
  return isUserFrozen && hasFrozenStateFF;
};
