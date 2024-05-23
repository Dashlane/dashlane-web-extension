import * as React from 'react';
import { Dialog, DialogTitle } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    TITLE: 'manage_subscription_select_plan_dialog_header',
    CLOSE: '_common_dialog_dismiss_button',
};
interface SelectPlanDialogProps {
    isOpen: boolean;
    onClose: () => void;
}
export const SelectPlanDialog = ({ isOpen, onClose, }: SelectPlanDialogProps) => {
    const { translate } = useTranslate();
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={isOpen} onClose={onClose}>
      <DialogTitle>{translate(I18N_KEYS.TITLE)}</DialogTitle>
    </Dialog>);
};
