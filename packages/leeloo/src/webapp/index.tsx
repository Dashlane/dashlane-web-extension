import { ReactElement } from "react";
import { ThemeUIStyleObject } from "@dashlane/ui-components";
import { AdminAssistedRecoveryActivationNotificationToast } from "../account-recovery/admin-assisted-recovery/recovery-notification/adminAssistedRecoveryActivationNotificationToast";
import { Lee } from "../lee";
import { BannerController } from "../libs/banners";
import fontVariables from "../libs/dashlane-style/globals/font-variables.css";
import { FrozenStateDialogProvider } from "../libs/frozen-state/frozen-state-dialog-context";
import { CustomBrazeWrapper } from "../libs/braze/braze-main-wrapper";
import { useBraze } from "../libs/hooks/useBraze";
import { PaywallProvider } from "../libs/paywall/paywallContext";
import { Redirect, RouteChildrenProps } from "../libs/router";
import { useRouterGlobalSettingsContext } from "../libs/router/RouterGlobalSettingsProvider";
import { ExtendTrialDialogFlow } from "../libs/trial/trial-dialogs/extend-trial-dialog-flow";
import { SSOActivatedDialog } from "../sso/migration-dialogs/sso-activated/sso-activated-dialog";
import { TeamSpaceContextProvider } from "../team/settings/components/TeamSpaceContext";
import { AdminAccess } from "../user/permissions";
import { AccountSettingsPanelProvider } from "./account/account-settings-panel-context";
import { SettingsEnforcementWrapper } from "./account/security-settings/settings-enforcement-wrapper/settings-enforcement-wrapper";
import { ChangeMasterPasswordProgress } from "./change-master-password-progress/change-master-password-progress";
import { CollectionsProvider } from "./collections/collections-context";
import { DialogContextProvider } from "./dialog";
import { OnboardingActionNotifications } from "./notifications/onboarding-action-notifications";
import { SearchProvider } from "./search/search-context";
import { SearchWrapper } from "./search/search-wrapper";
import { SideMenu } from "./sidemenu/side-menu";
import { SideMenuCollapsedProvider } from "./sidemenu/side-menu-collapsed-context";
import styles from "./styles.css";
import { useShouldEnforceTwoFactorAuthentication } from "./two-factor-authentication/business/hooks/use-should-enforce-two-factor-authentication";
import { ProtectedItemsUnlockerProvider } from "./unlock-items";
import {
  accountPanelIgnoreClickOutsideClassName,
  allIgnoreClickOutsideClassName,
  TOAST_PORTAL_ID,
} from "./variables";
import { WebStoreDialog } from "./web-store-dialog";
import {
  useWebappLogoutDialogContext,
  WebappLogoutDialogProvider,
} from "./webapp-logout-dialog-context";
const BANNER_HEIGHT = "34";
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
  MAIN_WITH_TRIAL_BANNER: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1",
    opacity: "1",
    height: "100vh",
    backgroundColor: "ds.background.default",
    overflow: "auto",
  },
  MAIN: {
    flex: "1 1",
    opacity: "1",
    fontFamily: fontVariables["--dashlane-fontfamily-primary"],
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "ds.background.default",
    height: "100%",
    "&:not(:first-child)": {
      height: `calc(100% - ${BANNER_HEIGHT}px)`,
    },
  },
};
interface AdminAccessProp {
  adminAccess: AdminAccess;
}
const ExtendTrialDialogs = ({ adminAccess }: AdminAccessProp) => {
  const { isLogoutDialogOpen } = useWebappLogoutDialogContext();
  const canShowExtendTrialDialogs =
    adminAccess.hasBillingAccess ||
    (adminAccess.hasFullAccess && !isLogoutDialogOpen);
  return canShowExtendTrialDialogs ? <ExtendTrialDialogFlow /> : null;
};
type Props = RouteChildrenProps & {
  children: ReactElement<unknown>;
  lee: Lee;
};
const EnforceTwoFactorAuthentication = () => {
  const { routes } = useRouterGlobalSettingsContext();
  const { data: shouldEnforceTwoFactorAuthentication } =
    useShouldEnforceTwoFactorAuthentication();
  return shouldEnforceTwoFactorAuthentication ? (
    <Redirect to={routes.twoFactorAuthenticationEnforce} />
  ) : null;
};
export const NoSideBarWebapp = (props: { children: ReactElement }) => {
  return <div>{props.children}</div>;
};
export const Webapp = ({ lee, children }: Props) => {
  useBraze();
  const adminAccess = lee.permission.adminAccess;
  return (
    <TeamSpaceContextProvider lee={lee}>
      <div id="dashlane-dialog" />
      <DialogContextProvider>
        <SettingsEnforcementWrapper>
          <div className={styles.container}>
            <ProtectedItemsUnlockerProvider>
              <WebappLogoutDialogProvider dispatchGlobal={lee.dispatchGlobal}>
                <FrozenStateDialogProvider adminAccess={adminAccess}>
                  <AccountSettingsPanelProvider lee={lee}>
                    <CollectionsProvider>
                      <SearchProvider>
                        <SideMenuCollapsedProvider>
                          <SearchWrapper />
                          <SideMenu lee={lee} />
                          <div sx={SX_STYLES.MAIN_WITH_TRIAL_BANNER}>
                            <BannerController adminAccess={adminAccess} />
                            <main tabIndex={-1} sx={SX_STYLES.MAIN}>
                              <PaywallProvider>{children}</PaywallProvider>

                              <div
                                className={`${styles.alertPopup} ${accountPanelIgnoreClickOutsideClassName}`}
                                id="alert-popup-portal"
                              />
                              <div
                                className={allIgnoreClickOutsideClassName}
                                id={TOAST_PORTAL_ID}
                              />
                            </main>
                          </div>
                        </SideMenuCollapsedProvider>
                      </SearchProvider>
                    </CollectionsProvider>
                    <OnboardingActionNotifications
                      flowLoginCredentialOnWeb={
                        lee.carbon.webOnboardingMode.flowLoginCredentialOnWeb
                      }
                      leelooStep={lee.carbon.webOnboardingMode.leelooStep}
                      popoverStep={lee.carbon.webOnboardingMode.popoverStep}
                    />
                    <ChangeMasterPasswordProgress />
                    <CustomBrazeWrapper />
                  </AccountSettingsPanelProvider>
                  <ExtendTrialDialogs adminAccess={adminAccess} />
                </FrozenStateDialogProvider>
              </WebappLogoutDialogProvider>
            </ProtectedItemsUnlockerProvider>
            <AdminAssistedRecoveryActivationNotificationToast />
            <SSOActivatedDialog />
            <WebStoreDialog />
            <EnforceTwoFactorAuthentication />
          </div>
        </SettingsEnforcementWrapper>
      </DialogContextProvider>
    </TeamSpaceContextProvider>
  );
};
