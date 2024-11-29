import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { profileAdminApi } from "@dashlane/onboarding-contracts";
import { useIsProfileAdminEnabled } from "./use-is-profile-admin-enabled";
export type UseProfileAdminTask =
  | {
      status: DataStatus.Error;
    }
  | {
      status: DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      isProfilingAdminTodo: boolean;
      profilingRemainingQuestions: number;
    };
export const TOTAL_NUM_OF_PROFILING_QUESTIONS = 4;
export const useProfileAdminTask = (): UseProfileAdminTask => {
  const { data: profileAdminData, status: profileAdminDataStatus } =
    useModuleQuery(profileAdminApi, "answers");
  const isProfileAdminEnabled = useIsProfileAdminEnabled();
  const { status: isProfileAdminEnabledStatus } = isProfileAdminEnabled;
  if (
    isProfileAdminEnabledStatus === DataStatus.Loading ||
    profileAdminDataStatus === DataStatus.Loading
  ) {
    return {
      status: DataStatus.Loading,
    };
  }
  if (
    isProfileAdminEnabledStatus === DataStatus.Error ||
    profileAdminDataStatus === DataStatus.Error
  ) {
    return {
      status: DataStatus.Error,
    };
  }
  const numOfCompletedQuestions = profileAdminData.answers.filter(
    (answer) => answer.completed
  ).length;
  const profilingRemainingQuestions =
    TOTAL_NUM_OF_PROFILING_QUESTIONS - numOfCompletedQuestions;
  const hasAdminCompletedProfilingForm = profilingRemainingQuestions === 0;
  const isProfilingAdminTodo =
    isProfileAdminEnabled.isProfileAdminEnabled &&
    !hasAdminCompletedProfilingForm;
  return {
    status: DataStatus.Success,
    isProfilingAdminTodo,
    profilingRemainingQuestions,
  };
};
