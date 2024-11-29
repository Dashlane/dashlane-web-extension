import { Button, Infobox } from "@dashlane/design-system";
import { Link } from "react-router-dom";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
const I18N_KEYS = {
  TITLE: "team_settings_splunk_paywall_title",
  DESCRIPTION: "team_settings_splunk_paywall_description",
  UPGRADE_CTA: "team_settings_siem_paywall_upgrade_cta",
};
export const SiemPaywall = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  return (
    <Infobox
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
      mood="brand"
      size="large"
      actions={[
        <Button
          key="upgrade"
          mood="brand"
          intensity="catchy"
          icon="PremiumOutlined"
          layout="iconLeading"
          as={Link}
          to={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
        >
          {translate(I18N_KEYS.UPGRADE_CTA)}
        </Button>,
      ]}
      sx={{ margin: "16px 32px 32px 32px" }}
    />
  );
};
