import { useEffect, useState } from 'react';
import { Lee } from 'lee';
import { PremiumStatusCode, WebOnboardingLeelooStep, } from '@dashlane/communication';
import { DarkWebIcon, IdIcon, NotesIcon, PasswordHealthIcon, PasswordsIcon, PaymentsIcon, PersonalInfoIcon, SharingCenterIcon, ShieldOutlinedIcon, UnlockFillIcon, VpnIcon, } from '@dashlane/ui-components';
import { Icon, jsx } from '@dashlane/design-system';
import { useFeatureFlips } from '@dashlane/framework-react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { getCurrentSpace, getCurrentTeamId } from 'libs/carbon/spaces';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { getCurrentSpaceId } from 'libs/webapp';
import { userSwitchedSpace } from 'libs/webapp/reducer';
import { useIsTeamCreator } from 'team/get-started/hooks/use-is-team-creator';
import { useShouldDisplayAdminVaultGetStartedGuide } from 'team/settings/hooks/use-display-admin-vault-getstarted';
import { Menu } from 'webapp/sidemenu/menu';
import { setOnboardingMode } from 'webapp/onboarding/services';
import { hasPremiumPlusCapabilities } from 'webapp/premium-plus/display';
import { useIsPasskeysSidemenuEnabled } from 'webapp/vault/passkeys/use-is-passkeys-sidemenu-enabled';
import { PaywalledCapability, shouldShowPaywall, } from 'webapp/paywall/manager/paywall-manager';
import { useVpnMenuItem } from 'webapp/vpn';
import { useSideMenuCollapsedContext } from './side-menu-collapsed-context';
import styles from './styles.css';
const SAEXONBOARDING_HUB_ADD_PASSWORDS_FF = FEATURE_FLIPS_WITHOUT_MODULE.SaexOnboardingHubAddPasswords;
const PASSWORD_HEALTH_FF = FEATURE_FLIPS_WITHOUT_MODULE.PasswordHealthWeb;
const DARK_WEB_MONITORING_FF = FEATURE_FLIPS_WITHOUT_MODULE.DarkwebMonitoringWebRelease;
const SECRET_MANAGEMENT_FF_DEV = FEATURE_FLIPS_WITHOUT_MODULE.SecretManagementDev;
const I18N_KEYS = {
    DARKWEB: 'webapp_sidemenu_item_darkweb',
    PASSWORDS: 'webapp_sidemenu_item_passwords',
    PASSKEYS: 'webapp_sidemenu_item_passkeys',
    SECURE_NOTES: 'webapp_sidemenu_item_secure_notes',
    SECRETS: 'webapp_sidemenu_item_secrets',
    PERSONAL_INFO: 'webapp_sidemenu_item_personal_info',
    PAYMENTS: 'webapp_sidemenu_item_payments',
    SHARING_CENTER: 'webapp_sharing_center_navigation',
    PASSWORD_HEALTH: 'webapp_sidemenu_item_password_health',
    PREMIUM_PLUS: 'webapp_sidemenu_item_premium_plus',
    VPN: 'webapp_sidemenu_item_vpn',
    IDS: 'webapp_sidemenu_item_ids',
    ONBOARDING_AUTOLOGIN_COMPLETED: 'web_onboarding_autologin_completed_title',
    ONBOARDING_AUTOLOGIN_CANCEL: 'web_onboarding_autologin_completed_cancel',
};
interface Props {
    lee: Lee;
}
export const SideMenu = ({ lee }: Props) => {
    const accountInfo = useAccountInfo();
    const { isSideMenuCollapsed } = useSideMenuCollapsedContext();
    const [internallyCollapsedForSearch, setInternallyCollapsedForSearch] = useState(false);
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    useEffect(() => {
        const isUserInTeam = getCurrentTeamId(lee.globalState) !== null;
        const isCurrentSpaceAllSpaces = getCurrentSpaceId(lee.globalState) === null;
        if ((!isUserInTeam ||
            (isUserInTeam &&
                isPersonalSpaceDisabled.status === DataStatus.Success &&
                isPersonalSpaceDisabled.isDisabled)) &&
            !isCurrentSpaceAllSpaces) {
            lee.dispatchGlobal(userSwitchedSpace(null));
        }
    }, [isPersonalSpaceDisabled, lee]);
    const { routes } = useRouterGlobalSettingsContext();
    const retrievedFFStatus = useFeatureFlips();
    const isPasskeysSidemenuEnabled = useIsPasskeysSidemenuEnabled();
    const hasSpaceId = !!getCurrentSpace(lee.globalState);
    const isTeamCreatorResult = useIsTeamCreator();
    const shouldDisplayAdminVaultGetStartedGuide = useShouldDisplayAdminVaultGetStartedGuide();
    const hasLegacyFeatureFlip = retrievedFFStatus.status === DataStatus.Success
        ? !!retrievedFFStatus.data[SAEXONBOARDING_HUB_ADD_PASSWORDS_FF]
        : false;
    const hasLegacyOnboarding = () => {
        const isInExtensionOrDesktop = APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
        const isTeamCreator = isTeamCreatorResult.status === DataStatus.Success &&
            isTeamCreatorResult.isTeamCreator;
        return isInExtensionOrDesktop && hasLegacyFeatureFlip && !isTeamCreator;
    };
    const hasAdminVaultGetStartedGuide = () => {
        if (shouldDisplayAdminVaultGetStartedGuide.status === DataStatus.Success) {
            return shouldDisplayAdminVaultGetStartedGuide.shouldDisplayAdminVaultGetStartedGuide;
        }
        return false;
    };
    const hasOnboardingPage = () => hasLegacyOnboarding() || hasAdminVaultGetStartedGuide();
    const isAddPasswordStepCompleted = () => {
        const { leelooStep, completedSteps } = lee.carbon.webOnboardingMode;
        return (APP_PACKAGED_IN_EXTENSION &&
            completedSteps &&
            completedSteps.saveCredentialOnWeb &&
            completedSteps.loginCredentialOnWeb &&
            leelooStep ===
                WebOnboardingLeelooStep.SHOW_WEB_SAVE_AND_AUTOLOGIN_COMPLETED);
    };
    const handleLoginAndSaveSuccessClose = () => {
        setOnboardingMode({
            leelooStep: null,
        });
    };
    const isPasswordHealthEnabled = retrievedFFStatus.status === DataStatus.Success
        ? !!retrievedFFStatus.data[PASSWORD_HEALTH_FF]
        : false;
    const isDarkWebMonitoringEnabled = retrievedFFStatus.status === DataStatus.Success
        ? !!retrievedFFStatus.data[DARK_WEB_MONITORING_FF]
        : false;
    const isSecretManagementEnabled = retrievedFFStatus.status === DataStatus.Success &&
        !!retrievedFFStatus.data[SECRET_MANAGEMENT_FF_DEV];
    const isMaintenanceCategoryEnabled = isPasswordHealthEnabled || isDarkWebMonitoringEnabled;
    const isPremiumPlusEnabled = hasPremiumPlusCapabilities(accountInfo?.premiumStatus?.capabilities);
    const shouldDisplaySecureNotesPaywall = shouldShowPaywall(PaywalledCapability.SecureNotes, accountInfo?.premiumStatus?.capabilities);
    const shouldDisplayDarkwebPaywall = shouldShowPaywall(PaywalledCapability.DataLeak, accountInfo?.premiumStatus?.capabilities);
    const vpnMenuItem = useVpnMenuItem(isSideMenuCollapsed || internallyCollapsedForSearch, styles.comingSoonNotification);
    if (vpnMenuItem?.showVpnPage === undefined ||
        vpnMenuItem?.showVpnMenuItem === undefined ||
        vpnMenuItem?.vpnPaywallInfo === undefined ||
        vpnMenuItem?.getVpnDisabledNotification === undefined ||
        !accountInfo) {
        return null;
    }
    const topMenu = [
        {
            to: routes.userCredentials,
            icon: PasswordsIcon,
            text: I18N_KEYS.PASSWORDS,
            enabledNotification: isAddPasswordStepCompleted()
                ? {
                    showNotification: !isSideMenuCollapsed && !internallyCollapsedForSearch,
                    notificationClass: styles.comingSoonNotification,
                    title: I18N_KEYS.ONBOARDING_AUTOLOGIN_COMPLETED,
                    description: '',
                    cancelLabel: I18N_KEYS.ONBOARDING_AUTOLOGIN_CANCEL,
                    onCancel: handleLoginAndSaveSuccessClose,
                }
                : undefined,
        },
        {
            to: routes.userPasskeys,
            icon: () => <Icon name="PasskeyOutlined"/>,
            text: I18N_KEYS.PASSKEYS,
            hidden: !isPasskeysSidemenuEnabled,
        },
        {
            to: routes.userPayments,
            icon: PaymentsIcon,
            text: I18N_KEYS.PAYMENTS,
        },
        {
            to: routes.userSecureNotes,
            icon: NotesIcon,
            text: I18N_KEYS.SECURE_NOTES,
            showPaywallTag: shouldDisplaySecureNotesPaywall,
        },
        {
            to: routes.userSecrets,
            icon: () => <Icon name="RecoveryKeyOutlined"/>,
            text: I18N_KEYS.SECRETS,
            hidden: !isSecretManagementEnabled,
        },
        {
            to: routes.userPersonalInfo,
            icon: PersonalInfoIcon,
            text: I18N_KEYS.PERSONAL_INFO,
        },
        {
            to: routes.userIdsDocuments,
            icon: IdIcon,
            text: I18N_KEYS.IDS,
        },
        {
            to: routes.userSharingCenter,
            icon: SharingCenterIcon,
            text: I18N_KEYS.SHARING_CENTER,
        },
    ];
    const premiumStatusCode = accountInfo?.premiumStatus?.statusCode;
    const centerMenu = [
        {
            to: routes.userPasswordHealth,
            icon: PasswordHealthIcon,
            text: I18N_KEYS.PASSWORD_HEALTH,
            hidden: !isPasswordHealthEnabled,
        },
        {
            to: routes.darkWebMonitoring,
            icon: DarkWebIcon,
            text: I18N_KEYS.DARKWEB,
            collapsedChip: isSideMenuCollapsed &&
                !shouldDisplayDarkwebPaywall &&
                premiumStatusCode === PremiumStatusCode.NO_PREMIUM
                ? UnlockFillIcon
                : undefined,
            rightIcon: !shouldDisplayDarkwebPaywall &&
                premiumStatusCode === PremiumStatusCode.NO_PREMIUM
                ? UnlockFillIcon
                : undefined,
            showPaywallTag: shouldDisplayDarkwebPaywall,
            hidden: !isDarkWebMonitoringEnabled,
        },
        {
            to: routes.vpn,
            icon: VpnIcon,
            text: I18N_KEYS.VPN,
            disabled: !vpnMenuItem.showVpnPage,
            hidden: !vpnMenuItem.showVpnMenuItem,
            disabledNotification: vpnMenuItem.getVpnDisabledNotification(),
            showPaywallTag: vpnMenuItem.vpnPaywallInfo.isVisible &&
                !shouldDisplayDarkwebPaywall &&
                !shouldDisplaySecureNotesPaywall,
        },
        {
            to: routes.premiumPlus,
            icon: ShieldOutlinedIcon,
            text: I18N_KEYS.PREMIUM_PLUS,
            hidden: !isPremiumPlusEnabled,
        },
    ];
    return (<Menu centerMenu={centerMenu} hasOnboardingPage={hasOnboardingPage} hasSpaceId={hasSpaceId} internallyCollapsedForSearch={internallyCollapsedForSearch} isMaintenanceCategoryEnabled={isMaintenanceCategoryEnabled} lee={lee} setInternallyCollapsedForSearch={setInternallyCollapsedForSearch} topMenu={topMenu}/>);
};
