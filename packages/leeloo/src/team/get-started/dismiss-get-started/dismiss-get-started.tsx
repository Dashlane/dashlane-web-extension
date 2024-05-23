import React from 'react';
import { Button, Paragraph } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { logDismissGetStartedPage } from './logs';
const I18N_KEYS = {
    TASKS_TITLE: 'team_get_started_tasks_title',
    COMPLETED_TITLE: 'team_get_started_completed_tasks_title',
    UP_NEXT_TITLE: 'team_get_started_up_next_task_title',
    CLOSE_GUIDE_TEXT: 'team_get_started_close_guide',
    CLOSE_GUIDE_CTA: 'team_get_started_close_guide_cta',
};
export interface DismissGetStartedProps {
    openDialog: (isOpened: boolean) => void;
    allTasksCompleted: boolean;
}
export const DismissGetStarted = ({ openDialog, allTasksCompleted, }: DismissGetStartedProps) => {
    const { translate } = useTranslate();
    const handleClickClosePage = () => {
        logDismissGetStartedPage();
        openDialog(true);
    };
    return (<FlexContainer sx={{
            display: 'flex',
            marginTop: !allTasksCompleted ? '40px' : '0px',
            marginBottom: !allTasksCompleted ? '80px' : '16px',
            alignItems: 'center',
            gap: '16px',
        }}>
      <Paragraph color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.CLOSE_GUIDE_TEXT)}
      </Paragraph>
      <Button onClick={handleClickClosePage} size="small" mood="neutral" intensity="quiet">
        {translate(I18N_KEYS.CLOSE_GUIDE_CTA)}
      </Button>
    </FlexContainer>);
};
