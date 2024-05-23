import { Policies, TeamPolicyUpdates } from '@dashlane/team-admin-contracts';
import { openUrl } from 'libs/external-urls';
import { TranslateFunction } from 'libs/i18n/types';
import { DASHLANE_SPACE_MANAGEMENT_ARTICLE } from 'team/urls';
import { SettingRowModel } from '../types';
const FQDN_MAX_LENGTH = 255;
const I18N_KEYS_LABELS = {
    TEAM_SETTINGS_HEADER_SPACE_OPTIONS: 'team_settings_header_team_space_options',
    TEAM_DOMAIN_SETTINGS: 'team_settings_team_domain',
    TEAM_DOMAIN_SETTINGS_HELPER: 'team_settings_team_domain_helper',
    TEAM_DOMAIN_SETTINGS_PLACEHOLDER: 'team_settings_team_domain_placeholder',
    TEAM_SETTINGS_ENABLE_SPACE_RESTRICTIONS: 'team_settings_enable_space_restrictions',
    TEAM_SETTINGS_ENABLE_SPACE_RESTRICTIONS_HELPER: 'team_settings_enable_space_restrictions_helper',
    TEAM_SETTINGS_REMOVED_FORCED_CONTENT: 'team_settings_remove_forced_content',
    TEAM_SETTINGS_REMOVED_FORCED_CONTENT_HELPER: 'team_settings_remove_forced_content_helper',
    TEAM_SETTINGS_SPACE_MANAGEMENT_DISABLED_INFOBOX_TITLE: 'team_settings_space_management_disabled_infobox_title',
    TEAM_SETTINGS_SPACE_MANAGEMENT_DISABLED_INFOBOX_SUBTITLE: 'team_settings_space_management_disabled_infobox_subtitle',
    TEAM_SETTINGS_SPACE_MANAGEMENT_CLICK_TO_DISABLE_INFOBOX_TITLE: 'team_settings_space_management_click_to_disable_infobox_title',
    TEAM_SETTINGS_SPACE_MANAGEMENT_CLICK_TO_DISABLE_INFOBOX_SUBTITLE: 'team_settings_space_management_click_to_disable_infobox_subtitle',
    TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_LEARN_MORE: 'team_settings_space_management_infobox_learn_more_button',
    TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_DISABLE_BUTTON: 'team_settings_space_management_infobox_disable_button',
};
const I18N_KEYS_ERRORS = {
    TEAM_SETTINGS_TOO_MANY_REQUESTS: 'team_settings_too_many_requests',
    TEAM_SETTINGS_SAVE_GENERIC_ERROR: 'team_settings_team_domain_save_error_msg_generic_error',
    TEAM_SETTINGS_GENERIC_ERROR: 'team_settings_enable_space_restrictions_save_error_msg_generic_error',
    TEAM_SETTINGS_DEFINE_DOMAIN_FIRST: 'team_settings_enable_space_restrictions_define_team_domain_first',
    TEAM_SETTINGS_REMOVED_FORCED_CONTENT_DEFINE_TEAM_DOMAIN: 'team_settings_remove_forced_content_define_team_domain_first',
    TEAM_SETTINGS_REMOVED_FORCED_CONTENT_ENABLE_FORCED_DOMAINS: 'team_settings_remove_forced_content_enable_forced_domains_first',
    TEAM_SETTINGS_WRONG_SIZE: 'team_settings_team_domain_save_error_msg_wrong_size',
    TEAM_SETTINGS_WRONG_URL: 'team_settings_team_domain_save_error_msg_wrong_url',
};
const validator = require('validator');
export const getSmartSpaceManagementSettings = (translate: TranslateFunction, policies: Policies, showQuickDisableOfSmartSpaceManagement: boolean): SettingRowModel[] => {
    const settings: SettingRowModel[] = [];
    const shouldShowDisableSmartSpaceManagementInfobox = showQuickDisableOfSmartSpaceManagement &&
        (policies.enableForcedDomains || policies.enableRemoveForcedContent);
    const isDiscontinuedAfterTrialAndSmartManagementIsDisabled = showQuickDisableOfSmartSpaceManagement &&
        !policies.enableForcedDomains &&
        !policies.enableRemoveForcedContent;
    settings.push({
        type: 'header',
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_HEADER_SPACE_OPTIONS),
    });
    if (shouldShowDisableSmartSpaceManagementInfobox) {
        settings.push({
            type: 'quickDisable',
            label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_CLICK_TO_DISABLE_INFOBOX_TITLE),
            description: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_CLICK_TO_DISABLE_INFOBOX_SUBTITLE),
            mood: 'brand',
            featuresToDisable: {
                enableForcedDomains: false,
                enableRemoveForcedContent: false,
            },
            actions: {
                primary: {
                    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_DISABLE_BUTTON),
                },
                secondary: {
                    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_LEARN_MORE),
                    onClick: () => openUrl(DASHLANE_SPACE_MANAGEMENT_ARTICLE),
                },
            },
        });
    }
    if (isDiscontinuedAfterTrialAndSmartManagementIsDisabled) {
        settings.push({
            type: 'quickDisable',
            label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_DISABLED_INFOBOX_TITLE),
            description: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_DISABLED_INFOBOX_SUBTITLE),
            icon: 'FeedbackSuccessOutlined',
            mood: 'positive',
            actions: {
                secondary: {
                    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_LEARN_MORE),
                    onClick: () => openUrl(DASHLANE_SPACE_MANAGEMENT_ARTICLE),
                },
            },
        });
    }
    settings.push({
        type: 'text',
        multiLine: true,
        isReadOnly: isDiscontinuedAfterTrialAndSmartManagementIsDisabled,
        label: translate(I18N_KEYS_LABELS.TEAM_DOMAIN_SETTINGS),
        helperLabel: translate(I18N_KEYS_LABELS.TEAM_DOMAIN_SETTINGS_HELPER),
        hintText: translate(I18N_KEYS_LABELS.TEAM_DOMAIN_SETTINGS_PLACEHOLDER),
        feature: 'teamDomain',
        value: policies.teamDomain,
        serializer: (domains: string) => domains
            ? domains
                .split(';')
                .map((domain) => domain.trim().toLowerCase())
                .filter((domain) => Boolean(domain.length))
            : [],
        deserializer: (domains) => (domains?.length ? domains.join(';') : ''),
        validator: (values: string[]) => {
            if (values.some((domain) => !validator.isFQDN(domain))) {
                return 'wrong_url';
            }
            if (values.some((domain) => domain.length > FQDN_MAX_LENGTH)) {
                return 'wrong_size';
            }
            return null;
        },
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'wrong_size':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_WRONG_SIZE, {
                        lengthLimit: FQDN_MAX_LENGTH,
                    });
                case 'wrong_url':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_WRONG_URL);
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_SAVE_GENERIC_ERROR);
            }
        },
    });
    settings.push({
        type: 'switch',
        isReadOnly: isDiscontinuedAfterTrialAndSmartManagementIsDisabled,
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENABLE_SPACE_RESTRICTIONS),
        helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENABLE_SPACE_RESTRICTIONS_HELPER),
        value: policies.enableForcedDomains,
        feature: 'enableForcedDomains',
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_GENERIC_ERROR);
            }
        },
        constraintsFromOtherFields: {
            disabledWhen: [
                {
                    feature: 'teamDomain',
                    condition: (teamPolicies: Policies) => !teamPolicies.teamDomain?.length,
                    warningMessage: translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_DEFINE_DOMAIN_FIRST),
                },
            ],
            requiredFor: [
                {
                    feature: 'enableRemoveForcedContent',
                    reset: (policyUpdates: TeamPolicyUpdates) => (policyUpdates.enableRemoveForcedContent = false),
                },
            ],
        },
    });
    settings.push({
        type: 'switch',
        label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_REMOVED_FORCED_CONTENT),
        isReadOnly: isDiscontinuedAfterTrialAndSmartManagementIsDisabled,
        helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_REMOVED_FORCED_CONTENT_HELPER),
        value: policies.enableRemoveForcedContent,
        feature: 'enableRemoveForcedContent',
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                default:
                    return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_GENERIC_ERROR);
            }
        },
        constraintsFromOtherFields: {
            disabledWhen: [
                {
                    feature: 'teamDomain',
                    condition: (teamPolicies: Policies) => !teamPolicies.teamDomain?.length,
                    warningMessage: translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_REMOVED_FORCED_CONTENT_DEFINE_TEAM_DOMAIN),
                },
                {
                    feature: 'enableForcedDomains',
                    condition: (teamPolicies: Policies) => !teamPolicies.enableForcedDomains,
                    warningMessage: translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_REMOVED_FORCED_CONTENT_ENABLE_FORCED_DOMAINS),
                },
            ],
        },
    });
    return settings;
};
