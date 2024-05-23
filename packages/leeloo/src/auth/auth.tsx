import { Fragment, PropsWithChildren, useEffect, useState } from 'react';
import classnames from 'classnames';
import { jsx } from '@dashlane/design-system';
import { AdminPermissionLevel, RequiredExtensionSettings, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { useLocation } from 'libs/router';
import { EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT, LOGIN_URL_SEGMENT, } from 'app/routes/constants';
import { DashlaneBusinessMarketingContainer } from './marketing-container/dashlane-business';
import { StandardMarketingContainer } from './marketing-container/standard';
import { TeamSignUpContainer } from './marketing-container/team-sign-up/team-sign-up-container';
import { LoginNotifications } from './login-notifications/login-notifications';
import { LoginFlowLoader } from './login-flow/login-flow-loader';
import { DeviceLimitFlow } from './device-limit-flow';
import { useLoginDeviceLimitFlow } from './device-limit-flow/use-device-limit-flow';
import { GlobalExtensionConsent } from './global-extension-consent/global-extension-consent';
import { useGlobalExtensionSettings } from './global-extension-settings/useGlobalExtensionSettings';
import { useTeamSignUpDetection } from './hooks/use-team-signup-detection';
import styles from './styles.css';
import { useAcceptTeamInvite } from './hooks/use-accept-team-invite';
export enum MarketingContentType {
    DashlaneBusiness = 'dashlaneBusiness',
    Standard = 'standard'
}
export interface AuthOptions {
    marketingContentType?: MarketingContentType;
    requiredPermissions?: AdminPermissionLevel;
}
interface AuthProps {
    options?: AuthOptions;
}
export const Auth = ({ children, options: { marketingContentType } = {
    marketingContentType: MarketingContentType.Standard,
}, }: PropsWithChildren<AuthProps>) => {
    const { pathname } = useLocation();
    useTeamSignUpDetection();
    const isEmployeeSignUpPage = pathname === EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT;
    const initNeedsConsent = APP_PACKAGED_FOR_FIREFOX ? undefined : false;
    const [needsConsent, setNeedsConsent] = useState<boolean | undefined>(initNeedsConsent);
    const { getIsConsentNeeded, setUserConsent } = useGlobalExtensionSettings();
    useEffect(() => {
        if (needsConsent === undefined) {
            const consentPromises = Promise.all([
                carbonConnector.getLocalAccountsList(null),
                getIsConsentNeeded(),
            ]);
            consentPromises.then(([{ localAccounts = [] }, consentNeeded]) => {
                const isUserGivingConsent = localAccounts.length > 0 || !consentNeeded;
                setUserConsent({
                    interactionDataConsent: isUserGivingConsent,
                    personalDataConsent: isUserGivingConsent,
                });
                setNeedsConsent(!isUserGivingConsent);
            });
        }
    }, []);
    const handleConsentSet = async (consents: RequiredExtensionSettings) => {
        await setUserConsent(consents);
        setNeedsConsent(false);
    };
    useAcceptTeamInvite();
    const deviceLimitStage = useLoginDeviceLimitFlow();
    if (needsConsent === undefined || deviceLimitStage === undefined) {
        return <LoginFlowLoader />;
    }
    return (<>
      {deviceLimitStage ? (<DeviceLimitFlow stage={deviceLimitStage}/>) : (<div sx={{ backgroundColor: 'ds.container.agnostic.neutral.supershy' }} className={styles.panelsContainer}>
          {isEmployeeSignUpPage ? (<TeamSignUpContainer />) : marketingContentType === MarketingContentType.DashlaneBusiness ? (<DashlaneBusinessMarketingContainer />) : (<StandardMarketingContainer />)}

          <div className={classnames(styles.panelContainer, {
                [styles.globalConsentLayout]: needsConsent,
                [styles.loginPanelContainer]: pathname === LOGIN_URL_SEGMENT,
                [styles.accountCreationPanelContainer]: pathname !== LOGIN_URL_SEGMENT,
            })}>
            {needsConsent ? (<GlobalExtensionConsent handleConsentSet={handleConsentSet}/>) : (children)}
          </div>
        </div>)}
      <LoginNotifications />
    </>);
};
