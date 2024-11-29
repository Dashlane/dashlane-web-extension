import {
  DataStatus,
  useModuleCommands,
  useModuleQueries,
} from "@dashlane/framework-react";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
import { getStartedApi } from "@dashlane/onboarding-contracts";
import { Task, TaskStatus } from "../types/item.types";
type Statuses = Record<Task, TaskStatus>;
type TaskDefinition = {
  completion: boolean | undefined;
  disabled: boolean | undefined;
};
export type UseGetStartedTaskCompletion = {
  markAdminConsoleOpened: () => void;
} & (
  | {
      status: DataStatus.Error | DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      isInExtensionOrDesktop: boolean;
      tasks: Statuses;
    }
);
export const useGetStartedTaskCompletion = (): UseGetStartedTaskCompletion => {
  const { getTeamSeats } = useModuleQueries(
    teamPlanDetailsApi,
    { getTeamSeats: {} },
    []
  );
  const {
    hasAddedMobileOnWeb,
    hasOpenedAdminConsole,
    hasCompletedAutofillTutorial,
    hasCompletedCredentialTutorial,
  } = useModuleQueries(
    getStartedApi,
    {
      hasAddedMobileOnWeb: {},
      hasOpenedAdminConsole: {},
      hasCompletedAutofillTutorial: {},
      hasCompletedCredentialTutorial: {},
    },
    []
  );
  const { markAdminConsoleOpened } = useModuleCommands(getStartedApi);
  const commandResult = {
    markAdminConsoleOpened: () => markAdminConsoleOpened(undefined),
  };
  const isInExtensionOrDesktop =
    APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
  const queriesStatuses = [
    getTeamSeats.status,
    hasOpenedAdminConsole.status,
    hasCompletedAutofillTutorial.status,
    hasCompletedCredentialTutorial.status,
    hasAddedMobileOnWeb.status,
  ];
  const hasDataStatus = (status: DataStatus, statuses: DataStatus[]) =>
    statuses.some((queryStatus) => queryStatus === status);
  if (hasDataStatus(DataStatus.Error, queriesStatuses)) {
    return { ...commandResult, status: DataStatus.Error };
  }
  if (hasDataStatus(DataStatus.Loading, queriesStatuses)) {
    return { ...commandResult, status: DataStatus.Loading };
  }
  const hasMoreThanOneProvisionedMembers =
    getTeamSeats.status === DataStatus.Success
      ? getTeamSeats.data.paid +
          getTeamSeats.data.extraFree -
          getTeamSeats.data.remaining >
        1
      : false;
  const tasks: Record<keyof Statuses, TaskDefinition> = {
    [Task.INSTALL_EXTENSION]: {
      completion: isInExtensionOrDesktop,
      disabled: undefined,
    },
    [Task.ADD_PASSWORD]: {
      completion: hasCompletedCredentialTutorial.data,
      disabled: !isInExtensionOrDesktop,
    },
    [Task.TRY_AUTOFILL]: {
      completion: hasCompletedAutofillTutorial.data,
      disabled: !isInExtensionOrDesktop,
    },
    [Task.INVITE_MEMBERS]: {
      completion: hasMoreThanOneProvisionedMembers,
      disabled: false,
    },
    [Task.OPEN_ADMIN_CONSOLE]: {
      completion: hasOpenedAdminConsole.data,
      disabled: undefined,
    },
    [Task.CREATE_ACCOUNT]: {
      completion: true,
      disabled: undefined,
    },
    [Task.GET_MOBILE_APP]: {
      completion: hasAddedMobileOnWeb.data,
      disabled: undefined,
    },
  };
  const statuses = Object.entries(tasks).reduce(
    (computedTasks, [taskName, taskDefinition]) => {
      const disabled = taskDefinition.disabled
        ? TaskStatus.DISABLED
        : undefined;
      const completion = taskDefinition.completion
        ? TaskStatus.COMPLETED
        : TaskStatus.IDLE;
      return {
        ...computedTasks,
        [taskName]: disabled ?? completion,
      };
    },
    {} as Statuses
  );
  return {
    ...commandResult,
    isInExtensionOrDesktop,
    status: DataStatus.Success,
    tasks: statuses,
  };
};
