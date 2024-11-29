import { FeatureCardDescriberProps } from "../../components/feature-card";
export const confidentialSCIM: FeatureCardDescriberProps = {
  title: "tac_settings_directory_sync_card_title_confidential_scim",
  redirectUrl: "confidential-scim",
  supportedFeatures: [
    {
      title: "tac_settings_directory_sync_card_cloud_based",
      description: "tac_settings_directory_sync_card_cloud_based_description",
      iconName: "SettingsOutlined",
    },
    {
      title: "tac_settings_directory_sync_card_confidential_automatic_syncs",
      description:
        "tac_settings_directory_sync_card_confidential_automatic_syncs_description",
      iconName: "ConfigureOutlined",
    },
    {
      title: "tac_settings_directory_sync_card_user_provisioning",
      description:
        "tac_settings_directory_sync_card_user_provisioning_description",
      iconName: "GroupOutlined",
    },
    {
      title: "tac_settings_directory_sync_card_sharing_group",
      description: "tac_settings_directory_sync_card_sharing_group_description",
      iconName: "FeedbackSuccessOutlined",
    },
  ],
};
export const selfhostedlSCIM: FeatureCardDescriberProps = {
  title: "tac_settings_directory_sync_card_title_selfhosted_scim",
  redirectUrl: "scim-provisioning",
  supportedFeatures: [
    {
      title: "tac_settings_directory_sync_card_selfhosted_scim_cloud_based",
      description:
        "tac_settings_directory_sync_card_selfhosted_scim_cloud_based_description",
      iconName: "AccountSettingsOutlined",
    },
    {
      title:
        "tac_settings_directory_sync_card_selfhosted_confidential_automatic_syncs",
      description:
        "tac_settings_directory_sync_card_selfhosted_confidential_automatic_syncs_description",
      iconName: "ConfigureOutlined",
    },
    {
      title: "tac_settings_directory_sync_card_selfhosted_user_provisioning",
      description:
        "tac_settings_directory_sync_card_selfhosted_user_provisioning_description",
      iconName: "GroupOutlined",
    },
    {
      title: "tac_settings_directory_sync_card_selfhosted_sharing_group",
      description:
        "tac_settings_directory_sync_card_selfhosted_sharing_group_description",
      iconName: "FeedbackSuccessOutlined",
    },
  ],
};
export const activeDirectory: FeatureCardDescriberProps = {
  title: "tac_settings_directory_sync_card_title_ad_sync",
  redirectUrl: "active-directory",
  supportedFeatures: [
    {
      title: "tac_settings_directory_sync_card_ad_sync_cloud_based",
      description:
        "tac_settings_directory_sync_card_ad_sync_cloud_based_description",
      iconName: "AccountSettingsOutlined",
    },
    {
      title: "tac_settings_directory_sync_card_automatic_ad_sync_syncs",
      description:
        "tac_settings_directory_sync_card_automatic_ad_sync_syncs_description",
      iconName: "ConfigureOutlined",
    },
    {
      title: "tac_settings_directory_sync_card_ad_sync_user_provisioning",
      description:
        "tac_settings_directory_sync_card_ad_sync_user_provisioning_description",
      iconName: "GroupOutlined",
    },
    {
      title: "tac_settings_directory_sync_card_ad_sync_sharing_group",
      description:
        "tac_settings_directory_sync_card_ad_sync_sharing_group_description",
      iconName: "FeedbackSuccessOutlined",
    },
  ],
};
