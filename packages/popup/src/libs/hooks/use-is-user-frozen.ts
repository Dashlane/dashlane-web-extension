import {
  DataStatus,
  useFeatureFlips,
  useModuleQuery,
} from "@dashlane/framework-react";
import { useDiscontinuedStatus } from "../api";
import {
  PASSWORD_LIMIT_FEATURE_FLIPS,
  passwordLimitApi,
} from "@dashlane/vault-contracts";
export type UseIsUserFrozenOutput =
  | {
      isLoading: true;
      isUserFrozen: null;
      isCopyDisabled: undefined;
    }
  | {
      isLoading: false;
      isUserFrozen: boolean;
      isCopyDisabled: boolean;
    };
export const useIsUserFrozen = (): UseIsUserFrozenOutput => {
  const discontinuedStatus = useDiscontinuedStatus();
  const retrievedFFs = useFeatureFlips();
  const passwordLimitStatus = useModuleQuery(
    passwordLimitApi,
    "isFreeUserFrozen"
  );
  if (
    discontinuedStatus.isLoading ||
    retrievedFFs.status !== DataStatus.Success ||
    passwordLimitStatus.status !== DataStatus.Success
  ) {
    return { isLoading: true, isUserFrozen: null, isCopyDisabled: undefined };
  }
  const hasFreeFrozenStateFF =
    !!retrievedFFs.data[PASSWORD_LIMIT_FEATURE_FLIPS.B2CFreeUserFrozenState];
  const hasPreventCopyFF =
    !!retrievedFFs.data[PASSWORD_LIMIT_FEATURE_FLIPS.B2CPreventCopy];
  const isB2BDiscontinuedAdmin =
    !!discontinuedStatus.isTeamSoftDiscontinued && !!discontinuedStatus.isTrial;
  const isB2CFrozenUser = hasFreeFrozenStateFF && passwordLimitStatus.data;
  return {
    isLoading: false,
    isUserFrozen: isB2BDiscontinuedAdmin || isB2CFrozenUser,
    isCopyDisabled: hasPreventCopyFF && isB2CFrozenUser,
  };
};
