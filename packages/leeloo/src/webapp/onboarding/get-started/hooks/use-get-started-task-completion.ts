import { DataStatus, useModuleCommands, useModuleQueries, } from '@dashlane/framework-react';
import { getStartedApi } from '@dashlane/onboarding-contracts';
import { Task, TaskStatus } from '../types';
type Statuses = Record<Task, TaskStatus>;
type TaskDefinition = {
    completion: boolean | undefined;
    disabled: boolean | undefined;
};
export type UseGetStartedTaskCompletion = {
    markAdminConsoleOpened: () => void;
} & ({
    status: DataStatus.Error | DataStatus.Loading;
} | {
    status: DataStatus.Success;
    tasks: Statuses;
});
export const useGetStartedTaskCompletion = (): UseGetStartedTaskCompletion => {
    const { hasOpenedAdminConsole, hasCompletedAutofillTutorial, hasCompletedCredentialTutorial, } = useModuleQueries(getStartedApi, {
        hasOpenedAdminConsole: {},
        hasCompletedAutofillTutorial: {},
        hasCompletedCredentialTutorial: {},
    }, []);
    const { markAdminConsoleOpened } = useModuleCommands(getStartedApi);
    const commandResult = {
        markAdminConsoleOpened: () => markAdminConsoleOpened(undefined),
    };
    const isInExtensionOrDesktop = APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
    const queriesStatuses = [
        hasOpenedAdminConsole.status,
        hasCompletedAutofillTutorial.status,
        hasCompletedCredentialTutorial.status,
    ];
    const hasDataStatus = (status: DataStatus, statuses: DataStatus[]) => statuses.some((queryStatus) => queryStatus === status);
    if (hasDataStatus(DataStatus.Error, queriesStatuses)) {
        return { ...commandResult, status: DataStatus.Error };
    }
    if (hasDataStatus(DataStatus.Loading, queriesStatuses)) {
        return { ...commandResult, status: DataStatus.Loading };
    }
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
        [Task.OPEN_ADMIN_CONSOLE]: {
            completion: hasOpenedAdminConsole.data,
            disabled: undefined,
        },
    };
    const statuses = Object.entries(tasks).reduce((computedTasks, [taskName, taskDefinition]) => {
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
    }, {} as Statuses);
    return {
        ...commandResult,
        status: DataStatus.Success,
        tasks: statuses,
    };
};
