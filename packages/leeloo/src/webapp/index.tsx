import { ReactElement, useEffect, useRef } from 'react';
import { ThemeUIStyleObject } from '@dashlane/ui-components';
import { jsx } from '@dashlane/design-system';
import { SessionSyncStatus } from '@dashlane/communication';
import { Lee } from 'lee';
import fontVariables from 'libs/dashlane-style/globals/font-variables.css';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { useBraze } from 'libs/hooks/useBraze';
import { useB2BTrialBannerConditions } from 'libs/hooks/use-b2b-trial-banner-conditions';
import { useExecuteCategoriesMigration } from 'libs/hooks/use-execute-categories-migration';
import { PaywallProvider } from 'libs/paywall/paywallContext';
import { B2BTrialDaysLeftBanner } from 'libs/trial/banners/b2b-days-left-banner';
import { B2CTrialDaysLeftBanner } from 'libs/trial/banners/b2c-days-left-banner';
import { Redirect, RouteChildrenProps } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { ExtendTrialDialogFlow } from 'libs/trial/trial-dialogs/extend-trial-dialog-flow';
import { TrialDiscontinuedDialogProvider } from 'libs/trial/trialDiscontinuationDialogContext';
import { AdminAccess } from 'user/permissions';
import { RecoveryActivationDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs';
import { TeamSpaceContextProvider } from 'team/settings/components/TeamSpaceContext';
import { ChangeMasterPasswordProgress } from './change-master-password-progress/change-master-password-progress';
import { DialogContextProvider } from './dialog';
import { setupDefaultNoteCategories } from './secure-notes/helpers';
import { SideMenu } from './sidemenu/side-menu';
import { useShouldEnforceTwoFactorAuthentication } from './two-factor-authentication/business/hooks/use-should-enforce-two-factor-authentication';
import { ProtectedItemsUnlockerProvider } from './unlock-items';
import { accountPanelIgnoreClickOutsideClassName, allIgnoreClickOutsideClassName, TOAST_PORTAL_ID, } from './variables';
import { CollectionsProvider } from './vault/collections-context';
import { WebStoreDialog } from './web-store-dialog';
import { OnboardingActionNotifications } from './notifications/onboarding-action-notifications';
import { TacShareItemNotification } from './team-console/tac-share-item-notification';
import { AccountSettingsPanelProvider } from './account/account-settings-panel-context';
import { SideMenuCollapsedProvider } from './sidemenu/side-menu-collapsed-context';
import { useWebappLogoutDialogContext, WebappLogoutDialogProvider, } from './webapp-logout-dialog-context';
import styles from './styles.css';
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
    MAIN_WITH_TRIAL_BANNER: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1',
        opacity: '1',
        height: '100vh',
    },
    MAIN: {
        flex: '1 1',
        opacity: '1',
        height: '100%',
        fontFamily: fontVariables['--dashlane-fontfamily-primary'],
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'ds.background.default',
    },
};
interface AdminAccessProp {
    adminAccess: AdminAccess;
}
const ExtendTrialDialogs = ({ adminAccess }: AdminAccessProp) => {
    const { isLogoutDialogOpen } = useWebappLogoutDialogContext();
    const canShowExtendTrialDialogs = adminAccess.hasBillingAccess ||
        (adminAccess.hasFullAccess && !isLogoutDialogOpen);
    return canShowExtendTrialDialogs ? <ExtendTrialDialogFlow /> : null;
};
const TrialBanner = ({ adminAccess }: AdminAccessProp) => {
    const canShowB2BTrialBanner = useB2BTrialBannerConditions(adminAccess);
    return canShowB2BTrialBanner ? (<B2BTrialDaysLeftBanner />) : (<B2CTrialDaysLeftBanner />);
};
type Props = RouteChildrenProps & {
    children: ReactElement<unknown>;
    lee: Lee;
};
const CategoriesMigration = () => {
    useExecuteCategoriesMigration();
    return null;
};
const EnforceTwoFactorAuthentication = () => {
    const { routes } = useRouterGlobalSettingsContext();
    const { data: shouldEnforceTwoFactorAuthentication } = useShouldEnforceTwoFactorAuthentication();
    return shouldEnforceTwoFactorAuthentication ? (<Redirect to={routes.twoFactorAuthenticationEnforce}/>) : null;
};
export const NoSideBarWebapp = (props: {
    children: ReactElement;
}) => {
    return <div>{props.children}</div>;
};
export const Webapp = ({ lee, history, children }: Props) => {
    const unsubscribeSync = useRef<() => void>(() => { });
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    useBraze();
    const handleClickOpenUserVault = () => {
        return history.push(routes.clientRoutesBasePath);
    };
    useEffect(() => {
        setupDefaultNoteCategories(translate);
        unsubscribeSync.current = carbonConnector.sessionSyncStatus.on((data: SessionSyncStatus) => {
            if (data.status === 'success') {
                setupDefaultNoteCategories(translate);
            }
        });
        return () => {
            unsubscribeSync.current?.();
        };
    }, []);
    const adminAccess = lee.permission.adminAccess;
    return (<TeamSpaceContextProvider lee={lee}>
      <div id="dashlane-dialog"/>
      <TacShareItemNotification />
      <DialogContextProvider>
        <div className={styles.container}>
          <ProtectedItemsUnlockerProvider>
            <WebappLogoutDialogProvider dispatchGlobal={lee.dispatchGlobal}>
              <TrialDiscontinuedDialogProvider adminAccess={adminAccess}>
                <AccountSettingsPanelProvider lee={lee}>
                  <CollectionsProvider>
                    <SideMenuCollapsedProvider>
                      <SideMenu lee={lee}/>
                      <div sx={SX_STYLES.MAIN_WITH_TRIAL_BANNER}>
                        <TrialBanner adminAccess={adminAccess}/>
                        <main tabIndex={-1} sx={SX_STYLES.MAIN}>
                          
                          <PaywallProvider>{children}</PaywallProvider>
                          
                          <div className={`${styles.alertPopup} ${accountPanelIgnoreClickOutsideClassName}`} id="alert-popup-portal"/>
                          <div className={allIgnoreClickOutsideClassName} id={TOAST_PORTAL_ID}/>
                        </main>
                      </div>
                    </SideMenuCollapsedProvider>
                  </CollectionsProvider>
                  
                  <div id="side-panel-portal"/>
                  <OnboardingActionNotifications flowLoginCredentialOnWeb={lee.carbon.webOnboardingMode.flowLoginCredentialOnWeb} leelooStep={lee.carbon.webOnboardingMode.leelooStep} popoverStep={lee.carbon.webOnboardingMode.popoverStep}/>
                  <ChangeMasterPasswordProgress onOpenUserVault={handleClickOpenUserVault}/>
                </AccountSettingsPanelProvider>
                <ExtendTrialDialogs adminAccess={adminAccess}/>
              </TrialDiscontinuedDialogProvider>
            </WebappLogoutDialogProvider>
          </ProtectedItemsUnlockerProvider>
          <RecoveryActivationDialog />
          <WebStoreDialog />
          <CategoriesMigration />
          <EnforceTwoFactorAuthentication />
        </div>
      </DialogContextProvider>
    </TeamSpaceContextProvider>);
};
