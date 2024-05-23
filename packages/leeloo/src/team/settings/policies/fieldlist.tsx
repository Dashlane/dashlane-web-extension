import { ParsedURL } from '@dashlane/url-parser';
import { Policies } from '@dashlane/team-admin-contracts';
import { Button, ClickOrigin, UserClickEvent } from '@dashlane/hermes';
import { NamedRoutes } from 'app/routes/types';
import { TranslateFunction } from 'libs/i18n/types';
import { getVPNSettingRow } from 'team/settings/policies/VPN/vpn-setting-row';
import { UseBuyOrUpgradePaywallDetailsResult } from 'team/helpers/use-buy-or-upgrade-paywall-details';
import { RestrictSharingPaywallDetails } from 'team/helpers/use-restrict-sharing-paywall';
import { BUSINESS_BUY } from 'team/urls';
import { openUrl } from 'libs/external-urls';
import { redirect } from 'libs/router';
import { logEvent } from 'libs/logs/logEvent';
import { SettingRowModel } from './types';
import { getSmartSpaceManagementSettings } from './smart-space-management/get-smart-space-management-settings';
const I18N_KEYS_LABELS = {
    TEAM_SETTINGS_HEADER_SECURITY: 'team_settings_header_security',
    TEAM_SETTINGS_BROWSER_HEADER: 'team_settings_header_browser_settings',
    TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS: 'team_settings_disable_auto_login_domains',
    TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS_HELPER: 'team_settings_disable_auto_login_domains_helper',
    TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS_PLACEHOLDER: 'team_settings_disable_auto_login_domains_placeholder',
    TEAM_SETTINGS_FORCE_AUTO_LOGOUT: 'team_settings_force_auto_logout_after',
    TEAM_SETTINGS_FORCE_AUTO_LOGOUT_HELPER: 'team_settings_force_auto_logout_after_helper',
    TEAM_SETTINGS_LOCK_ON_EXIT: 'team_settings_lock_on_exit',
    TEAM_SETTINGS_LOCK_ON_EXIT_HELPER: 'team_settings_lock_on_exit_helper',
    TEAM_SETTINGS_AUDIT_LOGS: 'team_settings_collect_sensitive_data_audit_logs_enabled',
    TEAM_SETTINGS_AUDIT_LOGS_HELPER: 'team_settings_collect_sensitive_data_audit_logs_enabled_helper',
    TEAM_SETTINGS_AUDIT_LOGS_HELPER_WITHOUT_SPACES: 'team_settings_collect_sensitive_data_audit_logs_enabled_helper_without_space',
    TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD: 'team_settings_force_crypto_payload_label',
    TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_HELPER: 'team_settings_force_crypto_payload_helper',
    TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_DISABLED: 'team_settings_force_crypto_payload_option_disabled',
    TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_ARGON: 'team_settings_force_crypto_payload_option_argon2',
    TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_ADVANCED: 'team_settings_force_crypto_payload_option_pbkdf2_advanced',
    TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_STANDARD: 'team_settings_force_crypto_payload_option_pbkdf2_standard',
    TEAM_SETTINGS_ENFORCE_2FA: 'team_settings_enforce_2fa',
    TEAM_SETTINGS_ENFORCE_2FA_HELPER: 'team_settings_enforce_2fa_helper',
    TEAM_SETTINGS_ENFORCE_2FA_CONFIRM: 'team_settings_enforce_2fa_confirm_enable_title',
    TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_HELPER: 'team_settings_enforce_2fa_confirm_enable_helper2',
    TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_DISMISS: 'team_settings_enforce_2fa_confirm_enable_dismiss',
    TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_CHOICE: 'team_settings_enforce_2fa_confirm_enable_confirm',
    TEAM_SETTINGS_GENERATE_RECOVERY_CODES: 'team_settings_generate_recovery_codes_infobox_title',
    TEAM_SETTINGS_GENERATE_RECOVERY_CODES_MARKUP: 'team_settings_generate_recovery_codes_infobox_description_markup',
    TEAM_SETTINGS_ALLOW_EXPORT: 'team_settings_allow_export',
    TEAM_SETTINGS_ALLOW_EXPORT_HELPER: 'team_settings_allow_export_helper',
    TEAM_SETTINGS_ALLOW_EXPORT_INFOBOX_TITLE: 'team_settings_allow_export_infobox_title',
    TEAM_SETTINGS_ALLOW_EXPORT_INFOBOX_SUBTITLE: 'team_settings_allow_export_infobox_subtitle',
};
const I18N_KEYS_ERRORS = {
    TEAM_SETTINGS_TOO_MANY_REQUESTS: 'team_settings_too_many_requests',
    TEAM_SETTINGS_GENERIC_ERROR: 'team_settings_enable_space_restrictions_save_error_msg_generic_error',
    TEAM_SETTINGS_SAVE_GENERIC_ERROR: 'team_settings_team_domain_save_error_msg_generic_error',
    TEAM_SETTINGS_DISABLE_AUTOLOGIN_WRONG_SIZE: 'team_settings_disable_auto_login_domains_save_error_msg_wrong_size',
    TEAM_SETTINGS_DISABLE_AUTOLOGIN_GENERIC_ERROR: 'team_settings_disable_auto_login_domains_save_error_msg_generic_error',
    TEAM_SETTINGS_FORCE_AUTO_LOGOUT_GENERIC_ERROR: 'team_settings_force_auto_logout_after_save_error_msg_generic_error',
    TEAM_SETTINGS_LOCK_ON_EXIT_GENERIC_ERROR: 'team_settings_lock_on_exit_save_error_msg_generic_error',
    TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_GENERIC_ERROR: 'team_settings_force_crypto_payload_save_error_msg_generic_error',
    TEAM_SETTINGS_VPN_ENFORCE_2FA_GENERIC_ERROR: 'team_settings_enforce_2fa_save_error_msg_generic_error',
    TEAM_SETTINGS_COMMON_GENERIC_ERROR: '_common_generic_error',
};
const FQDN_MAX_LENGTH = 255;
const getAllowSharingSetting = (translate: TranslateFunction, isReadOnlySetting: boolean, policies: Policies): SettingRowModel => ({
    type: 'switch',
    isReadOnly: isReadOnlySetting,
    label: translate('team_settings_allow_sharing'),
    helperLabel: translate('team_settings_allow_sharing_helper'),
    value: policies.allowSharing,
    feature: 'allowSharing',
    getErrorMessageForKey: (key: string) => {
        switch (key) {
            case 'too_many_requests':
                return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
            default:
                return translate('team_settings_allow_sharing_save_error_msg_generic_error');
        }
    },
    constraintsFromOtherFields: {
        requiredFor: [
            {
                feature: 'restrictSharingToTeam',
                reset: (policyUpdates) => (policyUpdates.restrictSharingToTeam = false),
            },
        ],
    },
});
export const getSettingRows = (translate: TranslateFunction, showPaywallInfo: UseBuyOrUpgradePaywallDetailsResult, restrictSharingPaywallDetails: RestrictSharingPaywallDetails, isTeamDiscontinuedAfterTrial: boolean, showQuickDisableOfSmartSpaceManagement: boolean, policies: Policies, routes: NamedRoutes): SettingRowModel[] => {
    const settings: SettingRowModel[] = [];
    const { accountSubscriptionCode, shouldShowBuyPaywall, shouldShowUpgradePaywall, } = restrictSharingPaywallDetails;
    const isPersonalSpaceEnabledViaTeamSetting = policies.enablePersonalSpace;
    if (isPersonalSpaceEnabledViaTeamSetting) {
        settings.push(...getSmartSpaceManagementSettings(translate, policies, showQuickDisableOfSmartSpaceManagement));
    }
    settings.push({
        type: 'header',
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_BROWSER_HEADER),
    }, {
        type: 'text',
        isReadOnly: isTeamDiscontinuedAfterTrial,
        multiLine: true,
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS),
        helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS_HELPER),
        hintText: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS_PLACEHOLDER),
        value: policies.disableAutoLoginDomains,
        serializer: (domainList) => {
            const domains = domainList.length ? domainList.split(';') : [];
            return domains
                .filter((domain: string) => !!domain.length)
                .map((domain: string) => domain.trim());
        },
        deserializer: (domains) => (domains?.length ? domains.join(';') : ''),
        validator: (values: string[]) => {
            if (values.some((domain) => {
                const parsedDomain = new ParsedURL(domain);
                return !parsedDomain.isUrlValid();
            })) {
                return 'wrong_url';
            }
            if (values.some((domain) => domain.length > FQDN_MAX_LENGTH)) {
                return 'wrong_size';
            }
            return null;
        },
        feature: 'disableAutoLoginDomains',
        getErrorMessageForKey: (key) => {
            switch (key) {
                case 'wrong_size':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_WRONG_SIZE, {
                        lengthLimit: FQDN_MAX_LENGTH,
                    });
                case 'wrong_url':
                    return translate('team_settings_disable_auto_login_domains_save_error_msg_' + key);
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_GENERIC_ERROR);
            }
        },
    });
    const POLICIES_PAGE_BUY_DASHLANE_UTM_SOURCE = 'button:buy_dashlane+click_origin:restrict_sharing_to_team_activation_setting+origin_page:tac/settings/policies+origin_component:main_app';
    const buyDashlaneLink = `${BUSINESS_BUY}?plan=business
    }&subCode=${accountSubscriptionCode}&utm_source=${POLICIES_PAGE_BUY_DASHLANE_UTM_SOURCE}`;
    const logPaywallClick = () => logEvent(new UserClickEvent({
        button: Button.SeeB2bPlanTiers,
        clickOrigin: ClickOrigin.TacSettingsPolicies,
    }));
    let ctaAction;
    let ctaLabel;
    if (shouldShowBuyPaywall) {
        ctaAction = () => {
            logPaywallClick();
            openUrl(buyDashlaneLink);
        };
        ctaLabel = translate('team_settings_buy_dashlane_cta');
    }
    else if (shouldShowUpgradePaywall) {
        ctaAction = () => {
            logPaywallClick();
            redirect(`${routes.teamAccountChangePlanRoutePath}`);
        };
        ctaLabel = translate('team_settings_see_plans_cta');
    }
    settings.push({
        type: 'header',
        label: translate('team_setting_header_sharing'),
    }, getAllowSharingSetting(translate, isTeamDiscontinuedAfterTrial, policies), {
        type: shouldShowBuyPaywall || shouldShowUpgradePaywall ? 'cta' : 'switch',
        badgeIconName: shouldShowBuyPaywall || shouldShowUpgradePaywall
            ? 'PremiumOutlined'
            : undefined,
        badgeLabel: shouldShowBuyPaywall || shouldShowUpgradePaywall
            ? translate('team_settings_available_in_business_plan')
            : undefined,
        ctaAction,
        ctaLabel,
        isReadOnly: isTeamDiscontinuedAfterTrial,
        label: translate('team_settings_restrict_sharing_to_team_title'),
        helperLabel: translate('team_settings_restrict_sharing_to_team_description'),
        value: policies.restrictSharingToTeam,
        feature: 'restrictSharingToTeam',
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate('team_settings_restrict_sharing_to_team_generic_error');
            }
        },
        constraintsFromOtherFields: {
            disabledWhen: [
                {
                    feature: 'allowSharing',
                    condition: (policies: Policies) => !policies.allowSharing,
                    warningMessage: translate('team_settings_restrict_sharing_to_team_enable_sharing_first'),
                },
            ],
        },
    });
    settings.push({
        type: 'header',
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_HEADER_SECURITY),
    });
    if (!isPersonalSpaceEnabledViaTeamSetting) {
        settings.push({
            type: 'switch',
            label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ALLOW_EXPORT),
            helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ALLOW_EXPORT_HELPER),
            infoBox: isTeamDiscontinuedAfterTrial
                ? {
                    title: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ALLOW_EXPORT_INFOBOX_TITLE),
                    description: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ALLOW_EXPORT_INFOBOX_SUBTITLE),
                    mood: 'brand',
                }
                : undefined,
            value: policies.vaultExportEnabled,
            feature: 'vaultExportEnabled',
            getErrorMessageForKey: (key: string) => {
                switch (key) {
                    case 'too_many_requests':
                        return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                    default:
                        return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_COMMON_GENERIC_ERROR);
                }
            },
        });
    }
    settings.push({
        type: 'select',
        isReadOnly: isTeamDiscontinuedAfterTrial,
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_AUTO_LOGOUT),
        helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_AUTO_LOGOUT_HELPER),
        value: policies.forceAutomaticLogout,
        feature: 'forceAutomaticLogout',
        options: ['unset', '15', '30', '60'].map((durationInMinutes) => ({
            label: translate('team_settings_force_auto_logout_after_' + durationInMinutes),
            value: durationInMinutes,
        })),
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_FORCE_AUTO_LOGOUT_GENERIC_ERROR);
            }
        },
    });
    settings.push({
        type: 'switch',
        isReadOnly: isTeamDiscontinuedAfterTrial,
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_LOCK_ON_EXIT),
        helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_LOCK_ON_EXIT_HELPER),
        value: policies.lockOnExit,
        feature: 'lockOnExit',
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_LOCK_ON_EXIT_GENERIC_ERROR);
            }
        },
    });
    settings.push({
        type: 'switch',
        isReadOnly: isTeamDiscontinuedAfterTrial,
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_AUDIT_LOGS),
        helperLabel: translate(isPersonalSpaceEnabledViaTeamSetting
            ? I18N_KEYS_LABELS.TEAM_SETTINGS_AUDIT_LOGS_HELPER
            : I18N_KEYS_LABELS.TEAM_SETTINGS_AUDIT_LOGS_HELPER_WITHOUT_SPACES),
        value: policies.collectSensitiveDataAuditLogsEnabled,
        feature: 'collectSensitiveDataAuditLogsEnabled',
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_LOCK_ON_EXIT_GENERIC_ERROR);
            }
        },
    });
    settings.push({
        type: 'select',
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD),
        isReadOnly: isTeamDiscontinuedAfterTrial,
        helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_HELPER),
        value: policies.cryptoForcedPayload,
        feature: 'cryptoForcedPayload',
        options: [
            {
                label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_DISABLED),
                value: '',
            },
            {
                label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_ARGON),
                value: '$1$argon2d$16$3$32768$2$aes256$cbchmac$16$',
            },
            {
                label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_ADVANCED),
                value: '$1$pbkdf2$16$200000$sha256$aes256$cbchmac$16$',
            },
            {
                label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_STANDARD),
                value: 'KWC3',
                disabled: true,
            },
        ],
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_GENERIC_ERROR);
            }
        },
    });
    settings.push(getVPNSettingRow(showPaywallInfo, translate, policies, routes));
    settings.push({
        type: 'switch',
        isReadOnly: isTeamDiscontinuedAfterTrial,
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA),
        helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_HELPER),
        infoBox: {
            title: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_GENERATE_RECOVERY_CODES),
            description: translate.markup(I18N_KEYS_LABELS.TEAM_SETTINGS_GENERATE_RECOVERY_CODES_MARKUP),
        },
        value: policies.enforce2FA,
        feature: 'enforce2FA',
        confirmEnable: {
            title: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_CONFIRM),
            label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_HELPER),
            dismiss: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_DISMISS),
            confirm: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_CHOICE),
        },
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_VPN_ENFORCE_2FA_GENERIC_ERROR);
            }
        },
    });
    return settings;
};
