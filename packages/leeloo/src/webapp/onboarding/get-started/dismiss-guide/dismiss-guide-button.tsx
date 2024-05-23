import { Dispatch, SetStateAction } from 'react';
import { Button, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { logOpenModal } from '../logs';
interface DismissGuideButtonProps {
    setShowModal: Dispatch<SetStateAction<boolean>>;
}
const I18N_KEYS = {
    BUTTON_DISMISS_PAGE: 'onb_vault_get_started_dismiss_page',
};
export const DismissGuideButton = ({ setShowModal, }: DismissGuideButtonProps) => {
    const { translate } = useTranslate();
    const handleShowDismissModal = () => {
        logOpenModal();
        setShowModal(true);
    };
    return (<Button mood="neutral" intensity="quiet" layout="labelOnly" onClick={handleShowDismissModal}>
      {translate(I18N_KEYS.BUTTON_DISMISS_PAGE)}
    </Button>);
};
