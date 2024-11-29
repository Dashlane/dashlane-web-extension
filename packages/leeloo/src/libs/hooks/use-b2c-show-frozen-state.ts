import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  PASSWORD_LIMIT_FEATURE_FLIPS,
  passwordLimitApi,
} from "@dashlane/vault-contracts";
export type IsFreeB2CUser =
  | {
      isLoading: true;
      showB2CFrozenBanner: null;
    }
  | {
      isLoading: false;
      showB2CFrozenBanner: boolean;
    };
export const useShowB2CFrozenState = (): IsFreeB2CUser => {
  const isUserFrozen = useModuleQuery(passwordLimitApi, "isFreeUserFrozen");
  const hasFrozenStateFF = useFeatureFlip(
    PASSWORD_LIMIT_FEATURE_FLIPS.B2CFreeUserFrozenState
  );
  if (isUserFrozen.status === DataStatus.Loading) {
    return { isLoading: true, showB2CFrozenBanner: null };
  }
  if (
    isUserFrozen.status === DataStatus.Error ||
    !isUserFrozen.data ||
    !hasFrozenStateFF
  ) {
    return { isLoading: false, showB2CFrozenBanner: false };
  }
  return { isLoading: false, showB2CFrozenBanner: true };
};
