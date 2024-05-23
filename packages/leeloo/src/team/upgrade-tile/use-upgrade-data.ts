import { SpaceTier } from '@dashlane/team-admin-contracts';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { BUSINESS_BUY } from 'team/urls';
import { UpgradePlanData } from './types';
const I18N_KEYS = {
    TEAM_TRIAL_HEADER: 'team_dashboard_upgrade_tile_team_trial_header_markup',
    TEAM_TRIAL_HEADER_LAST_DAY: 'team_dashboard_upgrade_tile_team_trial_header_last_day',
    TEAM_TRIAL_DESCRIPTION: 'team_dashboard_upgrade_tile_business_trial_description',
    TEAM_UPGRADE_HEADER: 'team_dashboard_upgrade_tile_team_upgrade_header',
    TEAM_UPGRADE_DESCRIPTION: 'team_dashboard_upgrade_tile_team_upgrade_description',
    BUSINESS_TRIAL_HEADER: 'team_dashboard_upgrade_tile_business_trial_header_markup',
    BUSINESS_TRIAL_HEADER_LAST_DAY: 'team_dashboard_upgrade_tile_business_trial_header_last_day',
    BUSINESS_TRIAL_DESCRIPTION: 'team_dashboard_upgrade_tile_business_trial_description',
    BUSINESS_UPGRADE_HEADER: 'team_dashboard_upgrade_tile_business_upgrade_header',
    BUSINESS_UPGRADE_DESCRIPTION: 'team_dashboard_upgrade_tile_business_upgrade_description',
    UNLIMITED_SEATS: 'team_dashboard_upgrade_tile_feature_unlimited_seats',
    VPN: 'team_dashboard_upgrade_tile_feature_vpn',
    BUY_CTA: 'team_dashboard_upgrade_tile_cta_buy_dashlane',
    UPGRADE_CTA: 'team_dashboard_upgrade_tile_cta_upgrade',
    SSO: 'team_dashboard_upgrade_tile_feature_sso',
    SCIM: 'team_dashboard_upgrade_tile_feature_scim',
    FAMILY: 'team_dashboard_upgrade_tile_feature_friends_and_family',
    SUPPORT: 'team_dashboard_upgrade_tile_feature_support',
};
export const useUpgradeData = (): UpgradePlanData | null => {
    const accountInfo = useAccountInfo();
    const { routes } = useRouterGlobalSettingsContext();
    const teamTrialStatus = useTeamTrialStatus();
    if (!teamTrialStatus) {
        return null;
    }
    const isTrial = teamTrialStatus.isFreeTrial;
    const isStarter = teamTrialStatus.spaceTier === SpaceTier.Starter;
    const isTeam = teamTrialStatus.spaceTier === SpaceTier.Team;
    const isBusiness = teamTrialStatus.spaceTier === SpaceTier.Business;
    const daysLeft = teamTrialStatus.daysLeftInTrial;
    if (isTrial && isTeam) {
        return {
            header: {
                key: !daysLeft
                    ? I18N_KEYS.TEAM_TRIAL_HEADER_LAST_DAY
                    : I18N_KEYS.TEAM_TRIAL_HEADER,
                variables: { daysLeft },
            },
            description: {
                key: I18N_KEYS.TEAM_TRIAL_DESCRIPTION,
            },
            features: [
                {
                    iconName: 'GroupOutlined',
                    key: I18N_KEYS.UNLIMITED_SEATS,
                },
                {
                    iconName: 'FeatureVpnOutlined',
                    key: I18N_KEYS.VPN,
                },
            ],
            cta: {
                key: I18N_KEYS.BUY_CTA,
                external: true,
                link: `${BUSINESS_BUY}?plan=team&subCode=${accountInfo?.subscriptionCode}`,
            },
        };
    }
    if (isTrial && isBusiness) {
        return {
            header: {
                key: !daysLeft
                    ? I18N_KEYS.BUSINESS_TRIAL_HEADER_LAST_DAY
                    : I18N_KEYS.BUSINESS_TRIAL_HEADER,
                variables: { daysLeft },
            },
            description: {
                key: I18N_KEYS.BUSINESS_TRIAL_DESCRIPTION,
            },
            features: [
                {
                    iconName: 'ToolsOutlined',
                    key: I18N_KEYS.SSO,
                },
                {
                    iconName: 'SharedOutlined',
                    key: I18N_KEYS.SCIM,
                },
                {
                    iconName: 'GroupOutlined',
                    key: I18N_KEYS.FAMILY,
                },
                {
                    iconName: 'ItemPhoneHomeOutlined',
                    key: I18N_KEYS.SUPPORT,
                },
            ],
            cta: {
                key: I18N_KEYS.BUY_CTA,
                external: true,
                link: `${BUSINESS_BUY}?plan=business&subCode=${accountInfo?.subscriptionCode}`,
            },
        };
    }
    if (!isTrial && isStarter) {
        return {
            header: {
                key: I18N_KEYS.TEAM_UPGRADE_HEADER,
            },
            description: {
                key: I18N_KEYS.TEAM_UPGRADE_DESCRIPTION,
            },
            features: [
                {
                    iconName: 'GroupOutlined',
                    key: I18N_KEYS.UNLIMITED_SEATS,
                },
                {
                    iconName: 'FeatureVpnOutlined',
                    key: I18N_KEYS.VPN,
                },
            ],
            cta: {
                key: I18N_KEYS.UPGRADE_CTA,
                link: routes.teamAccountChangePlanRoutePath,
            },
        };
    }
    if (!isTrial && isTeam) {
        return {
            header: {
                key: I18N_KEYS.BUSINESS_UPGRADE_HEADER,
            },
            description: {
                key: I18N_KEYS.BUSINESS_UPGRADE_DESCRIPTION,
            },
            features: [
                {
                    iconName: 'ToolsOutlined',
                    key: I18N_KEYS.SSO,
                },
                {
                    iconName: 'SharedOutlined',
                    key: I18N_KEYS.SCIM,
                },
                {
                    iconName: 'GroupOutlined',
                    key: I18N_KEYS.FAMILY,
                },
                {
                    iconName: 'ItemPhoneHomeOutlined',
                    key: I18N_KEYS.SUPPORT,
                },
            ],
            cta: {
                key: I18N_KEYS.UPGRADE_CTA,
                link: routes.teamAccountChangePlanRoutePath,
            },
        };
    }
    return null;
};
