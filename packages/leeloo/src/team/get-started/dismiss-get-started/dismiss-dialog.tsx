import { Button, jsx } from '@dashlane/design-system';
import { DialogFooter } from '@dashlane/ui-components';
import { NotificationName } from '@dashlane/communication';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
import { useNotificationInteracted } from 'libs/carbon/hooks/useNotificationStatus';
import { logCancelClick, logDismissClick, logNavigateAway } from './logs';
const I18N_KEYS = {
    CANCEL: '_common_action_cancel',
    CLOSE_PAGE_MODAL_CTA: 'team_get_started_close_page_cta',
    CLOSE_PAGE_MODAL_TITLE: 'team_get_started_close_page_title',
    CLOSE_PAGE_MODAL_CONTENT: 'team_get_started_close_page_content',
};
export interface DismissDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}
export const DismissDialog = ({ isOpen, setIsOpen }: DismissDialogProps) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const { setAsInteracted: setHasDismissedGetStarted } = useNotificationInteracted(NotificationName.TacGetStartedDismissPage);
    const routerContext = useRouterGlobalSettingsContext();
    const handleDismissedClick = () => {
        logDismissClick();
        setHasDismissedGetStarted();
        history.push(routerContext.routes.teamDashboardRoutePath);
    };
    const handleCancelClick = () => {
        logCancelClick();
        setIsOpen(false);
    };
    const handleNavigateAway = () => {
        logNavigateAway();
        setIsOpen(false);
    };
    return (<SimpleDialog title={translate(I18N_KEYS.CLOSE_PAGE_MODAL_TITLE)} isOpen={isOpen} onRequestClose={handleNavigateAway} footer={<DialogFooter>
          <Button sx={{ mr: '12px' }} mood="neutral" intensity="quiet" onClick={handleCancelClick}>
            {translate(I18N_KEYS.CANCEL)}
          </Button>
          <Button mood="danger" intensity="catchy" onClick={handleDismissedClick}>
            {translate(I18N_KEYS.CLOSE_PAGE_MODAL_CTA)}
          </Button>
        </DialogFooter>}>
      {translate(I18N_KEYS.CLOSE_PAGE_MODAL_CONTENT)}
    </SimpleDialog>);
};
