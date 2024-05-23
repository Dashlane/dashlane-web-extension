import { FeatureCardProps } from 'team/settings/components/feature-card';
export const confidentialSCIM: Omit<FeatureCardProps, 'optionNumber'> = {
    title: 'tac_settings_directory_sync_card_title_confidential_scim',
    redirectUrl: 'confidential-scim',
    isBetaFeature: true,
    supportedFeatures: [
        {
            title: 'tac_settings_directory_sync_card_cloud_based',
            description: 'tac_settings_directory_sync_confidential_card_cloud_based_description',
            isSupported: true,
        },
        {
            title: 'tac_settings_directory_sync_card_confidential_automatic_syncs',
            description: 'tac_settings_directory_sync_card_confidential_automatic_syncs_description',
            isSupported: true,
        },
        {
            title: 'tac_settings_directory_sync_card_user_provisioning',
            description: 'tac_settings_directory_sync_card_user_provisioning_description',
            isSupported: true,
        },
        {
            title: 'tac_settings_directory_sync_card_sharing_group',
            description: 'tac_settings_directory_sync_card_sharing_group_description',
            isSupported: false,
        },
    ],
};
export const selfhostedlSCIM: Omit<FeatureCardProps, 'optionNumber'> = {
    title: 'tac_settings_directory_sync_card_title_selfhosted_scim',
    redirectUrl: 'scim-provisioning',
    supportedFeatures: [
        {
            title: 'tac_settings_directory_sync_card_cloud_based',
            description: 'tac_settings_directory_sync_card_selfhosted_scim_cloud_based_description',
            isSupported: true,
        },
        {
            title: 'tac_settings_directory_sync_card_automatic_syncs',
            description: 'tac_settings_directory_sync_card_automatic_selfhosted_scim_syncs_description',
            isSupported: true,
        },
        {
            title: 'tac_settings_directory_sync_card_user_provisioning',
            description: 'tac_settings_directory_sync_card_user_provisioning_description',
            isSupported: true,
        },
        {
            title: 'tac_settings_directory_sync_card_sharing_group',
            description: 'tac_settings_directory_sync_card_sharing_group_description',
            isSupported: true,
        },
    ],
};
export const activeDirectory: Omit<FeatureCardProps, 'optionNumber'> = {
    title: 'tac_settings_directory_sync_card_title_ad_sync',
    redirectUrl: 'active-directory',
    supportedFeatures: [
        {
            title: 'tac_settings_directory_sync_card_cloud_based',
            description: 'tac_settings_directory_sync_card_ad_sync_cloud_based_description',
            isSupported: false,
        },
        {
            title: 'tac_settings_directory_sync_card_automatic_syncs',
            description: 'tac_settings_directory_sync_card_automatic_ad_sync_syncs_description',
            isSupported: true,
        },
        {
            title: 'tac_settings_directory_sync_card_user_provisioning',
            description: 'tac_settings_directory_sync_card_user_provisioning_description',
            isSupported: true,
        },
        {
            title: 'tac_settings_directory_sync_card_sharing_group',
            description: 'tac_settings_directory_sync_card_sharing_group_description',
            isSupported: true,
        },
    ],
};
