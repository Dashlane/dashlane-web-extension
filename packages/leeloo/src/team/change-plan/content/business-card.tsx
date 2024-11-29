import { Offer } from "@dashlane/team-admin-contracts";
import {
  AddIcon,
  Button,
  colors,
  Link,
  Paragraph,
} from "@dashlane/ui-components";
import {
  Badge,
  Flex,
  Heading,
  IndeterminateLoader,
  Infobox,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useLimitedBusinessOfferData } from "../../limited-business-offer/use-limited-business-offer-data";
import { getMonthlySeatPrice } from "../utils";
const SSO_URL = "__REDACTED__";
const SCIM_URL = "__REDACTED__";
const FAMILY_PLAN_URL = "__REDACTED__";
const I18N_KEYS = {
  PLAN_RECOMMENDED: "team_account_teamplan_changeplan_plans_plan_recommended",
  PLAN_LIMITED_OFFER:
    "team_account_teamplan_changeplan_plans_plan_limited_offer",
  BUSINESS_HEADER: "team_account_teamplan_changeplan_plans_business_header",
  BUSINESS_NAME: "team_account_teamplan_changeplan_plans_business_name",
  PLAN_SEATS: "team_account_teamplan_changeplan_plans_seat",
  BILLED_ANNUALLY: "team_account_teamplan_changeplan_plans_billed_anually",
  SAML: "team_account_teamplan_changeplan_plans_business_saml_markup",
  SCIM_PROVISIONING:
    "team_account_teamplan_changeplan_plans_business_scim_provisioning",
  FAMILY_PLAN:
    "team_account_teamplan_changeplan_plans_business_free_family_plan_markup",
  PLANS_SELECTED: "team_account_teamplan_changeplan_plans_selected",
  PLANS_SELECT: "team_account_teamplan_changeplan_plans_select",
  PREVIOUS_PRICE: "team_account_teamplan_changeplan_plans_previous_price",
  LIMITED_PRICE_INFOBOX:
    "team_account_teamplan_changeplan_plans_limited_price_infobox",
};
interface BusinessCardProps {
  handleSelectClick: undefined | (() => void);
  selected: boolean;
  businessOffer: Offer | undefined;
  showRecommendedBadge?: boolean;
}
export const BusinessCard = ({
  handleSelectClick,
  selected,
  businessOffer,
  showRecommendedBadge = false,
}: BusinessCardProps) => {
  const { translate } = useTranslate();
  const limitedBusinessOfferData = useLimitedBusinessOfferData();
  const monthlySeatPrice = businessOffer
    ? getMonthlySeatPrice({
        offer: businessOffer,
      })
    : null;
  return (
    <Flex
      flexDirection="column"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "18px 28px 32px",
        border: `1px solid ${colors.dashGreen05}`,
        borderRadius: "4px",
        gap: "18px",
      }}
      role="contentinfo"
    >
      {limitedBusinessOfferData.hasLimitedOffer ? (
        <Badge
          mood="brand"
          intensity="catchy"
          label={translate(I18N_KEYS.PLAN_LIMITED_OFFER)}
        />
      ) : showRecommendedBadge ? (
        <Badge
          mood="brand"
          intensity="quiet"
          label={translate(I18N_KEYS.PLAN_RECOMMENDED)}
        />
      ) : null}
      <Flex fullWidth gap="12px">
        <Flex fullWidth>
          <Flex sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Heading as="h2" color="ds.text.neutral.standard">
              {translate(I18N_KEYS.BUSINESS_NAME)}
            </Heading>
          </Flex>
          <div>
            {businessOffer?.currency && monthlySeatPrice ? (
              <Flex flexDirection="column" alignItems="flex-end">
                <Flex alignItems="flex-end" gap="0" flexDirection="column">
                  <Paragraph size="small">
                    {translate.price(
                      businessOffer.currency,
                      monthlySeatPrice / 100,
                      {
                        notation: "compact",
                      }
                    )}{" "}
                    {translate(I18N_KEYS.PLAN_SEATS)}
                  </Paragraph>
                  {limitedBusinessOfferData.hasLimitedOffer ? (
                    <Paragraph size="small" color="ds.text.neutral.quiet">
                      {translate(I18N_KEYS.PREVIOUS_PRICE)}{" "}
                      <span sx={{ textDecoration: "line-through" }}>
                        {limitedBusinessOfferData.translatedEquivalentPrice}
                      </span>
                    </Paragraph>
                  ) : null}
                </Flex>
                <Paragraph color="ds.text.neutral.quiet" size="x-small">
                  {translate(I18N_KEYS.BILLED_ANNUALLY)}
                </Paragraph>
              </Flex>
            ) : (
              <IndeterminateLoader size={16} mood="neutral" />
            )}
          </div>
        </Flex>
        <hr
          style={{
            width: "100%",
            borderTop: `1px solid ${colors.grey02}`,
            borderBottom: "0",
            margin: "0",
          }}
        />
      </Flex>
      <div sx={{ flex: 1 }}>
        <Flex flexDirection="column" gap="6px">
          <Paragraph color={colors.grey00} size="x-small">
            {translate(I18N_KEYS.BUSINESS_HEADER)}
          </Paragraph>
          <Flex
            alignItems="center"
            gap="9px"
            sx={{
              marginTop: "10px",
            }}
          >
            <AddIcon size={8} />
            <Paragraph size="x-small" color={colors.black}>
              {translate.markup(
                I18N_KEYS.SAML,
                { ssoUrl: SSO_URL },
                { linkTarget: "_blank" },
                { color: colors.black }
              )}
            </Paragraph>
          </Flex>
          <Flex alignItems="center" gap="9px">
            <AddIcon size={8} />
            <Paragraph size="x-small">
              <Link rel="noopener noreferrer" href={SCIM_URL} target="_blank">
                {translate(I18N_KEYS.SCIM_PROVISIONING)}
              </Link>
            </Paragraph>
          </Flex>
          <Flex alignItems="center" gap="9px">
            <AddIcon size={8} />
            <Paragraph size="x-small" color={colors.black}>
              {translate.markup(
                I18N_KEYS.FAMILY_PLAN,
                { familyPlanUrl: FAMILY_PLAN_URL },
                { linkTarget: "_blank" },
                { color: colors.black }
              )}
            </Paragraph>
          </Flex>
        </Flex>
      </div>
      {limitedBusinessOfferData.hasLimitedOffer ? (
        <Infobox
          title={translate(I18N_KEYS.LIMITED_PRICE_INFOBOX)}
          mood="brand"
        />
      ) : null}
      {businessOffer ? (
        selected ? (
          <Button
            sx={{ width: "100%" }}
            disabled
            nature="secondary"
            size="small"
            type="button"
          >
            {translate(I18N_KEYS.PLANS_SELECTED)}
          </Button>
        ) : (
          <Button
            data-testid="btn-business-select"
            sx={{ width: "100%" }}
            size="small"
            type="button"
            onClick={handleSelectClick}
          >
            {translate(I18N_KEYS.PLANS_SELECT)}
          </Button>
        )
      ) : (
        <Flex justifyContent="center" fullWidth>
          <IndeterminateLoader size={30} mood="neutral" />
        </Flex>
      )}
    </Flex>
  );
};
