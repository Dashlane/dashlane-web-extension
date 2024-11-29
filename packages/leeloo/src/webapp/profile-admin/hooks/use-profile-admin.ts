import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { profileAdminApi } from "@dashlane/onboarding-contracts";
import { useIsProfileAdminEnabled } from "./use-is-profile-admin-enabled";
export type UseProfileAdmin =
  | {
      status: DataStatus.Error;
      markProfilingFormSeen: () => void;
    }
  | {
      status: DataStatus.Loading;
      markProfilingFormSeen: () => void;
    }
  | {
      status: DataStatus.Success;
      markProfilingFormSeen: () => void;
      shouldRedirectToProfiling: boolean;
    };
export const useProfileAdmin = (): UseProfileAdmin => {
  const { data: profileAdminData, status: profileAdminDataStatus } =
    useModuleQuery(profileAdminApi, "hasSeenProfilingForm");
  const { markProfilingFormSeen } = useModuleCommands(profileAdminApi);
  const isProfileAdminEnabled = useIsProfileAdminEnabled();
  const { status: isProfileAdminEnabledStatus } = isProfileAdminEnabled;
  if (
    profileAdminDataStatus === DataStatus.Loading ||
    isProfileAdminEnabledStatus === DataStatus.Loading
  ) {
    return {
      status: DataStatus.Loading,
      markProfilingFormSeen,
    };
  }
  if (
    profileAdminDataStatus === DataStatus.Error ||
    isProfileAdminEnabledStatus === DataStatus.Error
  ) {
    return {
      status: DataStatus.Error,
      markProfilingFormSeen,
    };
  }
  const shouldRedirectToProfiling =
    isProfileAdminEnabled.isProfileAdminEnabled &&
    !profileAdminData.hasSeenProfilingForm;
  return {
    status: DataStatus.Success,
    markProfilingFormSeen,
    shouldRedirectToProfiling,
  };
};
