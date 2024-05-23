import { DialogFooter, jsx } from '@dashlane/ui-components';
import { useEffect, useRef, useState } from 'react';
import { Domain } from '@dashlane/communication';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    BUTTON_CANCEL: 'team_settings_domain_deactivate_button_cancel',
    BUTTON_REMOVE: 'team_settings_domain_deactivate_button_remove',
    DESCRIPTION_MARKUP: 'team_settings_domain_deactivate_description_markup',
    TITLE: 'team_settings_domain_deactivate_title',
};
interface DeactivateDomainDialogProps {
    domain: Domain;
    onConfirm: () => Promise<unknown>;
    onDismiss: () => void;
}
export const DeactivateDomainDialog = ({ domain, onConfirm, onDismiss, }: DeactivateDomainDialogProps) => {
    const { translate } = useTranslate();
    const [isAsync, setIsAsync] = useState(false);
    const unmounted = useRef(false);
    useEffect(() => {
        return () => {
            unmounted.current = true;
        };
    }, [unmounted]);
    const handleConfirmClick = async () => {
        setIsAsync(true);
        await onConfirm();
        if (unmounted.current) {
            return;
        }
        setIsAsync(false);
        onDismiss();
    };
    return (<SimpleDialog isOpen onRequestClose={onDismiss} footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.BUTTON_REMOVE)} primaryButtonOnClick={handleConfirmClick} primaryButtonProps={{
                disabled: isAsync,
            }} secondaryButtonTitle={translate(I18N_KEYS.BUTTON_CANCEL)} secondaryButtonOnClick={onDismiss} intent="primary"/>} title={translate(I18N_KEYS.TITLE)}>
      <p>
        {translate.markup(I18N_KEYS.DESCRIPTION_MARKUP, {
            domainUrl: domain.name,
        })}
      </p>
    </SimpleDialog>);
};
