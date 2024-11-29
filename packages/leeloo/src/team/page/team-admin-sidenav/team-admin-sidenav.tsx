import { PropsWithChildren, useContext } from "react";
import {
  AccordionDetails,
  AccordionSection,
  AccordionSummary,
  PropsOf,
  Sidenav,
  SidenavItem,
  SidenavMenu,
  Tooltip,
} from "@dashlane/ui-components";
import {
  Badge,
  DSStyleObject,
  Heading,
  Icon,
  mergeSx,
} from "@dashlane/design-system";
import {
  AccessPath,
  PageView,
  UserOpenDomainDarkWebMonitoringEvent,
} from "@dashlane/hermes";
import {
  AdminDataNotifications,
  AdminPermissionLevel,
  NotificationName,
} from "@dashlane/communication";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import { LoggedOutMonitoringFeatureFlips } from "@dashlane/risk-monitoring-contracts";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useFeatureFlips } from "@dashlane/framework-react";
import {
  TeamIntegrationsRoutes,
  TeamSettingsRoutes,
} from "../../../app/routes/constants";
import { NamedRoutes } from "../../../app/routes/types";
import { PermissionChecker } from "../../../user/permissions";
import { Link, useLocation } from "../../../libs/router";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useNotificationSeen } from "../../../libs/carbon/hooks/useNotificationStatus";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { useSideNavNotification } from "../../side-nav-notifications/use-side-nav-notification";
import { useBuyOrUpgradePaywallDetails } from "../../helpers/use-buy-or-upgrade-paywall-details";
import { useTeamSettings } from "../../settings/hooks/useTeamSettings";
import { useTeamSpaceContext } from "../../settings/components/TeamSpaceContext";
import { useAdvancedPoliciesPermission } from "../../settings/policies/paywall/use-advanced-policies-permision";
import { EventsReportingAccessContext } from "../../events-reporting-access/events-reporting-access-provider";
import { AccountRecoveryTooltip } from "./components/account-recovery-tooltip";
import {
  SX_STYLES as SIDENAV_LINK_SX_STYLES,
  SidenavLink,
} from "./components/sidenav-link";
import styles from "./styles.css";
import { useCapabilitiesEnabled } from "../../../libs/carbon/hooks/useCapabilities";
const I18N_KEYS = {
  DASHBOARD: "team_general",
  MEMBERS: "team_members",
  GROUPS: "team_groups",
  ACCOUNT_RECOVERY: "team_settings_menu_title_account_recovery",
  ACTIVITY: "team_activity",
  DIRECTORY_SYNC: "team_settings_menu_title_directory_sync",
  DUO: "team_settings_tab_duo",
  POLICIES: "team_settings_menu_title_policies",
  SETTINGS: "team_settings",
  EVENTS_REPORTING: "team_settings_menu_title_events_reporting",
  SSO: "team_settings_menu_title_single_sign_on",
  DARK_WEB_INSIGHTS_LABEL: "team_dashboard_dark_web_insights_heading",
  OPEN_VAULT_BUTTON: "webapp_sidemenu_open_vault_cta",
  UPGRADE: "team_upgrade_label",
  NEW: "team_new_label",
  GROUP_UPGRADE: "webapp_sidemenu_group_upgrade_label",
  SECURITY_TOOLS: "webapp_sidemenu_category_advanced_tools",
  INTEGRATIONS: "webapp_sidemenu_category_integrations",
  NUDGES: "webapp_sidemenu_nudges",
  RISK_DETECTION: "team_sidemenu_risk_detection",
};
const ACCORDION_STYLES: DSStyleObject = {
  backgroundColor: "ds.container.agnostic.inverse.standard",
  " > summary > div": {
    width: "-webkit-fill-available",
  },
  "&[open] > summary > div": {
    width: "-webkit-fill-available",
  },
  " > summary > div > div > svg": {
    margin: "8px 4px 8px 0",
  },
  "&[open]": {
    padding: 0,
  },
  "&[open] > div:nth-of-type(1)": {
    pointerEvents: "auto",
    padding: 0,
  },
  "svg, svg:hover": {
    fill: "ds.text.inverse.catchy",
  },
};
const DUO_FF = FEATURE_FLIPS_WITHOUT_MODULE.BBCOM238Duo;
const TRIAL_ACTIVITY_LOGS_FF = "monetization_extension_trial_activity_logs";
const LOMO_V2_FF = LoggedOutMonitoringFeatureFlips.RiskDetectionV2Prod;
const LOMO_V2_ON_DEMAND =
  LoggedOutMonitoringFeatureFlips.RiskDetectionV2OnDemand;
const NUDGES_FF = "ace_tac_slack_integration";
export interface TeamAdminSidenavProps {
  isCollapsed?: boolean;
  permissionChecker: PermissionChecker;
  routes: NamedRoutes;
  teamNotifications?: AdminDataNotifications;
}
const hasNotification = (
  notificationProp: keyof AdminDataNotifications,
  teamNotifications?: AdminDataNotifications
): boolean => (teamNotifications?.[notificationProp].length ?? 0) > 0;
export const TeamAdminSidenav = ({
  isCollapsed = false,
  permissionChecker,
  routes,
  teamNotifications,
}: TeamAdminSidenavProps) => {
  const { translate } = useTranslate();
  const SETTINGS_PATHS = {
    DUO: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.DUO}`,
    MASTER_PASSWORD_POLICIES: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.MASTER_PASSWORD_POLICIES}`,
    POLICIES: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.POLICIES}`,
  };
  const INTEGRATIONS_PATH = {
    INTEGRATIONS: `${routes.teamIntegrationsRoutePath}`,
    DIRECTORY_SYNC: `${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.DIRECTORY_SYNC}`,
    SSO: `${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.SSO}`,
    SIEM: `${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.SIEM}`,
    NUDGES: `${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.NUDGES}`,
  };
  const location = useLocation();
  const { unseen: isFirstVisit } = useNotificationSeen(
    NotificationName.TacDarkWebInsightsNewBadge
  );
  const { hasNewBreaches } = useSideNavNotification();
  const featureFlips = useFeatureFlips();
  const duoFlag = featureFlips.data?.[DUO_FF];
  const hasTrialActivityLogFF = featureFlips.data?.[TRIAL_ACTIVITY_LOGS_FF];
  const hasLOMoFF =
    featureFlips.data?.[LOMO_V2_FF] || featureFlips.data?.[LOMO_V2_ON_DEMAND];
  const hasNudgesFF = featureFlips.data?.[NUDGES_FF];
  const { shouldShowBuyOrUpgradePaywall, planType, isTrialOrGracePeriod } =
    useBuyOrUpgradePaywallDetails(permissionChecker.adminAccess) ?? {};
  const { teamId } = useTeamSpaceContext();
  const teamSetting = useTeamSettings(teamId);
  const teamTrialStatus = useTeamTrialStatus();
  const hasNudgesCapability = useCapabilitiesEnabled(["nudges"]);
  const hasRiskDetectionCapability = useCapabilitiesEnabled(["riskDetection"]);
  const hasEventsReportingAccess = useContext(EventsReportingAccessContext);
  const hasActivityLogPaywall = !(
    teamSetting.teamCapabilities?.activityLog.enabled ?? true
  );
  const displayUpgradeActivityLogBadge =
    hasActivityLogPaywall ||
    (hasTrialActivityLogFF && teamTrialStatus?.isFreeTrial);
  const { hasStarterPaywall, hasTrialBusinessPaywall } =
    useAdvancedPoliciesPermission();
  const showUpgradeSsoBadge =
    shouldShowBuyOrUpgradePaywall &&
    (planType === SpaceTier.Team || planType === SpaceTier.Starter);
  const showUpgradeNudgesBadge =
    !hasNudgesCapability && !(isTrialOrGracePeriod ?? true);
  const showUpgradeRiskDetectionBadge =
    !hasRiskDetectionCapability && !(isTrialOrGracePeriod ?? true);
  const showNewNudgesBadge = hasNudgesCapability || isTrialOrGracePeriod;
  const showNewRiskDetectionBadge =
    hasRiskDetectionCapability || isTrialOrGracePeriod;
  const isStandardPlan = planType === SpaceTier.Standard;
  const showGroupUpgradeLabel =
    !!teamSetting.teamCapabilities?.groupSharing.info?.limit || isStandardPlan;
  const showUpgradePoliciesBadge = hasStarterPaywall || hasTrialBusinessPaywall;
  const SIDENAV_ITEM_STYLE = mergeSx([
    SIDENAV_LINK_SX_STYLES.CONTAINER,
    SIDENAV_LINK_SX_STYLES.CONTAINER_ON_HOVER,
    isCollapsed ? SIDENAV_LINK_SX_STYLES.CONTAINER_COLLAPSED : {},
  ]);
  const SideNavItemWithRequiredPermissions = ({
    requiredPermission,
    children,
    ...props
  }: PropsWithChildren<
    PropsOf<typeof SidenavItem> & {
      requiredPermission: AdminPermissionLevel;
    }
  >) => {
    if (!permissionChecker.adminAccess.hasPermissionLevel(requiredPermission)) {
      return null;
    }
    return <SidenavItem {...props}>{children}</SidenavItem>;
  };
  return (
    <Sidenav collapsed={isCollapsed}>
      <SidenavMenu
        sx={{
          pointerEvents: "auto",
          backgroundColor: "ds.container.agnostic.inverse.standard",
          marginBottom: "40px",
        }}
      >
        <SideNavItemWithRequiredPermissions
          requiredPermission="FULL"
          collapsed={isCollapsed}
        >
          <Link to={routes.teamDashboardRoutePath}>
            <SidenavLink
              collapsed={isCollapsed}
              icon={<Icon name="DashboardOutlined" />}
              label={translate(I18N_KEYS.DASHBOARD)}
              selected={location.pathname === routes.teamDashboardRoutePath}
            />
          </Link>
        </SideNavItemWithRequiredPermissions>

        <SideNavItemWithRequiredPermissions
          requiredPermission="FULL"
          collapsed={isCollapsed}
        >
          <Link to={routes.teamMembersRoutePath}>
            <SidenavLink
              collapsed={isCollapsed}
              icon={<Icon name="UsersOutlined" />}
              label={translate(I18N_KEYS.MEMBERS)}
              selected={location.pathname === routes.teamMembersRoutePath}
            />
          </Link>
        </SideNavItemWithRequiredPermissions>

        <SideNavItemWithRequiredPermissions
          requiredPermission="GROUP_READ"
          collapsed={isCollapsed}
        >
          <Link to={routes.teamGroupsRoutePath}>
            <SidenavLink
              collapsed={isCollapsed}
              icon={<Icon name="GroupOutlined" />}
              label={translate(I18N_KEYS.GROUPS)}
              selected={location.pathname === routes.teamGroupsRoutePath}
              endAdornment={
                showGroupUpgradeLabel ? (
                  <Badge
                    mood="brand"
                    intensity="catchy"
                    label={translate(I18N_KEYS.GROUP_UPGRADE)}
                    layout="iconLeading"
                    iconName="PremiumOutlined"
                  />
                ) : null
              }
            />
          </Link>
        </SideNavItemWithRequiredPermissions>

        <SideNavItemWithRequiredPermissions
          requiredPermission="FULL"
          collapsed={isCollapsed}
        >
          <Link to={routes.teamActivityRoutePath}>
            <SidenavLink
              collapsed={isCollapsed}
              hasNotification={hasNotification(
                "accountRecoveryRequests",
                teamNotifications
              )}
              icon={<Icon name="ActivityLogOutlined" />}
              label={translate(I18N_KEYS.ACTIVITY)}
              selected={location.pathname.includes(
                routes.teamActivityRoutePath
              )}
              endAdornment={
                displayUpgradeActivityLogBadge ? (
                  <Badge
                    mood="brand"
                    intensity="catchy"
                    label={translate(I18N_KEYS.UPGRADE)}
                    layout="iconLeading"
                    iconName="PremiumOutlined"
                    data-testid="activity-badge"
                  />
                ) : null
              }
            />
          </Link>
        </SideNavItemWithRequiredPermissions>
      </SidenavMenu>
      {permissionChecker.adminAccess.hasFullAccess ? (
        <>
          <Heading
            as="h3"
            textStyle="ds.title.supporting.small"
            color="ds.text.inverse.quiet"
            sx={{ marginTop: "16px", marginLeft: "14px", marginBottom: "4px" }}
          >
            {translate(I18N_KEYS.SECURITY_TOOLS)}
          </Heading>
          <SidenavMenu>
            {hasLOMoFF ? (
              <SideNavItemWithRequiredPermissions
                requiredPermission="FULL"
                collapsed={isCollapsed}
              >
                <Link to={routes.loggedOutMonitoring}>
                  <SidenavLink
                    collapsed={isCollapsed}
                    icon={<Icon name="RiskDetectionOutlined" />}
                    label={translate(I18N_KEYS.RISK_DETECTION)}
                    endAdornment={
                      showUpgradeRiskDetectionBadge ? (
                        <Badge
                          mood="brand"
                          intensity="catchy"
                          label={translate(I18N_KEYS.GROUP_UPGRADE)}
                          layout="iconLeading"
                          iconName="PremiumOutlined"
                        />
                      ) : showNewRiskDetectionBadge ? (
                        <Badge
                          mood="brand"
                          intensity="catchy"
                          label={translate(I18N_KEYS.NEW)}
                          data-testid="crd-new-badge"
                        />
                      ) : null
                    }
                  />
                </Link>
              </SideNavItemWithRequiredPermissions>
            ) : null}
            {hasNudgesFF ? (
              <SideNavItemWithRequiredPermissions
                requiredPermission="FULL"
                collapsed={isCollapsed}
              >
                <Link
                  to={INTEGRATIONS_PATH.NUDGES}
                  onClick={() => logPageView(PageView.ToolsNudges)}
                >
                  <SidenavLink
                    collapsed={isCollapsed}
                    icon={<Icon name="FeatureAutomationsOutlined" />}
                    label={translate(I18N_KEYS.NUDGES)}
                    selected={location.pathname === INTEGRATIONS_PATH.NUDGES}
                    endAdornment={
                      showUpgradeNudgesBadge ? (
                        <Badge
                          mood="brand"
                          intensity="catchy"
                          label={translate(I18N_KEYS.GROUP_UPGRADE)}
                          layout="iconLeading"
                          iconName="PremiumOutlined"
                          data-testid="nudges-upgrade-badge"
                        />
                      ) : showNewNudgesBadge ? (
                        <Badge
                          mood="brand"
                          intensity="catchy"
                          label={translate(I18N_KEYS.NEW)}
                          data-testid="nudges-new-badge"
                        />
                      ) : null
                    }
                  />
                </Link>
              </SideNavItemWithRequiredPermissions>
            ) : null}
            <SideNavItemWithRequiredPermissions
              requiredPermission="FULL"
              collapsed={isCollapsed}
            >
              <Link
                to={routes.teamDarkWebInsightsRoutePath}
                onClick={() => {
                  logEvent(
                    new UserOpenDomainDarkWebMonitoringEvent({
                      accessPath: AccessPath.NavLeftMenuButton,
                      isFirstVisit: isFirstVisit,
                    })
                  );
                }}
              >
                <SidenavLink
                  collapsed={isCollapsed}
                  icon={<Icon name="FeatureDarkWebMonitoringOutlined" />}
                  label={translate(I18N_KEYS.DARK_WEB_INSIGHTS_LABEL)}
                  selected={
                    location.pathname === routes.teamDarkWebInsightsRoutePath
                  }
                  hasNotification={hasNewBreaches}
                />
              </Link>
            </SideNavItemWithRequiredPermissions>
          </SidenavMenu>
          <Heading
            as="h3"
            textStyle="ds.title.supporting.small"
            color="ds.text.inverse.quiet"
            sx={{ marginTop: "16px", marginLeft: "14px", marginBottom: "4px" }}
          >
            {translate(I18N_KEYS.SETTINGS)}
          </Heading>
          <SidenavMenu>
            <SideNavItemWithRequiredPermissions
              requiredPermission="FULL"
              collapsed={isCollapsed}
            >
              <Link to={SETTINGS_PATHS.POLICIES} style={{ width: "100%" }}>
                <SidenavLink
                  icon={<Icon name="SettingsOutlined" />}
                  collapsed={isCollapsed}
                  label={translate(I18N_KEYS.POLICIES)}
                  selected={location.pathname === SETTINGS_PATHS.POLICIES}
                  endAdornment={
                    showUpgradePoliciesBadge ? (
                      <Badge
                        mood="brand"
                        intensity="catchy"
                        label={translate(I18N_KEYS.UPGRADE)}
                        layout="iconLeading"
                        iconName="PremiumOutlined"
                      />
                    ) : null
                  }
                />
              </Link>
            </SideNavItemWithRequiredPermissions>
            <AccountRecoveryTooltip
              settingsRoute={SETTINGS_PATHS.MASTER_PASSWORD_POLICIES}
            >
              <SideNavItemWithRequiredPermissions
                requiredPermission="FULL"
                collapsed={isCollapsed}
              >
                <Link to={SETTINGS_PATHS.MASTER_PASSWORD_POLICIES}>
                  <SidenavLink
                    icon={<Icon name="RecoveryKeyOutlined" />}
                    label={translate(I18N_KEYS.ACCOUNT_RECOVERY)}
                    collapsed={isCollapsed}
                    selected={
                      location.pathname ===
                      SETTINGS_PATHS.MASTER_PASSWORD_POLICIES
                    }
                  />
                </Link>
              </SideNavItemWithRequiredPermissions>
            </AccountRecoveryTooltip>
            {duoFlag ? (
              <SideNavItemWithRequiredPermissions
                requiredPermission="FULL"
                collapsed={isCollapsed}
              >
                <Link to={SETTINGS_PATHS.DUO}>
                  <SidenavLink
                    icon={<Icon name="LaptopCheckmarkOutlined" />}
                    label={translate(I18N_KEYS.DUO)}
                    collapsed={isCollapsed}
                    selected={location.pathname === SETTINGS_PATHS.DUO}
                  />
                </Link>
              </SideNavItemWithRequiredPermissions>
            ) : null}
            {isCollapsed ? (
              <Tooltip
                placement="right"
                offset={[0, 15]}
                hoverCloseDelay={500}
                sx={{
                  padding: "4px 0",
                  "svg, svg:hover": {
                    fill: "ds.text.inverse.catchy",
                  },
                }}
                content={
                  <div
                    sx={{
                      width: "148px",
                    }}
                  >
                    <Link
                      to={INTEGRATIONS_PATH.SSO}
                      sx={{ textDecoration: "none" }}
                    >
                      <div className={styles.tooltipMenuOption}>
                        {translate(I18N_KEYS.SSO)}
                        {showUpgradeSsoBadge ? (
                          <Badge
                            mood="brand"
                            intensity="catchy"
                            label={translate(I18N_KEYS.UPGRADE)}
                            layout="iconLeading"
                            iconName="PremiumOutlined"
                            data-testid="sso-badge"
                          />
                        ) : null}
                      </div>
                    </Link>
                    <Link
                      to={INTEGRATIONS_PATH.DIRECTORY_SYNC}
                      sx={{ textDecoration: "none" }}
                    >
                      <div className={styles.tooltipMenuOption}>
                        {translate(I18N_KEYS.DIRECTORY_SYNC)}
                      </div>
                    </Link>
                    {hasEventsReportingAccess ? (
                      <Link
                        to={INTEGRATIONS_PATH.SIEM}
                        sx={{ textDecoration: "none" }}
                      >
                        <div className={styles.tooltipMenuOption}>
                          {translate(I18N_KEYS.EVENTS_REPORTING)}
                        </div>
                      </Link>
                    ) : null}
                  </div>
                }
              >
                <div tabIndex={0}>
                  <SideNavItemWithRequiredPermissions
                    requiredPermission="FULL"
                    collapsed={isCollapsed}
                  >
                    <Link to={INTEGRATIONS_PATH.INTEGRATIONS}>
                      <SidenavLink
                        collapsed={isCollapsed}
                        icon={<Icon name="ConfigureOutlined" />}
                        label={translate(I18N_KEYS.INTEGRATIONS)}
                        selected={false}
                      />
                    </Link>
                  </SideNavItemWithRequiredPermissions>
                </div>
              </Tooltip>
            ) : (
              <AccordionSection
                size="large"
                open
                sx={{
                  ...ACCORDION_STYLES,
                  "> summary": mergeSx([
                    SIDENAV_ITEM_STYLE,
                    location.pathname === INTEGRATIONS_PATH.INTEGRATIONS
                      ? SIDENAV_LINK_SX_STYLES.CONTAINER_SELECTED
                      : {},
                  ]),
                }}
              >
                <AccordionSummary>
                  <SideNavItemWithRequiredPermissions
                    requiredPermission="FULL"
                    collapsed={isCollapsed}
                  >
                    <Link to={INTEGRATIONS_PATH.INTEGRATIONS}>
                      <SidenavLink
                        collapsed={isCollapsed}
                        icon={<Icon name="ConfigureOutlined" />}
                        label={translate(I18N_KEYS.INTEGRATIONS)}
                        inAccordion={true}
                        endAdornment={
                          isStandardPlan ? (
                            <Badge
                              mood="brand"
                              intensity="catchy"
                              label={translate(I18N_KEYS.GROUP_UPGRADE)}
                              layout="iconLeading"
                              iconName="PremiumOutlined"
                            />
                          ) : null
                        }
                      />
                    </Link>
                  </SideNavItemWithRequiredPermissions>
                </AccordionSummary>
                <AccordionDetails>
                  <SideNavItemWithRequiredPermissions
                    requiredPermission="FULL"
                    collapsed={isCollapsed}
                  >
                    <Link to={INTEGRATIONS_PATH.SSO}>
                      <SidenavLink
                        icon={<span />}
                        label={translate(I18N_KEYS.SSO)}
                        endAdornment={
                          showUpgradeSsoBadge ? (
                            <Badge
                              mood="brand"
                              intensity="catchy"
                              label={translate(I18N_KEYS.UPGRADE)}
                              layout="iconLeading"
                              iconName="PremiumOutlined"
                              data-testid="sso-badge"
                            />
                          ) : null
                        }
                        selected={location.pathname === INTEGRATIONS_PATH.SSO}
                      />
                    </Link>
                  </SideNavItemWithRequiredPermissions>
                  <SideNavItemWithRequiredPermissions
                    requiredPermission="FULL"
                    collapsed={isCollapsed}
                  >
                    <Link to={INTEGRATIONS_PATH.DIRECTORY_SYNC}>
                      <SidenavLink
                        icon={<span />}
                        label={translate(I18N_KEYS.DIRECTORY_SYNC)}
                        selected={
                          location.pathname === INTEGRATIONS_PATH.DIRECTORY_SYNC
                        }
                      />
                    </Link>
                  </SideNavItemWithRequiredPermissions>
                  {hasEventsReportingAccess ? (
                    <SideNavItemWithRequiredPermissions
                      requiredPermission="FULL"
                      collapsed={isCollapsed}
                    >
                      <Link to={INTEGRATIONS_PATH.SIEM}>
                        <SidenavLink
                          icon={<span />}
                          label={translate(I18N_KEYS.EVENTS_REPORTING)}
                          selected={
                            location.pathname === INTEGRATIONS_PATH.SIEM
                          }
                        />
                      </Link>
                    </SideNavItemWithRequiredPermissions>
                  ) : null}
                </AccordionDetails>
              </AccordionSection>
            )}
          </SidenavMenu>
        </>
      ) : null}
    </Sidenav>
  );
};
