import { useEffect, useState } from 'react';
import { Action } from 'redux';
import { WebOnboardingModeEvent } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { jsx } from '@dashlane/design-system';
import { useFeatureFlips } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { Alert, AlertName, getAlert, } from 'app/vault/embedded-alert-hub/helpers';
import { kernel } from 'kernel';
import { carbonConnector } from 'carbonConnector';
import { BrazeContentCardInfoBox, MasterPasswordLeakAlert, MasterPasswordWeakAlert, OnboardingAlert, PaymentFailureChurnedAlert, PaymentFailureChurningAlert, PremiumAlert, } from 'app/vault/embedded-alert-hub/alerts';
import { PasswordLimitReachedAlert } from 'app/vault/embedded-alert-hub/alerts/password-limit-reached-alert';
import { PasswordLimitAlmostReachedAlert } from 'app/vault/embedded-alert-hub/alerts/password-limit-almost-reached-alert';
import { useDismissMasterPasswordNotification, useIsBrazeContentDisabled, useIsMasterPasswordLeaked, useIsMasterPasswordWeak, usePaymentFailureNotificationData, usePremiumStatus, useSubscriptionCode, useUserMessages, } from 'libs/api';
import { useShowPasswordLimit } from 'libs/hooks/use-show-password-limit';
export interface EmbeddedAlertHubProps {
    dispatch: (action: Action) => void;
    webOnboardingMode: WebOnboardingModeEvent | null;
    alertBubbleHandler: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface EmbeddedAlertComponentProps {
    dispatch: (action: Action) => void;
    alertName: AlertName | null;
}
const EmbeddedAlertComponent = ({ dispatch, alertName, }: EmbeddedAlertComponentProps) => {
    const [isDismissed, setIsDismissed] = useState(false);
    const dismissMasterPasswordNotification = useDismissMasterPasswordNotification();
    const isBrazeContentDisabledResponse = useIsBrazeContentDisabled();
    const isBrazeContentDisabled = isBrazeContentDisabledResponse.status === DataStatus.Success &&
        Boolean(isBrazeContentDisabledResponse.data);
    const subscriptionCode = useSubscriptionCode();
    const onDismiss = (alert: AlertName) => {
        switch (alert) {
            case AlertName.Onboarding:
                {
                    const newWebOnboardingMode: WebOnboardingModeEvent = {
                        popoverStep: null,
                    };
                    void carbonConnector.updateWebOnboardingMode(newWebOnboardingMode);
                }
                break;
            case AlertName.MasterPasswordLeak:
            case AlertName.MasterPasswordWeak:
                dismissMasterPasswordNotification();
                break;
        }
        setIsDismissed(true);
    };
    const onClick = () => {
        setIsDismissed(true);
        kernel.browser.closePopover();
    };
    if (isDismissed) {
        return null;
    }
    switch (alertName) {
        case AlertName.Onboarding:
            return (<OnboardingAlert onDismiss={() => onDismiss(AlertName.Onboarding)}/>);
        case AlertName.MasterPasswordLeak:
            return (<MasterPasswordLeakAlert onDismiss={() => onDismiss(AlertName.MasterPasswordLeak)}/>);
        case AlertName.MasterPasswordWeak:
            return (<MasterPasswordWeakAlert onDismiss={() => onDismiss(AlertName.MasterPasswordWeak)}/>);
        case AlertName.PaymentFailureChurning:
            return (<PaymentFailureChurningAlert onClick={onClick} onDismiss={() => onDismiss(AlertName.PaymentFailureChurning)}/>);
        case AlertName.PaymentFailureChurned:
            return (<PaymentFailureChurnedAlert onClick={onClick} onDismiss={() => onDismiss(AlertName.PaymentFailureChurned)}/>);
        case AlertName.Premium:
            return (<PremiumAlert onClick={onClick} onDismiss={() => onDismiss(AlertName.Premium)} dispatch={dispatch} subscriptionCode={subscriptionCode}/>);
        case AlertName.PasswordLimit:
            return <PasswordLimitReachedAlert />;
        case AlertName.PasswordLimitAlmostReached:
            return <PasswordLimitAlmostReachedAlert />;
        case AlertName.None:
        default:
            return isBrazeContentDisabled ? null : <BrazeContentCardInfoBox />;
    }
};
const EmbeddedAlertHub = ({ alertBubbleHandler, dispatch, webOnboardingMode, }: EmbeddedAlertHubProps) => {
    const messages = useUserMessages();
    const paymentFailureNotification = usePaymentFailureNotificationData();
    const shouldDisplayMasterPasswordLeak = useIsMasterPasswordLeaked();
    const shouldDisplayMasterPasswordWeak = useIsMasterPasswordWeak();
    const passwordLimit = useShowPasswordLimit();
    const premiumStatus = usePremiumStatus();
    const alert: Alert = passwordLimit === null || premiumStatus === null
        ? null
        : getAlert({
            messages,
            paymentFailureNotification,
            shouldDisplayMasterPasswordLeak,
            shouldDisplayMasterPasswordWeak,
            passwordLimit,
            webOnboardingMode,
            premiumStatus,
        });
    useEffect(() => {
        if (alert && alert !== AlertName.None) {
            alertBubbleHandler(true);
        }
    }, [alert, alertBubbleHandler]);
    return alert ? (<EmbeddedAlertComponent alertName={alert} dispatch={dispatch}/>) : null;
};
const EmbeddedAlertHubNoWeakMasterPassword = ({ dispatch, webOnboardingMode, }: EmbeddedAlertHubProps) => {
    const messages = useUserMessages();
    const paymentFailureNotification = usePaymentFailureNotificationData();
    const shouldDisplayMasterPasswordLeak = useIsMasterPasswordLeaked();
    const passwordLimit = useShowPasswordLimit();
    const premiumStatus = usePremiumStatus();
    if (premiumStatus === null || passwordLimit === null) {
        return null;
    }
    const alert = getAlert({
        messages,
        paymentFailureNotification,
        shouldDisplayMasterPasswordLeak,
        shouldDisplayMasterPasswordWeak: false,
        passwordLimit,
        webOnboardingMode,
        premiumStatus,
    });
    return <EmbeddedAlertComponent alertName={alert} dispatch={dispatch}/>;
};
export const EmbeddedAlertWrapper = (props: EmbeddedAlertHubProps) => {
    const retrievedFF = useFeatureFlips();
    if (retrievedFF.status !== DataStatus.Success) {
        return null;
    }
    const isWeakMPEnabled = retrievedFF.data[FEATURE_FLIPS_WITHOUT_MODULE.ImsWebWeakMpProd];
    if (isWeakMPEnabled) {
        return <EmbeddedAlertHub {...props}/>;
    }
    return <EmbeddedAlertHubNoWeakMasterPassword {...props}/>;
};
