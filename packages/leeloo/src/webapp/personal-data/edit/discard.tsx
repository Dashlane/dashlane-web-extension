import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { Dialog } from '@dashlane/design-system';
const I18N_KEYS = {
    CONFIRM: 'webapp_edit_panel_discard_dialog_confirm',
    DISMISS: 'webapp_edit_panel_discard_dialog_dismiss',
    SUBTITLE: 'webapp_edit_panel_discard_dialog_subtitle',
    TITLE: 'webapp_edit_panel_discard_dialog_title',
};
interface Props {
    onConfirmClick: () => void;
    onDismissClick: () => void;
}
export const ConfirmDiscardDialog = ({ onConfirmClick, onDismissClick, }: Props): JSX.Element => {
    const { translate } = useTranslate();
    const handleConfirmClick = () => {
        onConfirmClick();
    };
    const handleDismissClick = () => {
        onDismissClick();
    };
    return (<Dialog isOpen onClose={handleDismissClick} title={translate(I18N_KEYS.TITLE)} closeActionLabel={translate('_common_dialog_dismiss_button')} isDestructive actions={{
            primary: {
                children: translate(I18N_KEYS.CONFIRM),
                onClick: handleConfirmClick,
            },
            secondary: {
                children: translate(I18N_KEYS.DISMISS),
                onClick: handleDismissClick,
            },
        }}>
      {translate(I18N_KEYS.SUBTITLE)}
    </Dialog>);
};
