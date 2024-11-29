import { Button, Card, Heading, Paragraph } from "@dashlane/design-system";
import EasySecureSharingIllustration from "@dashlane/design-system/assets/illustrations/easy-secure-sharing@2x-light.webp";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Link, useRouterGlobalSettingsContext } from "../../../libs/router";
const I18N_KEYS = {
  TITLE: "team_groups_entrylevel_paywall_title",
  DESCRIPTION: "team_groups_entrylevel_paywall_description",
  UPGRADE: "team_upgrade_to_business",
};
export const StandardGroupPaywall = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  return (
    <Card
      sx={{
        margin: "auto",
        textAlign: "center",
        gap: "24px",
        width: "100%",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
      }}
    >
      <div sx={{ paddingTop: "40px" }}>
        <img
          alt=""
          src={EasySecureSharingIllustration}
          sx={{ objectFit: "contain", maxWidth: "320px", height: "auto" }}
        />
      </div>
      <div sx={{ width: "512px", margin: "0 auto" }}>
        <Heading
          as="h1"
          textStyle="ds.title.section.large"
          color="ds.text.neutral.catchy"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.TITLE)}
        </Heading>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </div>
      <Link
        key="upgrade"
        to={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
        sx={{ paddingBottom: "64px" }}
      >
        <Button
          icon="PremiumOutlined"
          layout="iconLeading"
          size="large"
          mood="brand"
          intensity="catchy"
        >
          {translate(I18N_KEYS.UPGRADE)}
        </Button>
      </Link>
    </Card>
  );
};
