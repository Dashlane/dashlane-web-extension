import React, { useEffect } from 'react';
import { VpnAccountActivationErrorType, VpnAccountStatusType, } from '@dashlane/communication';
import { useTranslateWithMarkup } from 'libs/i18n/useTranslateWithMarkup';
import { useVpn } from 'webapp/vpn';
import { CredentialForm } from '../components/credential-form';
import { TutorialStepNumberProp } from '../components/types';
import { HOTSPOTSHIELD_SUPPORT_URL } from '../components/vpn-links-constants';
const I18N_KEYS = {
    ACTIVE: {
        ALERT_SUCCESS: 'webapp_vpn_page_credential_active_alert_success',
    },
};
const I18N_KEYS_ERRORS = {
    [VpnAccountActivationErrorType.ServerError]: {
        key: 'webapp_vpn_page_credential_error_alert_error',
    },
    [VpnAccountActivationErrorType.AccountAlreadyExistError]: {
        key: 'webapp_vpn_page_credential_activate_email_in_use_error_alert_markup',
        params: {
            hotspotSupport: HOTSPOTSHIELD_SUPPORT_URL,
        },
    },
};
export const VpnAccountActivation = ({ stepNumber, vpnCredential, }: TutorialStepNumberProp) => {
    const { translateWithMarkup } = useTranslateWithMarkup();
    const { onActivateVpnAccount, onClearVpnAccountErrors, onCompleteVpnAccountActivation, openActivateVpnSuccessAlert, openActivateVpnErrorAlert, } = useVpn();
    useEffect(() => {
        if (!vpnCredential) {
            return;
        }
        if (vpnCredential.status === VpnAccountStatusType.Ready) {
            openActivateVpnSuccessAlert(translateWithMarkup(I18N_KEYS.ACTIVE.ALERT_SUCCESS));
            onCompleteVpnAccountActivation();
        }
        if (vpnCredential.status === VpnAccountStatusType.Error) {
            openActivateVpnErrorAlert(translateWithMarkup(I18N_KEYS_ERRORS[vpnCredential.error]));
            onClearVpnAccountErrors();
        }
    }, [
        onClearVpnAccountErrors,
        onCompleteVpnAccountActivation,
        openActivateVpnSuccessAlert,
        openActivateVpnErrorAlert,
        translateWithMarkup,
        vpnCredential,
    ]);
    return (<CredentialForm stepNumber={stepNumber} vpnCredential={vpnCredential} generateCredential={onActivateVpnAccount}/>);
};
