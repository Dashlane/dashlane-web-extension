import {
  Badge,
  Button,
  colors,
  Paragraph as DSParagraph,
  Flex,
  Icon,
  IndeterminateLoader,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { openDashlaneUrl } from "../../../libs/external-urls";
import { PricingTileData } from "../../shared/plan-config";
import { BUSINESS_UPGRADE } from "../../urls";
const BADGE_HEIGHT = "16px";
const I18N_KEYS = {
  CONTACT_SALES:
    "team_post_trial_checkout_plan_selection_biz_plus_card_button_text",
  CURRENT: "team_account_teamplan_changeplan_plans_plan_current",
  CURRENT_TRIAL: "team_account_teamplan_changeplan_plans_plan_current_trial",
  LIMITED_OFFER: "team_account_teamplan_changeplan_plans_plan_limited_offer",
  PREVIOUS_PRICE: "team_account_teamplan_changeplan_plans_previous_price",
  SELECTED: "team_account_teamplan_changeplan_plans_selected",
  SELECT: "team_account_teamplan_changeplan_plans_select",
  LIMITED_PRICE_INFOBOX:
    "team_account_teamplan_changeplan_plans_limited_price_infobox",
  PLAN_RECOMMENDED: "team_account_teamplan_changeplan_plans_plan_recommended",
  UPGRADE_INFOBOX: "team_account_teamplan_changeplan_plans_upgrade_infobox",
  STANDARD_PLAN_RESTRICTED_INFOBOX:
    "team_post_trial_checkout_pricing_tile_standard_plan_restricted_infobox",
};
interface Props {
  plan: PricingTileData;
  handleSelectClick?: undefined | (() => void);
  selected?: boolean;
}
export const PricingTile = ({ plan, handleSelectClick, selected }: Props) => {
  const { translate } = useTranslate();
  if (!plan) {
    return null;
  }
  const {
    currentPlan,
    currentTrial,
    limitedOffer,
    heading,
    price,
    equivalentPrice,
    planName,
    footer,
    priceDescription1,
    priceDescription2,
    features,
    showUpgradeInfobox,
    showRecommendedBadge,
    isStandardPlanRestricted,
  } = plan;
  const redirectToUpgradePage = () => {
    const tracking = {
      medium: "checkout",
      campaign: "business-plus-upgrade",
      source: "product",
      content: "trial",
    };
    openDashlaneUrl(BUSINESS_UPGRADE, tracking);
  };
  const renderBadges = () => (
    <div sx={{ minHeight: BADGE_HEIGHT }}>
      {currentPlan && <Badge label={translate(I18N_KEYS.CURRENT)} />}
      {currentTrial && <Badge label={translate(I18N_KEYS.CURRENT_TRIAL)} />}
      {showRecommendedBadge && (
        <Badge
          mood="brand"
          intensity="catchy"
          label={translate(I18N_KEYS.PLAN_RECOMMENDED)}
        />
      )}
      {limitedOffer && (
        <Badge
          mood="brand"
          intensity="catchy"
          label={translate(I18N_KEYS.LIMITED_OFFER)}
        />
      )}
    </div>
  );
  const renderPriceContent = () => {
    if (typeof price === "string") {
      return (
        <Paragraph textStyle="ds.specialty.spotlight.medium">{price}</Paragraph>
      );
    } else if (price === null) {
      return <IndeterminateLoader size={44} mood="neutral" />;
    } else {
      return (
        <Paragraph
          textStyle="ds.specialty.spotlight.small"
          color="ds.text.neutral.catchy"
          sx={{ marginBottom: "10px" }}
        >
          {translate(price.key)}
        </Paragraph>
      );
    }
  };
  const renderPrice = () => (
    <Flex gap="4px">
      {renderPriceContent()}

      {equivalentPrice && (
        <DSParagraph
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.quiet"
          sx={{ whiteSpace: "break-spaces" }}
        >
          {translate(I18N_KEYS.PREVIOUS_PRICE)}
          <br />
          <span sx={{ textDecoration: "line-through" }}>{equivalentPrice}</span>
        </DSParagraph>
      )}
    </Flex>
  );
  const renderButtons = () => {
    if (isStandardPlanRestricted) {
      return null;
    } else if (selected) {
      return (
        <Button
          disabled
          mood="brand"
          intensity="quiet"
          size="small"
          type="button"
          fullsize
          data-testid={`btn-${planName}-selected`}
          layout="iconLeading"
          icon="CheckmarkOutlined"
        >
          {translate(I18N_KEYS.SELECTED)}
        </Button>
      );
    } else if (handleSelectClick) {
      return (
        <Button
          mood="brand"
          intensity="quiet"
          size="small"
          onClick={handleSelectClick}
          fullsize
          data-testid={`btn-${planName}-select`}
        >
          {translate(I18N_KEYS.SELECT)}
        </Button>
      );
    } else if (planName === "businessPlus") {
      return (
        <Button
          mood="brand"
          intensity="quiet"
          size="small"
          onClick={redirectToUpgradePage}
          fullsize
        >
          {translate(I18N_KEYS.CONTACT_SALES)}
        </Button>
      );
    } else if (!showUpgradeInfobox) {
      return <div sx={{ height: "32px", width: "100%" }} />;
    }
    return null;
  };
  const renderFeatures = () => (
    <Flex flexDirection="column" gap="8px">
      {features.map(({ key, icon, variables, loading }) => (
        <Flex
          key={key}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            flexWrap: "nowrap",
            strong: {
              color: !currentPlan
                ? colors.lightTheme.ds.text.neutral.catchy
                : null,
            },
          }}
        >
          <div sx={{ width: "10px" }}>
            {icon === "check" ? (
              <Icon name="CheckmarkOutlined" size="xsmall" />
            ) : (
              <Icon name="ActionAddOutlined" size="xsmall" />
            )}
          </div>

          {loading ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              sx={{
                flexGrow: "1",
              }}
            >
              <IndeterminateLoader
                size={32}
                color={colors.lightTheme.ds.text.neutral.catchy}
              />
            </Flex>
          ) : (
            <Paragraph
              textStyle="ds.body.reduced.regular"
              color="ds.text.neutral.quiet"
            >
              {key.includes("markup")
                ? translate.markup(key, variables)
                : translate(key, variables)}
            </Paragraph>
          )}
        </Flex>
      ))}
    </Flex>
  );
  const getBorderColor = () => {
    if (currentPlan || isStandardPlanRestricted) {
      return "transparent";
    } else if (selected) {
      return "ds.border.brand.standard.active";
    } else {
      return "ds.border.neutral.quiet.idle";
    }
  };
  return (
    <Flex
      flexDirection="column"
      sx={{
        minHeight: "480px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "4px",
        border: `1px solid ${getBorderColor()}`,
        flexGrow: "1",
        flexShrink: 0,
        width: "188px",
        backgroundColor:
          currentPlan || isStandardPlanRestricted
            ? "ds.container.expressive.neutral.supershy.hover"
            : null,
        padding: "16px",
        gap: "16px",
      }}
    >
      <Flex flexDirection="column" gap="16px">
        <Flex flexDirection="column" gap="8px">
          {renderBadges()}

          <Paragraph textStyle="ds.body.standard.strong">
            {translate(heading.key)}
          </Paragraph>
        </Flex>
        <Flex flexDirection="column">
          {renderPrice()}

          <Flex flexDirection="column" sx={{ height: "48px" }}>
            <Paragraph
              textStyle="ds.body.reduced.strong"
              color="ds.text.neutral.quiet"
            >
              {translate(priceDescription1.key, priceDescription1.variables)}
            </Paragraph>
            <Paragraph
              textStyle="ds.body.reduced.strong"
              color="ds.text.neutral.quiet"
            >
              {translate(priceDescription2.key, priceDescription2.variables)}
            </Paragraph>
          </Flex>
        </Flex>
      </Flex>

      {showUpgradeInfobox ? (
        <Infobox mood="brand" title={translate(I18N_KEYS.UPGRADE_INFOBOX)} />
      ) : null}

      {isStandardPlanRestricted ? (
        <Infobox
          mood="neutral"
          title={translate(I18N_KEYS.STANDARD_PLAN_RESTRICTED_INFOBOX)}
        />
      ) : null}

      {renderButtons()}

      {renderFeatures()}

      {limitedOffer ? (
        <Infobox
          mood="brand"
          title={translate(I18N_KEYS.LIMITED_PRICE_INFOBOX)}
        />
      ) : null}

      {footer ? (
        <Flex alignItems="center" gap="9px" sx={{ paddingLeft: "20px" }}>
          <Paragraph
            textStyle="ds.body.reduced.strong"
            color="ds.text.neutral.quiet"
          >
            {footer.key.includes("markup")
              ? translate.markup(footer.key)
              : translate(footer.key)}
          </Paragraph>
        </Flex>
      ) : null}
    </Flex>
  );
};
