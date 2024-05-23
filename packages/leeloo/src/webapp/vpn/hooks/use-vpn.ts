import { ReactNode, useCallback } from 'react';
import { AlertSeverity } from '@dashlane/ui-components';
import { ActivateVpnAccountRequest } from '@dashlane/communication';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { activateVpnAccount } from 'webapp/vpn/services';
import { clearVpnAccountErrors } from '../services/clear-vpn-account-errors';
import { completeVpnAccountActivation } from '../services/complete-vpn-account-activation';
interface UseVpn {
    readonly onActivateVpnAccount: (request: ActivateVpnAccountRequest) => void;
    readonly onClearVpnAccountErrors: () => void;
    readonly onCompleteVpnAccountActivation: () => void;
    readonly openActivateVpnSuccessAlert: (alertSuccessText: ReactNode) => void;
    readonly openActivateVpnErrorAlert: (alertErrorText: ReactNode) => void;
}
export function useVpn(): UseVpn {
    const alert = useAlert();
    const onActivateVpnAccount = useCallback(async (request) => {
        await activateVpnAccount(request);
    }, []);
    const onClearVpnAccountErrors = () => clearVpnAccountErrors();
    const onCompleteVpnAccountActivation = () => completeVpnAccountActivation();
    const openActivateVpnSuccessAlert = useCallback((alertSuccessText: ReactNode) => {
        alert.showAlert(alertSuccessText, AlertSeverity.SUCCESS);
    }, [alert]);
    const openActivateVpnErrorAlert = useCallback((alertErrorText: ReactNode) => {
        alert.showAlert(alertErrorText, AlertSeverity.ERROR);
    }, [alert]);
    return {
        onActivateVpnAccount,
        onClearVpnAccountErrors,
        onCompleteVpnAccountActivation,
        openActivateVpnSuccessAlert,
        openActivateVpnErrorAlert,
    };
}
