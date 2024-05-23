import React, { useRef } from 'react';
import { Alert, AlertSeverity, AlertSize, AlertWrapper, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const ALERT_MS = 5000;
const I18N_KEYS = {
    CHANGES_SAVED_TOAST: '_common_toast_changes_saved',
    DISMISS: '_common_alert_dismiss_button',
};
interface Props {
    onClose: () => void;
    setDisplayLinkedWebsitesDataSavedAlert: (shouldDisplayAlert: boolean) => void;
}
export const LinkedWebsitesSavedAlert = ({ onClose, setDisplayLinkedWebsitesDataSavedAlert, }: Props) => {
    const { translate } = useTranslate();
    const timer = useRef<number | null>(null);
    timer.current = window.setTimeout(() => setDisplayLinkedWebsitesDataSavedAlert(false), ALERT_MS);
    return (<AlertWrapper>
      <Alert size={AlertSize.SMALL} severity={AlertSeverity.SUCCESS} closeIconName={translate(I18N_KEYS.DISMISS)} onClose={onClose}>
        {translate(I18N_KEYS.CHANGES_SAVED_TOAST)}
      </Alert>
    </AlertWrapper>);
};
