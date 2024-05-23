import { Fragment, useEffect, useState } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { FlexContainer, GridChild, GridContainer, } from '@dashlane/ui-components';
import { ContactSupportDialog } from 'team/page/support/contact-support-dialog';
import { logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { useHasSeenGetStarted } from './hooks/use-has-seen-get-started';
import { useTaskList } from './hooks/use-task-list';
import { HelpTips } from './help-tips';
import { DismissDialog } from './dismiss-get-started/dismiss-dialog';
import { HeaderMessage } from './header-message/header-message';
import { TaskListContainer } from './task-list/task-list-container';
import { DismissGetStarted } from './dismiss-get-started/dismiss-get-started';
import { Loader } from '../components/loader';
const I18N_KEYS = {
    UP_NEXT_TITLE: 'team_get_started_up_next_task_title',
    CLOSE_GUIDE_TEXT: 'team_get_started_close_guide',
    CLOSE_GUIDE_CTA: 'team_get_started_close_guide_cta',
};
export const GetStarted = () => {
    const { translate } = useTranslate();
    const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
    const [contactSupportDialogIsOpen, setContactSupportDialogIsOpen] = useState(false);
    const { isLoading, tasks } = useTaskList();
    const { isHasSeenGetStartedLoading, hasSeenGetStarted, markGetStartedAsSeen, } = useHasSeenGetStarted();
    useEffect(() => {
        logPageView(PageView.TacOnboardingChecklist);
    }, []);
    useEffect(() => {
        if (!hasSeenGetStarted && !isHasSeenGetStartedLoading) {
            markGetStartedAsSeen();
        }
    }, [hasSeenGetStarted, isHasSeenGetStartedLoading]);
    const getTaskListItems = () => {
        const listItems = tasks;
        const upNextIndex = tasks.findIndex((task) => !task.isCompleted);
        const hasUpNext = upNextIndex >= 0;
        let upNextTask = null;
        if (hasUpNext) {
            upNextTask = listItems[upNextIndex];
            listItems.splice(upNextIndex, 1);
        }
        const toDoTasks = listItems.filter((task) => !task.isCompleted);
        const completedTasks = listItems.filter((task) => task.isCompleted);
        return {
            upNextTask: upNextTask,
            toDoTasks: toDoTasks,
            completedTasks: completedTasks,
        };
    };
    const { upNextTask, toDoTasks, completedTasks } = getTaskListItems();
    const allTasksCompleted = toDoTasks.length === 0 && upNextTask === null;
    return (<FlexContainer sx={{ paddingX: '80px', paddingY: '32px', maxWidth: '1900px' }} gap={'8px'} flexDirection="column">
      <HeaderMessage allTasksCompleted={allTasksCompleted}/>
      {allTasksCompleted ? (<DismissGetStarted allTasksCompleted={allTasksCompleted} openDialog={setIsCloseDialogOpen}/>) : null}
      {upNextTask ? (<Heading as="h2" textStyle="ds.title.section.medium" sx={{ marginTop: '16px' }}>
          {translate(I18N_KEYS.UP_NEXT_TITLE)}
        </Heading>) : null}
      <GridContainer fullWidth gap={'64px'} gridTemplateColumns="2fr 1fr" gridTemplateAreas={`'tasks helpTips'`}>
        <GridChild gridArea="tasks">
          {isLoading ? (<Loader />) : (<>
              <TaskListContainer upNextTask={upNextTask} completedTasks={completedTasks} toDoTasks={toDoTasks}/>
              {!allTasksCompleted ? (<DismissGetStarted allTasksCompleted={allTasksCompleted} openDialog={setIsCloseDialogOpen}/>) : null}
            </>)}
        </GridChild>
        <GridChild gridArea="helpTips" sx={{ paddingTop: '8px' }}>
          <HelpTips setContactSupportDialogIsOpen={setContactSupportDialogIsOpen}/>
        </GridChild>
      </GridContainer>
      {contactSupportDialogIsOpen ? (<ContactSupportDialog onDismiss={() => setContactSupportDialogIsOpen(false)}/>) : null}
      <DismissDialog isOpen={isCloseDialogOpen} setIsOpen={setIsCloseDialogOpen}/>
    </FlexContainer>);
};
