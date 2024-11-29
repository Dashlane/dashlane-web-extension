import { useEffect, useState } from "react";
import {
  PremiumStatusCode,
  WebOnboardingLeelooStep,
} from "@dashlane/communication";
import { useFeatureFlips } from "@dashlane/framework-react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { AvailableFeatureFlips } from "@dashlane/onboarding-contracts";
import { IconName } from "@dashlane/design-system";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { Lee } from "../../lee";
import { getCurrentSpace, getCurrentTeamId } from "../../libs/carbon/spaces";
import { useIsPersonalSpaceDisabled } from "../../libs/hooks/use-is-personal-space-disabled";
import { useAccountInfo } from "../../libs/carbon/hooks/useAccountInfo";
import { useRouterGlobalSettingsContext } from "../../libs/router";
import { getCurrentSpaceId } from "../../libs/webapp";
import { userSwitchedSpace } from "../../libs/webapp/reducer";
import { useIsTeamCreator } from "../../team/hooks/use-is-team-creator";
import { useShouldDisplayAdminVaultGetStartedGuide } from "../../team/settings/hooks/use-display-admin-vault-getstarted";
import { Menu } from "./menu";
import { setOnboardingMode } from "../onboarding/services";
import { hasPremiumPlusCapabilities } from "../premium-plus/display";
import { useHasSecretManagement } from "../secrets/hooks/use-has-secret-management";
import { useIsPasskeysSidemenuEnabled } from "../passkeys/use-is-passkeys-sidemenu-enabled";
import {
  PaywalledCapability,
  shouldShowPaywall,
} from "../paywall/manager/paywall-manager";
import { useVpnMenuItem } from "../vpn";
import { useSideMenuCollapsedContext } from "./side-menu-collapsed-context";
import styles from "./styles.css";
const SAEXONBOARDING_HUB_ADD_PASSWORDS_FF =
  AvailableFeatureFlips.SaexOnboardingHubAddPasswords;
const I18N_KEYS = {
  DARKWEB: "webapp_sidemenu_item_darkweb",
  PASSWORDS: "webapp_sidemenu_item_passwords",
  PASSKEYS: "webapp_sidemenu_item_passkeys",
  SECURE_NOTES: "webapp_sidemenu_item_secure_notes",
  SECRETS: "webapp_sidemenu_item_secrets",
  SEARCH: "webapp_sidemenu_item_search",
  SETTINGS: "webapp_sidemenu_item_settings",
  PERSONAL_INFO: "webapp_sidemenu_item_personal_info",
  PAYMENTS: "webapp_sidemenu_item_payments",
  SHARING_CENTER: "webapp_sharing_center_navigation",
  PASSWORD_HEALTH: "webapp_sidemenu_item_password_health",
  PREMIUM_PLUS: "webapp_sidemenu_item_premium_plus",
  VPN: "webapp_sidemenu_item_vpn",
  IDS: "webapp_sidemenu_item_ids",
  ONBOARDING_AUTOLOGIN_COMPLETED: "web_onboarding_autologin_completed_title",
  ONBOARDING_AUTOLOGIN_CANCEL: "web_onboarding_autologin_completed_cancel",
};
const getFeatureFlipEnabled = (
  featureFlips: ReturnType<typeof useFeatureFlips>,
  flip: string
) => featureFlips.status === DataStatus.Success && !!featureFlips.data[flip];
interface Props {
  lee: Lee;
}
export const SideMenu = ({ lee }: Props) => {
  const accountInfo = useAccountInfo();
  const { isSideMenuCollapsed } = useSideMenuCollapsedContext();
  const [internallyCollapsedForSearch, setInternallyCollapsedForSearch] =
    useState(false);
  const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
  const hasSecretManagement = useHasSecretManagement();
  useEffect(() => {
    const isUserInTeam = getCurrentTeamId(lee.globalState) !== null;
    const isCurrentSpaceAllSpaces = getCurrentSpaceId(lee.globalState) === null;
    if (
      (!isUserInTeam ||
        (isUserInTeam &&
          isPersonalSpaceDisabled.status === DataStatus.Success &&
          isPersonalSpaceDisabled.isDisabled)) &&
      !isCurrentSpaceAllSpaces
    ) {
      lee.dispatchGlobal(userSwitchedSpace(null));
    }
  }, [isPersonalSpaceDisabled, lee]);
  const { routes } = useRouterGlobalSettingsContext();
  const featureFlips = useFeatureFlips();
  const isPasskeysSidemenuEnabled = useIsPasskeysSidemenuEnabled();
  const hasSpaceId = !!getCurrentSpace(lee.globalState);
  const isTeamCreatorResult = useIsTeamCreator();
  const shouldDisplayAdminVaultGetStartedGuide =
    useShouldDisplayAdminVaultGetStartedGuide();
  const isLegacyOnboardingEnabled = getFeatureFlipEnabled(
    featureFlips,
    SAEXONBOARDING_HUB_ADD_PASSWORDS_FF
  );
  const isSettingsRevampEnabled = getFeatureFlipEnabled(
    featureFlips,
    FEATURE_FLIPS_WITHOUT_MODULE.SettingsRevamp
  );
  const isInExtensionOrDesktop =
    APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
  const isTeamCreator =
    isTeamCreatorResult.status === DataStatus.Success &&
    isTeamCreatorResult.isTeamCreator;
  const hasLegacyOnboarding =
    isInExtensionOrDesktop && isLegacyOnboardingEnabled && !isTeamCreator;
  const hasAdminVaultGetStartedGuide =
    shouldDisplayAdminVaultGetStartedGuide.status === DataStatus.Success
      ? shouldDisplayAdminVaultGetStartedGuide.shouldDisplayAdminVaultGetStartedGuide
      : false;
  const { leelooStep, completedSteps } = lee.carbon.webOnboardingMode;
  const isAddPasswordStepCompleted =
    APP_PACKAGED_IN_EXTENSION &&
    completedSteps &&
    completedSteps.saveCredentialOnWeb &&
    completedSteps.loginCredentialOnWeb &&
    leelooStep ===
      WebOnboardingLeelooStep.SHOW_WEB_SAVE_AND_AUTOLOGIN_COMPLETED;
  const handleLoginAndSaveSuccessClose = () => {
    setOnboardingMode({
      leelooStep: null,
    });
  };
  const isPremiumPlusEnabled = hasPremiumPlusCapabilities(
    accountInfo?.premiumStatus?.capabilities
  );
  const shouldDisplaySecureNotesPaywall = shouldShowPaywall(
    PaywalledCapability.SecureNotes,
    accountInfo?.premiumStatus?.capabilities
  );
  const shouldDisplayDarkwebPaywall = shouldShowPaywall(
    PaywalledCapability.DataLeak,
    accountInfo?.premiumStatus?.capabilities
  );
  const vpnMenuItem = useVpnMenuItem(
    isSideMenuCollapsed || internallyCollapsedForSearch,
    styles.comingSoonNotification
  );
  if (
    vpnMenuItem?.showVpnPage === undefined ||
    vpnMenuItem?.showVpnMenuItem === undefined ||
    vpnMenuItem?.vpnPaywallInfo === undefined ||
    vpnMenuItem?.getVpnDisabledNotification === undefined ||
    !accountInfo
  ) {
    return null;
  }
  const topMenu = [
    {
      to: routes.userCredentials,
      iconName: "ItemLoginOutlined" as IconName,
      text: I18N_KEYS.PASSWORDS,
      enabledNotification: isAddPasswordStepCompleted
        ? {
            showNotification:
              !isSideMenuCollapsed && !internallyCollapsedForSearch,
            notificationClass: styles.comingSoonNotification,
            title: I18N_KEYS.ONBOARDING_AUTOLOGIN_COMPLETED,
            description: "",
            cancelLabel: I18N_KEYS.ONBOARDING_AUTOLOGIN_CANCEL,
            onCancel: handleLoginAndSaveSuccessClose,
          }
        : undefined,
    },
    {
      to: routes.userPasskeys,
      iconName: "PasskeyOutlined" as IconName,
      text: I18N_KEYS.PASSKEYS,
      hidden: !isPasskeysSidemenuEnabled,
    },
    {
      to: routes.userPayments,
      iconName: "ItemPaymentOutlined" as IconName,
      text: I18N_KEYS.PAYMENTS,
    },
    {
      to: routes.userSecureNotes,
      iconName: "ItemSecureNoteOutlined" as IconName,
      text: I18N_KEYS.SECURE_NOTES,
      showPaywallTag: shouldDisplaySecureNotesPaywall,
    },
    {
      to: routes.userSecrets,
      iconName: "ItemSecretOutlined" as IconName,
      text: I18N_KEYS.SECRETS,
      hidden: !hasSecretManagement,
    },
    {
      to: routes.userPersonalInfo,
      iconName: "ItemPersonalInfoOutlined" as IconName,
      text: I18N_KEYS.PERSONAL_INFO,
    },
    {
      to: routes.userIdsDocuments,
      iconName: "ItemIdOutlined" as IconName,
      text: I18N_KEYS.IDS,
    },
    {
      to: routes.userSharingCenter,
      iconName: "SharedOutlined" as IconName,
      text: I18N_KEYS.SHARING_CENTER,
    },
    {
      to: routes.userSettings,
      iconName: "SettingsOutlined" as IconName,
      text: I18N_KEYS.SETTINGS,
      hidden: !isSettingsRevampEnabled,
    },
  ];
  const premiumStatusCode = accountInfo?.premiumStatus?.statusCode;
  const centerMenu = [
    {
      to: routes.userPasswordHealth,
      iconName: "FeaturePasswordHealthOutlined" as IconName,
      text: I18N_KEYS.PASSWORD_HEALTH,
      hidden: false,
    },
    {
      to: routes.darkWebMonitoring,
      iconName: "FeatureDarkWebMonitoringOutlined" as IconName,
      text: I18N_KEYS.DARKWEB,
      collapsedChip:
        isSideMenuCollapsed &&
        !shouldDisplayDarkwebPaywall &&
        premiumStatusCode === PremiumStatusCode.NO_PREMIUM
          ? ("LockFilled" as IconName)
          : undefined,
      rightIcon:
        !shouldDisplayDarkwebPaywall &&
        premiumStatusCode === PremiumStatusCode.NO_PREMIUM
          ? ("LockFilled" as IconName)
          : undefined,
      showPaywallTag: shouldDisplayDarkwebPaywall,
      hidden: false,
    },
    {
      to: routes.vpn,
      iconName: "FeatureVpnOutlined" as IconName,
      text: I18N_KEYS.VPN,
      disabled: !vpnMenuItem.showVpnPage,
      hidden: !vpnMenuItem.showVpnMenuItem,
      disabledNotification: vpnMenuItem.getVpnDisabledNotification(),
      showPaywallTag: vpnMenuItem.vpnPaywallInfo.isVisible,
    },
    {
      to: routes.premiumPlus,
      iconName: "ProtectionOutlined" as IconName,
      text: I18N_KEYS.PREMIUM_PLUS,
      hidden: !isPremiumPlusEnabled,
    },
  ];
  return (
    <Menu
      centerMenu={centerMenu}
      hasOnboardingPage={hasLegacyOnboarding || hasAdminVaultGetStartedGuide}
      hasSpaceId={hasSpaceId}
      internallyCollapsedForSearch={internallyCollapsedForSearch}
      lee={lee}
      setInternallyCollapsedForSearch={setInternallyCollapsedForSearch}
      topMenu={topMenu}
    />
  );
};
