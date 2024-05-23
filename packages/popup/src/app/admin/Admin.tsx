import { Button, Infobox, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { SX_STYLES } from './Admin.styles';
import { OpenConsoleModule } from './modules/OpenConsole';
import { PasswordHealthModule } from './modules/PasswordHealth';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { useEffect, useState } from 'react';
const ADMIN_INTERVIEW_FF = 'ace_admin_tab_interview';
const ADMIN_INTERVIEW_FF_DEV = 'ace_admin_tab_interview_dev';
const INTERVIEW_INFOBOX_DISMISSED = 'dashlane-interview-infobox-dismissed';
const INTERVIEW_URL = '*****';
export const I18N_ADMIN_KEYS = {
    TITLE: 'tab/admin/title',
    OPEN_CONSOLE_TITLE: 'tab/admin/modules/open_console/title',
    OPEN_CONSOLE_CTA: 'tab/admin/modules/open_console/cta_title',
    CANCEL: 'tab/admin/interview/dismiss',
    INTERVIEW_TITLE: 'tab/admin/interview/title',
    INTERVIEW_DESC: 'tab/admin/interview/description',
    BOOK_TIME: 'tab/admin/interview/book_time',
};
export const Admin = () => {
    const { translate } = useTranslate();
    const { status: ffQueryStatus, data: featureFlips } = useFeatureFlips();
    const [isInterviewInfoVisible, setIsInterviewInfoVisible] = useState(false);
    const hasAdminInterviewFF = ffQueryStatus === DataStatus.Success
        ? featureFlips[ADMIN_INTERVIEW_FF] || featureFlips[ADMIN_INTERVIEW_FF_DEV]
        : false;
    useEffect(() => {
        const hasInfoboxBeenDismissed = window.localStorage.getItem(INTERVIEW_INFOBOX_DISMISSED);
        if (hasAdminInterviewFF && !hasInfoboxBeenDismissed) {
            setIsInterviewInfoVisible(true);
        }
    }, [hasAdminInterviewFF]);
    const openInterview = () => {
        window.open(INTERVIEW_URL, '_blank', 'noopener noreferrer');
    };
    const closeInterviewInfobox = () => {
        window.localStorage.setItem(INTERVIEW_INFOBOX_DISMISSED, JSON.stringify(true));
        setIsInterviewInfoVisible(false);
    };
    return (<header sx={SX_STYLES.WRAPPER} role="heading" aria-level={1} aria-label={translate(I18N_ADMIN_KEYS.TITLE)} tabIndex={-1}>
      {isInterviewInfoVisible ? (<Infobox title={translate(I18N_ADMIN_KEYS.INTERVIEW_TITLE)} description={translate(I18N_ADMIN_KEYS.INTERVIEW_DESC)} icon="FeedbackHelpOutlined" mood="brand" size="large" actions={[
                <Button key="dismiss-interview" onClick={closeInterviewInfobox} size="small" mood="brand" intensity="quiet">
              {translate(I18N_ADMIN_KEYS.CANCEL)}
            </Button>,
                <Button key="book-interview" onClick={openInterview} size="small" mood="brand" intensity="catchy">
              {translate(I18N_ADMIN_KEYS.BOOK_TIME)}
            </Button>,
            ]}/>) : null}
      <PasswordHealthModule />
      <OpenConsoleModule />
    </header>);
};
