import { Dispatch, SetStateAction } from 'react';
import { Dialog, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { useHasDismissedGetStarted } from '../hooks/use-get-started-dismissed';
import { logModalCancel, logModalClose, logModalDismissOnboarding, } from '../logs';
interface DismissGuideModalProps {
    isOpen: boolean;
    setShowDismissGuideModal: Dispatch<SetStateAction<boolean>>;
}
const I18N_KEYS = {
    DISMISS_MODAL_TITLE: 'onb_vault_get_started_dismiss_modal_title',
    DISMISS_MODAL_CONTENT: 'onb_vault_get_started_dismiss_modal_content',
    DISMISS_MODAL_ACTION_DISMISS: 'onb_vault_get_started_dismiss_modal_action_primary',
    DISMISS_MODAL_ACTION_CANCEL: 'onb_vault_get_started_dismiss_modal_action_secondary',
    DISMISS_MODAL_ACTION_CLOSE: 'onb_vault_get_started_dismiss_modal_action_close',
};
export const DismissGuideModal = ({ isOpen, setShowDismissGuideModal, }: DismissGuideModalProps) => {
    const { dismissGetStarted } = useHasDismissedGetStarted();
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const onCloseHandler = () => {
        logModalClose();
        setShowDismissGuideModal(false);
    };
    const onCancelHandler = () => {
        logModalCancel();
        setShowDismissGuideModal(false);
    };
    const onDismissOnboardingHandler = () => {
        dismissGetStarted();
        logModalDismissOnboarding();
        setShowDismissGuideModal(false);
        redirect(routes.userCredentials);
    };
    return (<Dialog isOpen={isOpen} actions={{
            primary: {
                children: translate(I18N_KEYS.DISMISS_MODAL_ACTION_DISMISS),
                onClick: onDismissOnboardingHandler,
            },
            secondary: {
                children: translate(I18N_KEYS.DISMISS_MODAL_ACTION_CANCEL),
                onClick: onCancelHandler,
            },
        }} closeActionLabel={translate(I18N_KEYS.DISMISS_MODAL_ACTION_CLOSE)} isDestructive onClose={onCloseHandler} title={translate(I18N_KEYS.DISMISS_MODAL_TITLE)}>
      <Paragraph>{translate(I18N_KEYS.DISMISS_MODAL_CONTENT)}</Paragraph>
    </Dialog>);
};
