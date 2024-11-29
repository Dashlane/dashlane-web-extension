import { FeatureCardDescriberProps } from "../../components/feature-card";
import { InfoList } from "./sso-option-card";
export const I18N_VALUES = {
  PAGE_TITLE: "Choose your single sign-on (SSO) configuration",
  CHOOSE_SSO_OPTION_DESCRIPTION: "choose_sso_screen_paragraph_sso_description",
  CHOOSE_SSO_LEARN_MORE_LINK: "choose_sso_screen_link_lean_more",
  NITRO_EDIT_BUTTON: "tac_settings_choose_sso_confidential_card_button_edit",
  NITRO_SETUP_BUTTON: "tac_settings_choose_sso_confidential_card_button_setup",
  SELF_HOSTED_EDIT_BUTTON:
    "tac_settings_choose_sso_self_hosted_card_button_edit",
  SELF_HOSTED_SETUP_BUTTON:
    "tac_settings_choose_sso_self_hosted_card_button_setup",
  SSO_CONNECTOR_EDIT_BUTTON:
    "tac_settings_choose_sso_sso_connector_card_button_edit",
};
export const DEFINE_ES_URL = "__REDACTED__";
export const START_INFO_URL = "__REDACTED__";
export type SsoCardValues = {
  TITLE: string;
  CTA: string;
  CONTINUE_CTA: string;
  INFO_LIST: InfoList;
};
export const LEARN_MORE_LINK = "__REDACTED__";
export const selfHostedSSO: FeatureCardDescriberProps = {
  title: "tac_settings_choose_sso_card_self_hosted_title",
  redirectUrl: "self-hosted-sso",
  supportedFeatures: [
    {
      title: "tac_settings_sso_self_hosted_card_zero_knowledge",
      description: "",
      isSupported: true,
      iconName: "FeedbackSuccessOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_simplified_setup",
      description:
        "tac_settings_sso_self_hosted_card_not_simplified_setup_description",
      isSupported: false,
      iconName: "FeedbackFailOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_verified_domain",
      description: "",
      isSupported: true,
      iconName: "FeedbackSuccessOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_scim_support",
      description: "",
      isSupported: true,
      iconName: "FeedbackSuccessOutlined",
    },
  ],
};
export const nitroSSO: FeatureCardDescriberProps = {
  title: "tac_settings_choose_sso_card_nitro_title",
  redirectUrl: "confidential-sso",
  supportedFeatures: [
    {
      title: "tac_settings_sso_self_hosted_card_zero_knowledge",
      description: "",
      isSupported: true,
      iconName: "FeedbackSuccessOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_simplified_setup",
      description: "tac_settings_sso_nitro_card_simplified_setup_description",
      isSupported: true,
      iconName: "FeedbackSuccessOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_verified_domain",
      description: "",
      isSupported: true,
      iconName: "FeedbackSuccessOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_scim_support",
      description: "",
      isSupported: true,
      iconName: "FeedbackSuccessOutlined",
    },
  ],
};
export const ssoConnectorFeatureCard: FeatureCardDescriberProps = {
  title: "tac_settings_choose_sso_card_sso_connector_title",
  redirectUrl: "sso-connector",
  supportedFeatures: [
    {
      title: "tac_settings_sso_self_hosted_card_zero_knowledge",
      description: "",
      isSupported: true,
      iconName: "FeedbackSuccessOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_simplified_setup",
      description:
        "tac_settings_sso_self_hosted_card_not_simplified_setup_description",
      isSupported: false,
      iconName: "FeedbackFailOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_verified_domain",
      description: "",
      isSupported: false,
      iconName: "FeedbackFailOutlined",
    },
    {
      title: "tac_settings_sso_self_hosted_card_scim_support",
      description: "",
      isSupported: false,
      iconName: "FeedbackFailOutlined",
    },
  ],
};
