import {
  Badge,
  Button,
  Heading,
  Icon,
  LinkButton,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { Link, useRouterGlobalSettingsContext } from "../../../libs/router";
const I18N_KEYS = {
  BADGE_BUSINESS_PLAN: "team_settings_sso_paywall_business_badge",
  TITLE: "team_activity_paywall_track_organization_header",
  DESCRIPTION: "team_activity_paywall_track_organization_description",
  TRACK_MEMBERS_TITLE: "team_activity_paywall_track_members_header",
  TRACK_MEMBERS_DESCRIPTION: "team_activity_paywall_track_members_description",
  DOWNLOAD_TITLE: "team_activity_paywall_download_header",
  DOWNLOAD_DESCRIPTION: "team_activity_paywall_download_description",
  LEARN_MORE: "team_activity_paywall_learn_more",
  UPGRADE_BUSINESS: "team_contact_support_upgrade_to_business_cta",
};
const payWallContentStyles: Record<string, ThemeUIStyleObject> = {
  container: {
    borderRadius: "8px",
    border: "1px solid ds.border.neutral.quiet.idle",
    padding: "32px",
    backgroundColor: "ds.background.default",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "32px",
    alignContent: "start",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignSelf: "stretch",
  },
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    alignSelf: "stretch",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "16px",
  },
  icon: {
    backgroundColor: "ds.container.expressive.brand.quiet.idle",
    borderRadius: "8px",
    padding: "10px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
};
const SUPPORT_LINK = "__REDACTED__";
export const PaywallContent = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const handleUpgradeToBusiness = () => {
    logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.ActivityLogPaywall,
        button: HermesButton.UpgradeBusinessTier,
      })
    );
  };
  return (
    <div sx={payWallContentStyles.container}>
      <div sx={payWallContentStyles.header}>
        <Badge
          iconName="PremiumOutlined"
          layout="iconLeading"
          label={translate(I18N_KEYS.BADGE_BUSINESS_PLAN)}
          mood="brand"
          intensity="quiet"
        />
        <Heading as={"h2"} textStyle="ds.title.section.medium">
          {translate(I18N_KEYS.TITLE)}
        </Heading>
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
        >
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </div>
      <div sx={payWallContentStyles.itemContainer}>
        <div sx={payWallContentStyles.item}>
          <div sx={payWallContentStyles.icon}>
            <Icon
              name="ActionSearchOutlined"
              size="large"
              color="ds.text.brand.standard"
            />
          </div>
          <div>
            <Paragraph
              textStyle="ds.title.block.medium"
              sx={{ marginBottom: "5px" }}
            >
              {translate(I18N_KEYS.TRACK_MEMBERS_TITLE)}
            </Paragraph>
            <Paragraph
              textStyle="ds.body.reduced.regular"
              color="ds.text.neutral.quiet"
            >
              {translate(I18N_KEYS.TRACK_MEMBERS_DESCRIPTION)}
            </Paragraph>
          </div>
        </div>
        <div sx={payWallContentStyles.item}>
          <div sx={payWallContentStyles.icon}>
            <Icon
              name="CsvOutlined"
              size="large"
              color="ds.text.brand.standard"
            />
          </div>
          <div>
            <Paragraph
              textStyle="ds.title.block.medium"
              sx={{ marginBottom: "5px" }}
            >
              {translate(I18N_KEYS.DOWNLOAD_TITLE)}
            </Paragraph>
            <Paragraph
              textStyle="ds.body.reduced.regular"
              color="ds.text.neutral.quiet"
            >
              {translate(I18N_KEYS.DOWNLOAD_DESCRIPTION)}
            </Paragraph>
          </div>
        </div>
      </div>
      <div sx={payWallContentStyles.actions}>
        <LinkButton href={SUPPORT_LINK} isExternal>
          {translate(I18N_KEYS.LEARN_MORE)}
        </LinkButton>
        <Button
          mood="brand"
          intensity="catchy"
          icon="PremiumOutlined"
          layout="iconLeading"
          as={Link}
          to={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
          onClick={handleUpgradeToBusiness}
          data-testid="upgrade"
        >
          {translate(I18N_KEYS.UPGRADE_BUSINESS)}
        </Button>
      </div>
    </div>
  );
};
