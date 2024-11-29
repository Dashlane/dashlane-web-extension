import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  DSStyleObject,
  Heading,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
import { useRouterGlobalSettingsContext } from "../../../../../libs/router";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../../libs/logs/logEvent";
import { useSubscriptionCode } from "../../../../../libs/hooks/use-subscription-code";
import { useTeamTrialStatus } from "../../../../../libs/hooks/use-team-trial-status";
import { openUrl } from "../../../../../libs/external-urls";
import { BUSINESS_BUY } from "../../../../urls";
const SX_STYLES: Record<string, DSStyleObject> = {
  SEATS_REVIEW_SECTION: {
    display: "flex",
    flexDirection: "row",
    gap: "24px",
    marginBottom: "24px",
  },
  SEATS_REVIEW_ITEM: {
    width: "120px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  VERTICAL_DIVIDER: {
    borderLeft: "1px solid ds.border.neutral.quiet.idle",
    height: "48px",
  },
  BUTTON_SECTION: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
  },
};
const I18N_KEYS = {
  HEADER: "tac_settings_confidential_scim_review_seats_card_header",
  DESCRIPTION: "tac_settings_confidential_scim_review_seats_card_description",
  PRO_TIP_BADGE:
    "tac_settings_confidential_scim_review_seats_card_pro_tip_badge",
  BUY_DASHLANE_BUTTON: "team_buy_dashlane",
  BUY_SEATS_BUTTON:
    "tac_settings_confidential_scim_review_seats_card_buy_seats_button",
  REVIEW_SUBSCRIPTION_BUTTON:
    "tac_settings_confidential_scim_review_seats_card_review_subscription_button",
  TOTAL_SEATS: "tac_settings_confidential_scim_review_seats_card_total_seats",
  FREE: "tac_settings_confidential_scim_review_seats_card_free",
  OCCUPIED: "tac_settings_confidential_scim_review_seats_card_occupied",
};
interface Props {
  onClickBuySeats: () => void;
}
export const ReviewSeatsUsageCard = ({ onClickBuySeats }: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const { data: seats } = useModuleQuery(teamPlanDetailsApi, "getTeamSeats");
  const teamTrialStatus = useTeamTrialStatus();
  const subscriptionCode = useSubscriptionCode();
  if (!teamTrialStatus) {
    return null;
  }
  const buyDashlaneLink = `${BUSINESS_BUY}?plan=business&subCode=${
    subscriptionCode ?? ""
  }`;
  const handleClickReviewSubscription = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.ReviewSubscription,
        clickOrigin: ClickOrigin.ProTip,
      })
    );
  };
  const handleClickBuyDashlane = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.BuyDashlane,
        clickOrigin: ClickOrigin.ProTip,
      })
    );
    openUrl(buyDashlaneLink);
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "32px",
      }}
    >
      <Badge
        mood="brand"
        intensity="quiet"
        layout="iconLeading"
        iconName="PremiumOutlined"
        label={translate(I18N_KEYS.PRO_TIP_BADGE)}
      />
      <div>
        <Heading
          as="h2"
          textStyle="ds.title.section.medium"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.HEADER)}
        </Heading>
        <Paragraph
          textStyle="ds.body.standard.regular"
          sx={{ marginBottom: "24px" }}
        >
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
        <div sx={SX_STYLES.SEATS_REVIEW_SECTION}>
          <div sx={SX_STYLES.SEATS_REVIEW_ITEM}>
            <Heading
              as="h3"
              textStyle="ds.title.supporting.small"
              color="ds.text.neutral.quiet"
            >
              {translate(I18N_KEYS.TOTAL_SEATS)}
            </Heading>
            <Paragraph
              textStyle="ds.specialty.monospace.small"
              color="ds.text.neutral.standard"
            >
              {seats ? seats.paid : <IndeterminateLoader />}
            </Paragraph>
          </div>
          <div sx={SX_STYLES.VERTICAL_DIVIDER} />
          <div sx={SX_STYLES.SEATS_REVIEW_ITEM}>
            <Heading
              as="h3"
              textStyle="ds.title.supporting.small"
              color="ds.text.neutral.quiet"
            >
              {translate(I18N_KEYS.OCCUPIED)}
            </Heading>
            <Paragraph
              textStyle="ds.specialty.monospace.small"
              color="ds.text.positive.quiet"
            >
              {seats ? seats.paid - seats.remaining : <IndeterminateLoader />}
            </Paragraph>
          </div>
          <div sx={SX_STYLES.VERTICAL_DIVIDER} />
          <div sx={SX_STYLES.SEATS_REVIEW_ITEM}>
            <Heading
              as="h3"
              textStyle="ds.title.supporting.small"
              color="ds.text.neutral.quiet"
            >
              {translate(I18N_KEYS.FREE)}
            </Heading>
            <Paragraph
              textStyle="ds.specialty.monospace.small"
              color="ds.text.positive.quiet"
            >
              {seats ? seats.remaining : <IndeterminateLoader />}
            </Paragraph>
          </div>
        </div>
        <div sx={SX_STYLES.BUTTON_SECTION}>
          {teamTrialStatus.isFreeTrial ? (
            <Button
              mood="brand"
              intensity="quiet"
              layout="labelOnly"
              role="link"
              onClick={handleClickBuyDashlane}
            >
              {translate(I18N_KEYS.BUY_DASHLANE_BUTTON)}
            </Button>
          ) : (
            <Button
              mood="brand"
              intensity="quiet"
              layout="labelOnly"
              onClick={onClickBuySeats}
            >
              {translate(I18N_KEYS.BUY_SEATS_BUTTON)}
            </Button>
          )}

          <Link to={routes.teamAccountRoutePath}>
            <Button
              mood="brand"
              intensity="supershy"
              layout="labelOnly"
              onClick={handleClickReviewSubscription}
            >
              {translate(I18N_KEYS.REVIEW_SUBSCRIPTION_BUTTON)}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
