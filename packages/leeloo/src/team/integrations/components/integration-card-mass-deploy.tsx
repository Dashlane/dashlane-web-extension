import { Badge, Heading, LinkButton, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  MASS_DEPLOYMENT_BADGE: "team_integrations_mass_deployment_badge",
  MASS_DEPLOYMENT_TITLE: "team_integrations_mass_deployment_title",
  MASS_DEPLOYMENT_DESCRIPTION: "team_integrations_mass_deployment_description",
  MASS_DEPLOYMENT_LINK_TITLE: "team_integrations_mass_deployment_link",
};
const HELP_CENTER_LINK = "__REDACTED__";
export const IntegrationCardMassDeploy = () => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        padding: "24px",
        borderColor: "ds.border.neutral.quiet.idle",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <div sx={{ display: "flex", flexDirection: "column", rowGap: "4px" }}>
        <Badge
          label={translate(I18N_KEYS.MASS_DEPLOYMENT_BADGE)}
          mood="brand"
          intensity="quiet"
        />
        <Heading
          as="h2"
          textStyle="ds.title.section.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.MASS_DEPLOYMENT_TITLE)}
        </Heading>
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
        >
          {translate(I18N_KEYS.MASS_DEPLOYMENT_DESCRIPTION)}
        </Paragraph>
      </div>

      <LinkButton href={HELP_CENTER_LINK} isExternal={true}>
        {translate(I18N_KEYS.MASS_DEPLOYMENT_LINK_TITLE)}
      </LinkButton>
    </div>
  );
};
