import { useState } from 'react';
import { DataStatus } from '@dashlane/framework-react';
import { Heading, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { tasks } from './tasks';
import { Task, TaskDefinition } from '../types';
import { TaskItem } from '../get-started-tasks';
import { useGetStartedTaskCompletion } from '../hooks/use-get-started-task-completion';
import { OpenAdminConsoleDialog } from '../../../open-admin-console-dialog/open-admin-console-dialog';
export const I18N_KEYS = {
    TITLE_FIRST_STEPS: 'onb_vault_get_started_title_first_steps_dashlane',
};
export const GetStartedList = () => {
    const { translate } = useTranslate();
    const [openInstallExtensionModal, setOpenInstallExtensionModal] = useState(false);
    const tasksCompletion = useGetStartedTaskCompletion();
    const isInExtensionOrDesktop = APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
    const hydrateAction = (taskName: Task, action: TaskDefinition['action']): TaskDefinition['action'] => ({
        ...action,
        handler: () => {
            switch (taskName) {
                case Task.OPEN_ADMIN_CONSOLE:
                    if (isInExtensionOrDesktop) {
                        tasksCompletion.markAdminConsoleOpened();
                        action.handler();
                    }
                    else {
                        setOpenInstallExtensionModal(true);
                    }
                    break;
                default:
                    action.handler();
            }
        },
    });
    if (tasksCompletion.status !== DataStatus.Success) {
        return null;
    }
    return (<div sx={{
            display: 'flex',
            padding: '24px',
            paddingBottom: '32px',
            flexDirection: 'column',
            borderRadius: '8px',
            border: '1px solid transparent',
            borderColor: 'ds.border.neutral.quiet.idle',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
        }}>
      <Heading textStyle="ds.title.section.medium" color="ds.text.neutral.catchy" as="h1" sx={{ marginBottom: '16px' }}>
        {translate(I18N_KEYS.TITLE_FIRST_STEPS)}
      </Heading>

      
      {Object.entries(tasks).map(([taskName, { title, icon, action }], taskIndex) => {
            const hydratedAction = hydrateAction(taskName as Task, action);
            return (<TaskItem key={taskName} isLastItem={taskIndex === Object.keys(tasks).length - 1} status={tasksCompletion.tasks[taskName]} title={title} icon={icon} action={hydratedAction}/>);
        })}
      <OpenAdminConsoleDialog showAdminConsoleModal={openInstallExtensionModal} setShowAdminConsoleModal={setOpenInstallExtensionModal}/>
    </div>);
};
