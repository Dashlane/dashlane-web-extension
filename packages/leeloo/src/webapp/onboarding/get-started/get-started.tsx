import { useState } from 'react';
import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
import { Redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { useHasDismissedGetStarted } from './hooks/use-get-started-dismissed';
import { useGetStartedTaskCompletion } from './hooks/use-get-started-task-completion';
import { DismissGuideButton, DismissGuideModal } from './dismiss-guide';
import { GetStartedList } from './get-started-list/get-started-task-list';
import { TaskStatus } from './types';
const I18N_KEYS = {
    TITLE_WELCOME_TO_DASHLANE_VAULT: 'onb_vault_get_started_title_welcome',
    SUBTITLE_HELPFUL_TIPS_TEXT: 'onb_vault_get_started_title_tips',
    SUBTITLE_DISMISS_SUGGESTION: 'onb_vault_get_started_dissmiss_suggestion',
};
export const GetStarted = () => {
    const { translate } = useTranslate();
    const { routes: { clientRoutesBasePath }, } = useRouterGlobalSettingsContext();
    const { isGetStartedDismissed } = useHasDismissedGetStarted();
    const [showDismissGuideModal, setShowDismissGuideModal] = useState(false);
    const tasksCompletion = useGetStartedTaskCompletion();
    const hasCompletedAllTasks = tasksCompletion.status === DataStatus.Success &&
        Object.values(tasksCompletion.tasks).every((task) => task === TaskStatus.COMPLETED);
    if (isGetStartedDismissed) {
        return <Redirect to={clientRoutesBasePath}/>;
    }
    return (<div sx={{
            padding: '48px 32px',
        }}>
      <Heading textStyle="ds.title.section.large" color="ds.text.neutral.catchy" as="h1">
        {translate(I18N_KEYS.TITLE_WELCOME_TO_DASHLANE_VAULT)}
      </Heading>
      <div sx={{
            display: 'flex',
            gap: '32px',
            alignItems: 'start',
            marginBottom: '42px',
            marginTop: '8px',
        }}>
        <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet">
          {translate(hasCompletedAllTasks
            ? I18N_KEYS.SUBTITLE_DISMISS_SUGGESTION
            : I18N_KEYS.SUBTITLE_HELPFUL_TIPS_TEXT)}
        </Paragraph>
        {hasCompletedAllTasks ? (<DismissGuideButton setShowModal={setShowDismissGuideModal}/>) : null}
      </div>
      <div sx={{
            display: 'flex',
            gap: '24px',
            flexDirection: 'column',
        }}>
        <GetStartedList />
        {!hasCompletedAllTasks ? (<DismissGuideButton setShowModal={setShowDismissGuideModal}/>) : null}
        <DismissGuideModal isOpen={showDismissGuideModal} setShowDismissGuideModal={setShowDismissGuideModal}/>
      </div>
    </div>);
};
