import * as React from 'react';
import { DataStatus, useFeatureFlip, useModuleQuery, } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { passwordLimitApi } from '@dashlane/vault-contracts';
import { useLocation } from 'libs/router';
import { PaywallManager, PaywallName } from 'webapp/paywall';
import { PaywallProps } from 'webapp/paywall/paywall/generic-paywall';
import { PAYWALL_ROUTES } from 'webapp/paywall/manager/paywall-manager';
const PASSWORD_NEAR_LIMIT_THRESHOLD = 5;
export interface PaywallInterface {
    openPaywall: (name: PaywallName, mode?: PaywallProps['mode']) => void;
}
export const PaywallContext = React.createContext<PaywallInterface>({
    openPaywall: () => { },
});
const DEFAULT_MODE = 'popup';
export const usePaywall = () => React.useContext(PaywallContext);
export type UsePasswordLimitPaywall = {
    isLoading: true;
} | {
    isLoading: false;
    shouldShowNearLimitContent: boolean;
    shouldShowAtOrOverLimitContent: boolean;
    passwordsLeft?: number;
};
export const usePasswordLimitPaywall = (): UsePasswordLimitPaywall => {
    const hasPasswordLimitFF = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.B2CRestrictPasswordFreePlanPhase1);
    const passwordLimitStatus = useModuleQuery(passwordLimitApi, 'getPasswordLimitStatus');
    const featureFlipLoading = typeof hasPasswordLimitFF !== 'boolean';
    if (featureFlipLoading || passwordLimitStatus.status !== DataStatus.Success) {
        return { isLoading: true };
    }
    const { hasLimit, passwordsLeft } = passwordLimitStatus.data;
    if (!hasPasswordLimitFF || !hasLimit || passwordsLeft === undefined) {
        return {
            isLoading: false,
            shouldShowAtOrOverLimitContent: false,
            shouldShowNearLimitContent: false,
        };
    }
    const shouldShowNearLimitContent = passwordsLeft > 0 && passwordsLeft <= PASSWORD_NEAR_LIMIT_THRESHOLD;
    const shouldShowAtOrOverLimitContent = passwordsLeft <= 0;
    return {
        isLoading: false,
        shouldShowNearLimitContent,
        shouldShowAtOrOverLimitContent,
        passwordsLeft,
    };
};
export const PaywallProvider: React.FC = ({ children }) => {
    const location = useLocation();
    const [mode, setMode] = React.useState<PaywallProps['mode']>(DEFAULT_MODE);
    const [paywallName, setPaywallName] = React.useState<PaywallName | undefined>(undefined);
    const closePaywall = React.useCallback(() => {
        setPaywallName(undefined);
        if (mode) {
            setMode(DEFAULT_MODE);
        }
    }, [mode]);
    React.useEffect(() => {
        if (!paywallName ||
            Object.values(PAYWALL_ROUTES).includes(location.pathname)) {
            return;
        }
        closePaywall();
    }, [paywallName, location, mode, closePaywall]);
    const { current: contextValue } = React.useRef({
        openPaywall: (name: PaywallName, mode?: PaywallProps['mode']) => {
            setPaywallName(name);
            if (mode) {
                setMode(mode);
            }
        },
    });
    return (<PaywallContext.Provider value={contextValue}>
      {children}
      <PaywallManager paywall={paywallName} closePaywall={closePaywall} mode={mode}/>
    </PaywallContext.Provider>);
};
