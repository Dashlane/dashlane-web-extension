import { Heading, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
const I18N_KEYS = {
  INTEGRATIONS: "team_settings_menu_title_integrations",
  INTEGRATIONS_TITLE: "team_integrations_title",
};
export const IntegrationsHeader = () => {
  const { translate } = useTranslate();
  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Heading as="h1" textStyle="ds.title.section.large">
        {translate(I18N_KEYS.INTEGRATIONS)}
      </Heading>
      <Paragraph>{translate(I18N_KEYS.INTEGRATIONS_TITLE)}</Paragraph>
    </div>
  );
};
