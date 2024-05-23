import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { AccordionDetails, AccordionSection, AccordionSummary, ActivityLogIcon, DashboardIcon, jsx, Paragraph, PropsOf, SettingsIcon, SharingGroupIcon, Sidenav, SidenavItem, SidenavMenu, Tooltip, UserCircleIcon, } from '@dashlane/ui-components';
import { Badge, Icon } from '@dashlane/design-system';
import { AccessPath, UserOpenDomainDarkWebMonitoringEvent, } from '@dashlane/hermes';
import { AdminDataNotifications, AdminPermissionLevel, NotificationName, PremiumStatusSpace, } from '@dashlane/communication';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { TeamSettingsRoutes } from 'app/routes/constants';
import { NamedRoutes } from 'app/routes/types';
import { PermissionChecker } from 'user/permissions';
import { Link } from 'libs/router';
import { logEvent } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { useNotificationInteracted, useNotificationSeen, } from 'libs/carbon/hooks/useNotificationStatus';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { TacSettingsTabs } from 'team/settings/types';
import { TacTabs } from 'team/types';
import { useSideNavNotification } from 'team/side-nav-notifications/use-side-nav-notification';
import { useBuyOrUpgradePaywallDetails } from 'team/helpers/use-buy-or-upgrade-paywall-details';
import { useIsTeamCreator } from 'team/get-started/hooks/use-is-team-creator';
import { AccountRecoveryTooltip } from './components/account-recovery-tooltip';
import { SidenavLink } from './components/sidenav-link';
import { NewRestrictSharingInfo } from './components/new-restrict-sharing-info';
import styles from './styles.css';
const I18N_KEYS = {
    DASHBOARD: 'team_general',
    GET_STARTED: 'team_get_started',
    MEMBERS: 'team_members',
    GROUPS: 'team_groups',
    ACCOUNT_RECOVERY: 'team_settings_menu_title_account_recovery',
    ACTIVITY: 'team_activity',
    DIRECTORY_SYNC: 'team_settings_menu_title_directory_sync',
    DUO: 'team_settings_tab_duo',
    POLICIES: 'team_settings_menu_title_policies',
    SETTINGS: 'team_settings',
    SSO: 'team_settings_menu_title_single_sign_on',
    SECURITY_TOOLS: 'webapp_sidemenu_category_maintenance',
    DARK_WEB_INSIGHTS_LABEL: 'team_dashboard_dark_web_insights_heading',
    OPEN_VAULT_BUTTON: 'webapp_sidemenu_open_vault_cta',
    NEW_LABEL: 'team_new_label',
    UPGRADE: 'team_upgrade_label',
};
export interface TeamAdminSidenavProps {
    isCollapsed?: boolean;
    permissionChecker: PermissionChecker;
    routes: NamedRoutes;
    selectedTab: string;
    teamNotifications?: AdminDataNotifications;
    teamSettings?: PremiumStatusSpace['info'];
}
const hasNotification = (notificationProp: keyof AdminDataNotifications, teamNotifications?: AdminDataNotifications): boolean => (teamNotifications?.[notificationProp].length ?? 0) > 0;
export const TeamAdminSidenav = ({ isCollapsed = false, permissionChecker, routes, selectedTab, teamNotifications, teamSettings, }: TeamAdminSidenavProps) => {
    const { translate } = useTranslate();
    const SETTINGS_PATHS = {
        DIRECTORY_SYNC: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.DIRECTORY_SYNC}`,
        DUO: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.DUO}`,
        MASTER_PASSWORD_POLICIES: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.MASTER_PASSWORD_POLICIES}`,
        POLICIES: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.POLICIES}`,
        SSO: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.SSO}`,
    };
    const { unseen: isFirstVisit } = useNotificationSeen(NotificationName.TacDarkWebInsightsNewBadge);
    const { hasNewBreaches } = useSideNavNotification();
    const discontinuedStatus = useDiscontinuedStatus();
    const featuresResponse = useFeatureFlips();
    const featuresNotReady = featuresResponse.status !== DataStatus.Success;
    const { interacted: hasDismissedGetStarted, status: getStartedInteractedStatus, } = useNotificationInteracted(NotificationName.TacGetStartedDismissPage);
    const { shouldShowBuyOrUpgradePaywall, planType } = useBuyOrUpgradePaywallDetails(permissionChecker.adminAccess) ?? {};
    const isTeamCreatorResult = useIsTeamCreator();
    const isTeamCreator = isTeamCreatorResult.status === DataStatus.Success &&
        isTeamCreatorResult.isTeamCreator;
    const { 'BBCOM-238-duo': duoFlag = false, onboarding_web_tacgetstarted: hasTacGetStartedFF = false, } = featuresNotReady ? {} : featuresResponse.data;
    const isLoading = getStartedInteractedStatus === DataStatus.Loading ||
        isTeamCreatorResult.status === DataStatus.Loading ||
        featuresNotReady ||
        discontinuedStatus.isLoading;
    const showUpgradeSsoBadge = shouldShowBuyOrUpgradePaywall &&
        (planType === SpaceTier.Team || planType === SpaceTier.Starter);
    const showNewSsoBadge = teamSettings &&
        !teamSettings.ssoEnabled &&
        !showUpgradeSsoBadge &&
        showUpgradeSsoBadge !== undefined;
    const shouldShowGetStartedPage = hasTacGetStartedFF &&
        !hasDismissedGetStarted &&
        isTeamCreator &&
        !discontinuedStatus.isLoading &&
        !discontinuedStatus.isTeamSoftDiscontinued;
    const SideNavItemWithRequiredPermissions = ({ requiredPermission, children, ...props }: PropsWithChildren<PropsOf<typeof SidenavItem> & {
        requiredPermission: AdminPermissionLevel;
    }>) => {
        if (!permissionChecker.adminAccess.hasPermissionLevel(requiredPermission)) {
            return null;
        }
        return <SidenavItem {...props}>{children}</SidenavItem>;
    };
    return (<Sidenav collapsed={isCollapsed}>
      <SidenavMenu sx={{
            pointerEvents: featuresNotReady ? 'none' : 'auto',
            visibility: isLoading ? 'hidden' : 'visible',
            backgroundColor: 'ds.container.agnostic.inverse.standard',
        }}>
        {shouldShowGetStartedPage ? (<SideNavItemWithRequiredPermissions requiredPermission="FULL" collapsed={isCollapsed}>
            <Link to={routes.teamGetStartedRoutePath}>
              <SidenavLink collapsed={isCollapsed} icon={<Icon name="TipOutlined"/>} label={translate(I18N_KEYS.GET_STARTED)} selected={selectedTab === TacTabs.GET_STARTED}/>
            </Link>
          </SideNavItemWithRequiredPermissions>) : null}
        <SideNavItemWithRequiredPermissions requiredPermission="FULL" collapsed={isCollapsed}>
          <Link to={routes.teamDashboardRoutePath}>
            <SidenavLink collapsed={isCollapsed} icon={<DashboardIcon />} label={translate(I18N_KEYS.DASHBOARD)} selected={selectedTab === TacTabs.DASHBOARD}/>
          </Link>
        </SideNavItemWithRequiredPermissions>

        <SideNavItemWithRequiredPermissions requiredPermission="FULL" collapsed={isCollapsed}>
          <Link to={routes.teamMembersRoutePath}>
            <SidenavLink collapsed={isCollapsed} icon={<UserCircleIcon />} label={translate(I18N_KEYS.MEMBERS)} selected={selectedTab === TacTabs.MEMBERS}/>
          </Link>
        </SideNavItemWithRequiredPermissions>

        <SideNavItemWithRequiredPermissions requiredPermission="GROUP_READ" collapsed={isCollapsed}>
          <Link to={routes.teamGroupsRoutePath}>
            <SidenavLink collapsed={isCollapsed} icon={<SharingGroupIcon />} label={translate(I18N_KEYS.GROUPS)} selected={selectedTab === TacTabs.GROUPS}/>
          </Link>
        </SideNavItemWithRequiredPermissions>

        <SideNavItemWithRequiredPermissions requiredPermission="FULL" collapsed={isCollapsed}>
          <Link to={routes.teamActivityRoutePath}>
            <SidenavLink collapsed={isCollapsed} hasNotification={hasNotification('accountRecoveryRequests', teamNotifications)} icon={<ActivityLogIcon />} label={translate(I18N_KEYS.ACTIVITY)} selected={selectedTab === TacTabs.ACTIVITY}/>
          </Link>
        </SideNavItemWithRequiredPermissions>

        <SideNavItemWithRequiredPermissions requiredPermission="FULL" collapsed={isCollapsed}>
          <AccountRecoveryTooltip isSidenavCollapsed={isCollapsed} settingsRoute={SETTINGS_PATHS.MASTER_PASSWORD_POLICIES}>
            {isCollapsed ? (<Tooltip placement="right" offset={[0, 15]} hoverCloseDelay={500} sx={{
                padding: '4px 0',
                'svg, svg:hover': {
                    fill: 'ds.text.inverse.catchy',
                },
            }} content={<div sx={{
                    width: showNewSsoBadge ? '180px' : '148px',
                }}>
                    <div style={{
                    display: 'flex',
                }}>
                      <Link to={SETTINGS_PATHS.POLICIES} style={{ width: '100%' }}>
                        <div className={styles.tooltipMenuOption}>
                          {translate(I18N_KEYS.POLICIES)}
                        </div>
                      </Link>
                      <NewRestrictSharingInfo />
                    </div>
                    <Link to={SETTINGS_PATHS.SSO}>
                      <div className={classNames(styles.tooltipMenuOption, {
                    [styles.tooltipMenuOptionWithBadge]: showNewSsoBadge,
                })}>
                        {translate(I18N_KEYS.SSO)}
                        {showNewSsoBadge || showUpgradeSsoBadge ? (<Badge mood="brand" intensity="catchy" label={showNewSsoBadge
                        ? translate(I18N_KEYS.NEW_LABEL)
                        : translate(I18N_KEYS.UPGRADE)} layout="iconLeading" iconName={showUpgradeSsoBadge
                        ? 'PremiumOutlined'
                        : undefined}/>) : null}
                      </div>
                    </Link>
                    <Link to={SETTINGS_PATHS.DIRECTORY_SYNC}>
                      <div className={styles.tooltipMenuOption}>
                        {translate(I18N_KEYS.DIRECTORY_SYNC)}
                      </div>
                    </Link>
                    <Link to={SETTINGS_PATHS.MASTER_PASSWORD_POLICIES}>
                      <div className={styles.tooltipMenuOption}>
                        {translate(I18N_KEYS.ACCOUNT_RECOVERY)}
                      </div>
                    </Link>
                    {duoFlag ? (<Link to={SETTINGS_PATHS.DUO}>
                        <div className={styles.tooltipMenuOption}>
                          {translate(I18N_KEYS.DUO)}
                        </div>
                      </Link>) : null}
                  </div>}>
                
                
                <div tabIndex={0}>
                  <SidenavLink collapsed={isCollapsed} icon={<SettingsIcon />} label={translate(I18N_KEYS.SETTINGS)} selected={selectedTab === TacTabs.SETTINGS}/>
                </div>
              </Tooltip>) : (<AccordionSection size="large" open sx={{
                backgroundColor: 'ds.container.agnostic.inverse.standard',
                span: {
                    color: 'ds.text.inverse.catchy',
                },
                '> summary': {
                    padding: '16px 0',
                },
                '&[open]': {
                    padding: 0,
                },
                '&[open] > summary': {
                    padding: '16px 0',
                },
                '&[open] > div:nth-of-type(1)': {
                    pointerEvents: featuresNotReady ? 'none' : 'auto',
                    padding: 0,
                },
                'svg, svg:hover': {
                    fill: 'ds.text.inverse.catchy',
                },
            }}>
                <AccordionSummary>
                  <span className={styles.settingsMenuContainer}>
                    <span className={styles.iconContainer}>
                      <SettingsIcon />
                    </span>
                    

                    <Paragraph size="medium" bold as="span">
                      {translate(I18N_KEYS.SETTINGS)}
                    </Paragraph>
                  </span>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ display: 'flex' }}>
                    <Link to={SETTINGS_PATHS.POLICIES} style={{ width: '100%' }}>
                      <SidenavLink icon={<span />} label={translate(I18N_KEYS.POLICIES)} selected={selectedTab === TacSettingsTabs.POLICIES}/>
                    </Link>
                    <NewRestrictSharingInfo />
                  </div>
                  <Link to={SETTINGS_PATHS.SSO}>
                    <SidenavLink icon={<span />} label={translate(I18N_KEYS.SSO)} endAdornment={showNewSsoBadge || showUpgradeSsoBadge ? (<Badge mood="brand" intensity="catchy" label={showNewSsoBadge
                    ? translate(I18N_KEYS.NEW_LABEL)
                    : translate(I18N_KEYS.UPGRADE)} layout="iconLeading" iconName={showUpgradeSsoBadge
                    ? 'PremiumOutlined'
                    : undefined}/>) : null} selected={selectedTab === TacSettingsTabs.SSO}/>
                  </Link>
                  <Link to={SETTINGS_PATHS.DIRECTORY_SYNC}>
                    <SidenavLink icon={<span />} label={translate(I18N_KEYS.DIRECTORY_SYNC)} selected={selectedTab === TacSettingsTabs.DIRECTORY_SYNC}/>
                  </Link>
                  <Link to={SETTINGS_PATHS.MASTER_PASSWORD_POLICIES}>
                    <SidenavLink icon={<span />} label={translate(I18N_KEYS.ACCOUNT_RECOVERY)} selected={selectedTab === TacSettingsTabs.ACCOUNT_RECOVERY}/>
                  </Link>
                  {duoFlag ? (<Link to={SETTINGS_PATHS.DUO}>
                      <SidenavLink icon={<span />} label={translate(I18N_KEYS.DUO)} selected={selectedTab === TacSettingsTabs.DUO}/>
                    </Link>) : null}
                </AccordionDetails>
              </AccordionSection>)}
          </AccountRecoveryTooltip>
        </SideNavItemWithRequiredPermissions>

        {permissionChecker.adminAccess.hasFullAccess ? (<div className={styles.securityCategory}>
            <div className={styles.categoryTitle}>
              <Paragraph color={'ds.text.inverse.quiet'} caps={true} size="x-small">
                {translate(I18N_KEYS.SECURITY_TOOLS)}
              </Paragraph>
            </div>
            <SideNavItemWithRequiredPermissions requiredPermission="FULL" collapsed={isCollapsed}>
              <Link to={routes.teamDarkWebInsightsRoutePath} onClick={() => {
                logEvent(new UserOpenDomainDarkWebMonitoringEvent({
                    accessPath: AccessPath.NavLeftMenuButton,
                    isFirstVisit: isFirstVisit,
                }));
            }}>
                <SidenavLink collapsed={isCollapsed} icon={<Icon name="FeatureDarkWebMonitoringOutlined"/>} label={translate(I18N_KEYS.DARK_WEB_INSIGHTS_LABEL)} selected={selectedTab === TacTabs.DARK_WEB_INSIGHTS} hasNotification={hasNewBreaches}/>
              </Link>
            </SideNavItemWithRequiredPermissions>
          </div>) : null}
      </SidenavMenu>
    </Sidenav>);
};
