import { Paragraph, ThemeUIStyleObject } from "@dashlane/design-system";
import { Offer } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { UseMidCycleTierUpgradeOutput } from "../../hooks/useMidCycleTierUpgrade";
import { isOfferBusinessTier } from "../../utils";
const planHeaderStyles: ThemeUIStyleObject = {
  display: "flex",
  alignItems: "center",
  padding: "12px 8px",
  borderRadius: "8px",
  justifyContent: "space-between",
  backgroundColor: "ds.container.agnostic.neutral.quiet",
};
const I18N_KEYS = {
  SELECT_PLAN: "team_account_teamplan_changeplan_order_summary_select_plan",
  PLANS_BUSINESS_NAME: "team_account_teamplan_changeplan_plans_business_name",
  PLANS_TEAM_NAME: "team_account_teamplan_changeplan_plans_team_name",
  ORDER_SUMMARY_SEAT_YEAR:
    "team_account_teamplan_changeplan_order_summary_seat_year",
};
interface HeaderProps {
  selectedOffer?: Offer;
  currency?: string;
  costData: UseMidCycleTierUpgradeOutput["costData"];
}
export const OrderSummaryHeader = ({
  selectedOffer,
  currency,
  costData,
}: HeaderProps) => {
  const { translate } = useTranslate();
  if (!selectedOffer || !currency) {
    return (
      <div sx={planHeaderStyles}>
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.brand.quiet"
        >
          {translate(I18N_KEYS.SELECT_PLAN)}
        </Paragraph>
      </div>
    );
  }
  return (
    <div sx={planHeaderStyles} data-testid="order-summary-plan-name">
      <Paragraph textStyle="ds.body.reduced.strong" color="ds.text.brand.quiet">
        {isOfferBusinessTier(selectedOffer)
          ? translate(I18N_KEYS.PLANS_BUSINESS_NAME)
          : translate(I18N_KEYS.PLANS_TEAM_NAME)}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.brand.quiet"
      >
        {translate(I18N_KEYS.ORDER_SUMMARY_SEAT_YEAR, {
          cost: translate.price(currency, costData.seatPrice / 100, {
            notation: "compact",
          }),
        })}
      </Paragraph>
    </div>
  );
};
