import { useEffect, useState } from "react";
import {
  HelpCenterArticleCta,
  PageView,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Dialog, Heading, Icon, Paragraph } from "@dashlane/design-system";
import { PremiumStatus, PremiumStatusCode } from "@dashlane/communication";
import { ActivePanel } from "../types";
import { DebugDataDialog } from "../../debug-data-dialog";
import { useUserLogin } from "../hooks/use-user-login";
import { useIsMPlessUser } from "../security-settings/hooks/use-is-mpless-user";
import { logLogoutEvent } from "../logs";
import { PanelGroup, PanelItem } from "./panel-entries/panel-entries";
import { Socials } from "./socials/socials";
import { SyncAction } from "./sync-action/sync-action";
import { isAccountFamilyAdmin } from "../../../libs/account/helpers";
import { onLinkClickOpenDashlaneUrl } from "../../../libs/external-urls";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { useIsPersonalSpaceDisabled } from "../../../libs/hooks/use-is-personal-space-disabled";
import { Link, useRouterGlobalSettingsContext } from "../../../libs/router";
import { useNodePremiumStatus } from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { useOpenTeamConsole } from "../../../libs/hooks/use-open-team-console";
import { TacTabs } from "../../../team/types";
interface RootPanelProps {
  premiumStatus: PremiumStatus;
  triggerSwitchPanel: (panelId: ActivePanel) => void;
  onClickLogout: () => void;
  onClickFamilyDashboard: () => void;
  secureExportEnabled: boolean;
}
const I18N_KEYS = {
  HEADER: "manage_subscription_account_menu_settings",
  GO_TO_TAC: "webapp_account_root_go_to_team_admin_console",
  ACCOUNT_DETAILS: "webapp_account_management_panel_heading",
  FAMILY_DASHBOARD: "webapp_account_root_item_family_dashboard",
  DEVICE_MANAGEMENT: "webapp_account_root_item_device_management",
  SECURITY_SETTINGS: "webapp_account_root_item_security_settings",
  IMPORT_EXPORT: "webapp_account_root_item_import_export_data",
  IMPORT_DATA: "webapp_account_root_import_data",
  ADD_DEVICE: "webapp_account_root_item_add_device",
  MANUAL_SYNC: "webapp_account_root_item_manual_sync",
  ALL_FEATURES: "webapp_account_root_item_access_all_features",
  REFER_FRIEND: "webapp_account_root_item_refer_a_friend",
  HELP_CENTER: "webapp_account_root_item_help_center",
  TERMS: "webapp_account_root_item_terms",
  PRIVACY_POLICY: "webapp_account_root_item_privacy_policy",
  DEPENDENCY_LIST: "webapp_account_root_dependencies_list",
  LOG_OUT: "webapp_account_root_item_log_out",
  EXPORT_DISABLED_MODAL_TITLE: "webapp_account_root_export_disabled_title",
  EXPORT_DISABLED_MODAL_CONTENT: "webapp_account_root_export_disabled_content",
  EXPORT_DISABLED_MODAL_CLOSE: "_common_toast_close_label",
  SOCIALS: "webapp_settings_find_us_social_media",
};
export const RootPanel = ({
  premiumStatus,
  triggerSwitchPanel,
  onClickLogout,
  onClickFamilyDashboard,
  secureExportEnabled,
}: RootPanelProps) => {
  const [exportDisabledModalOpen, setExportDisabledModalOpen] = useState(false);
  const { translate } = useTranslate();
  const { routes, store } = useRouterGlobalSettingsContext();
  const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
  const isPersonalSpaceEnabled =
    isPersonalSpaceDisabled.status === DataStatus.Success &&
    !isPersonalSpaceDisabled.isDisabled;
  const premiumData = useNodePremiumStatus();
  const { openTeamConsole } = useOpenTeamConsole();
  const userLogin = useUserLogin();
  const isVaultExportEnabled = !isPersonalSpaceEnabled
    ? premiumData.status === DataStatus.Success &&
      !!premiumData.data.b2bStatus?.currentTeam?.teamInfo?.vaultExportEnabled
    : true;
  const { status: isMPLessUserStatus, isMPLessUser } = useIsMPlessUser();
  useEffect(() => {
    logPageView(PageView.SettingsGeneral);
  }, []);
  const switchPanel = (panelId: Exclude<ActivePanel, "root">) => {
    const panelToPageView: Record<Exclude<ActivePanel, "root">, PageView> = {
      "account-details": PageView.SettingsAccount,
      "device-management": PageView.SettingsDeviceList,
      "security-settings": PageView.SettingsSecurity,
      "import-export-data": PageView.SettingsExport,
      "access-all-features": PageView.SettingsMoreFeatures,
      "account-recovery": PageView.SettingsSecurity,
    };
    logPageView(panelToPageView[panelId]);
    triggerSwitchPanel(panelId);
  };
  const getDashlaneUrlHandler =
    (params: { type: string; action: string }) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onLinkClickOpenDashlaneUrl(params)(e);
    };
  const handleClickOnLogout = () => {
    logLogoutEvent();
    onClickLogout();
  };
  const handleClickOnHelpCenter =
    (params: { type: string; action: string }) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      logEvent(
        new UserOpenHelpCenterEvent({
          helpCenterArticleCta: HelpCenterArticleCta.HelpCenter,
        })
      );
      logEvent(new UserOpenHelpCenterEvent({}));
      onLinkClickOpenDashlaneUrl(params)(e);
    };
  const handleClickTeamConsole = () => {
    openTeamConsole({
      email: userLogin,
      routeInExtension: routes.teamAccountRoutePath,
      routeInWebapp: TacTabs.ACCOUNT,
    });
  };
  const isBusinessAdmin =
    store.getState().user?.session?.permissions.tacAccessPermissions.size > 0 ??
    false;
  const isFamilyAdmin = isAccountFamilyAdmin(premiumStatus);
  const isPremiumOnly = premiumStatus.statusCode === PremiumStatusCode.PREMIUM;
  const isTrialOrPremiumOnly =
    isPremiumOnly || premiumStatus.statusCode === PremiumStatusCode.NEW_USER;
  const canTriggerManualSync =
    isTrialOrPremiumOnly ||
    premiumStatus.statusCode === PremiumStatusCode.PREMIUM_CANCELLED ||
    premiumStatus.statusCode === PremiumStatusCode.OLD_ACCOUNT;
  return (
    <section>
      <Heading
        as="h2"
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
        sx={{
          padding: "32px",
        }}
      >
        {translate(I18N_KEYS.HEADER)}
      </Heading>

      {isBusinessAdmin ? (
        <PanelGroup>
          <PanelItem>
            <button type="button" onClick={handleClickTeamConsole}>
              {translate(I18N_KEYS.GO_TO_TAC)}
            </button>
          </PanelItem>
        </PanelGroup>
      ) : null}

      <PanelGroup>
        <PanelItem>
          <button
            type="button"
            onClick={() => switchPanel(ActivePanel.AccountDetails)}
          >
            {translate(I18N_KEYS.ACCOUNT_DETAILS)}

            <Icon name="CaretRightOutlined" color="ds.text.neutral.standard" />
          </button>
        </PanelItem>

        <PanelItem>
          <button
            type="button"
            onClick={() => switchPanel(ActivePanel.DeviceManagement)}
          >
            {translate(I18N_KEYS.DEVICE_MANAGEMENT)}

            <Icon name="CaretRightOutlined" color="ds.text.neutral.standard" />
          </button>
        </PanelItem>

        <PanelItem>
          <button
            type="button"
            onClick={() => switchPanel(ActivePanel.SecuritySettings)}
          >
            {translate(I18N_KEYS.SECURITY_SETTINGS)}

            <Icon name="CaretRightOutlined" color="ds.text.neutral.standard" />
          </button>
        </PanelItem>

        <Dialog
          isOpen={exportDisabledModalOpen}
          actions={{
            primary: {
              children: translate(I18N_KEYS.EXPORT_DISABLED_MODAL_CLOSE),
              onClick: () => setExportDisabledModalOpen(false),
            },
          }}
          closeActionLabel={translate(I18N_KEYS.EXPORT_DISABLED_MODAL_CLOSE)}
          onClose={() => setExportDisabledModalOpen(false)}
          title={translate(I18N_KEYS.EXPORT_DISABLED_MODAL_TITLE)}
        >
          <Paragraph>
            {translate(I18N_KEYS.EXPORT_DISABLED_MODAL_CONTENT)}
          </Paragraph>
        </Dialog>

        {secureExportEnabled ? (
          <PanelItem>
            <button
              type="button"
              onClick={() => {
                if (isVaultExportEnabled) {
                  switchPanel(ActivePanel.ImportExportData);
                } else {
                  setExportDisabledModalOpen(true);
                }
              }}
            >
              {translate(I18N_KEYS.IMPORT_EXPORT)}

              <Icon
                name="CaretRightOutlined"
                color="ds.text.neutral.standard"
              />
            </button>
          </PanelItem>
        ) : null}

        <PanelItem>
          <Link to={`${routes.importData}`}>
            {translate(I18N_KEYS.IMPORT_DATA)}
          </Link>
        </PanelItem>

        {isFamilyAdmin ? (
          <PanelItem>
            <button type="button" onClick={onClickFamilyDashboard}>
              {translate(I18N_KEYS.FAMILY_DASHBOARD)}
            </button>
          </PanelItem>
        ) : null}
      </PanelGroup>

      {isMPLessUserStatus !== DataStatus.Success ? null : isMPLessUser ? (
        <PanelGroup>
          <PanelItem>
            <Link to={`${routes.deviceTransfer}`}>
              {translate(I18N_KEYS.ADD_DEVICE)}
            </Link>
          </PanelItem>
        </PanelGroup>
      ) : null}

      {canTriggerManualSync ? (
        <PanelGroup>
          <PanelItem>
            <SyncAction>{translate(I18N_KEYS.MANUAL_SYNC)}</SyncAction>
          </PanelItem>
        </PanelGroup>
      ) : null}

      <PanelGroup>
        <PanelItem>
          <Link to={`${routes.userReferral}`}>
            {translate(I18N_KEYS.REFER_FRIEND)}
          </Link>
        </PanelItem>
        <PanelItem>
          <a
            href="__REDACTED__"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClickOnHelpCenter({
              type: "account",
              action: "helpCenter",
            })}
          >
            {translate(I18N_KEYS.HELP_CENTER)}
            <Icon
              name="ActionOpenExternalLinkOutlined"
              color="ds.text.neutral.standard"
            />
          </a>
        </PanelItem>
      </PanelGroup>

      <PanelGroup>
        <PanelItem>
          <a
            href="__REDACTED__"
            target="_blank"
            rel="noopener noreferrer"
            onClick={getDashlaneUrlHandler({
              type: "account",
              action: "termsOfService",
            })}
          >
            {translate(I18N_KEYS.TERMS)}
            <Icon
              name="ActionOpenExternalLinkOutlined"
              color="ds.text.neutral.standard"
            />
          </a>
        </PanelItem>
        <PanelItem>
          <a
            href="__REDACTED__"
            target="_blank"
            rel="noopener noreferrer"
            onClick={getDashlaneUrlHandler({
              type: "account",
              action: "privacyPolicy",
            })}
          >
            {translate(I18N_KEYS.PRIVACY_POLICY)}
            <Icon
              name="ActionOpenExternalLinkOutlined"
              color="ds.text.neutral.standard"
            />
          </a>
        </PanelItem>
      </PanelGroup>

      <PanelGroup>
        <PanelItem>
          <Paragraph textStyle="ds.title.supporting.small">
            {translate(I18N_KEYS.SOCIALS)}
          </Paragraph>
        </PanelItem>
        <PanelItem>
          <Socials />
        </PanelItem>
      </PanelGroup>

      <PanelGroup>
        <PanelItem>
          <button type="button" onClick={() => handleClickOnLogout()}>
            {translate(I18N_KEYS.LOG_OUT)}
          </button>
        </PanelItem>
      </PanelGroup>

      <DebugDataDialog />
    </section>
  );
};
