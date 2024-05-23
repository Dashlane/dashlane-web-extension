import * as React from 'react';
import { Capabilities } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { assertUnreachable } from 'libs/assert-unreachable';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { PaywallProps } from 'webapp/paywall/paywall/generic-paywall';
import { DarkWebMonitoringPaywall } from 'webapp/paywall/paywall/dark-web-monitoring-paywall';
import { SecureNotesPaywall } from 'webapp/paywall/paywall/secure-notes-paywall';
import { PasswordLimitDialog } from 'webapp/credentials/header/password-limit-dialog';
import { useVpnPageAccess, VPNPaywallType, } from 'webapp/vpn/hooks/use-vpn-page-access';
import { VpnPaywall } from '../paywall/vpn/vpn-paywall';
export enum PaywallName {
    DarkWebMonitoring = 'DarkWebMonitoring',
    Credential = 'Credential',
    SecureNote = 'SecureNote',
    Vpn = 'Vpn'
}
export enum PaywalledCapability {
    DataLeak = 'dataLeak',
    SecureNotes = 'secureNotes',
    Vpn = 'secureWiFi'
}
export const PAYWALL_ROUTES: Record<PaywallName, string> = {
    DarkWebMonitoring: '/darkweb-monitoring',
    Credential: '/credentials',
    SecureNote: '/secure-notes',
    Vpn: '/vpn',
};
export interface PaywallManagerProps extends Pick<PaywallProps, 'mode' | 'closePaywall'> {
    paywall?: PaywallName;
    children?: React.ReactNode;
}
export const shouldShowPaywall = (requiredCapability: PaywalledCapability, capabilities?: Capabilities) => {
    if (!capabilities) {
        return true;
    }
    return !capabilities[requiredCapability]?.enabled;
};
export const PaywallManager = ({ paywall, mode, children, closePaywall, }: PaywallManagerProps) => {
    const premiumStatus = usePremiumStatus();
    const { vpnPaywallInfo } = useVpnPageAccess() ?? {};
    if (premiumStatus.status !== DataStatus.Success ||
        vpnPaywallInfo === undefined) {
        return null;
    }
    if (paywall) {
        if (paywall === PaywallName.SecureNote) {
            if (shouldShowPaywall(PaywalledCapability.SecureNotes, premiumStatus.data.capabilities)) {
                return <SecureNotesPaywall mode={mode} closePaywall={closePaywall}/>;
            }
        }
        else if (paywall === PaywallName.DarkWebMonitoring) {
            if (shouldShowPaywall(PaywalledCapability.DataLeak, premiumStatus.data.capabilities)) {
                return (<DarkWebMonitoringPaywall mode={mode} closePaywall={closePaywall}/>);
            }
        }
        else if (paywall === PaywallName.Vpn) {
            if (vpnPaywallInfo.isVisible) {
                return (<VpnPaywall mode={mode} closePaywall={closePaywall} premiumStatus={premiumStatus.data} isB2CPaywall={vpnPaywallInfo.type === VPNPaywallType.B2C}/>);
            }
        }
        else if (paywall === PaywallName.Credential) {
            return (<PasswordLimitDialog isVisible={true} handleDismiss={() => {
                    closePaywall?.();
                }}/>);
        }
        else {
            assertUnreachable(paywall);
        }
    }
    return <>{children}</>;
};
