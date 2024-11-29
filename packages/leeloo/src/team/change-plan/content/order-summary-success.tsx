import { format as dateFormatter } from "date-fns";
import {
  Flex,
  Heading,
  Icon,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import { Tooltip } from "@dashlane/ui-components";
import { Offer } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useBillingCountry } from "../../helpers/useBillingCountry";
import { OrderSummaryDataOutput } from "../types";
import { Row } from "../components/row";
import { HorizontalRule } from "../components/HorizontalRule";
import { OrderSummaryHeader } from "./order-summary/order-summary-header";
interface OrderSummarySuccessProps {
  currency: string | undefined;
  selectedOffer: Offer;
  costData: OrderSummaryDataOutput;
}
export const OrderSummarySuccess = ({
  currency,
  selectedOffer,
  costData,
}: OrderSummarySuccessProps) => {
  const { translate } = useTranslate();
  const { loading, billingCountry } = useBillingCountry();
  if (loading) {
    return <IndeterminateLoader />;
  }
  const taxCopy =
    billingCountry === "US"
      ? "team_account_teamplan_changeplan_order_summary_tax"
      : "team_account_teamplan_vat";
  return (
    <Flex
      flexDirection="column"
      gap="24px"
      sx={{
        borderStyle: "solid",
        borderColor: "ds.border.neutral.quiet.idle",
        borderWidth: "1px",
        borderRadius: "8px",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        padding: "24px",
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h2" textStyle="ds.title.section.medium">
          {translate("team_account_teamplan_changeplan_order_summary_header")}
        </Heading>
        <Paragraph
          textStyle="ds.body.helper.regular"
          color="ds.text.neutral.catchy"
        >
          {dateFormatter(new Date(), "MM/dd/yyyy")}
        </Paragraph>
      </Flex>
      <OrderSummaryHeader
        selectedOffer={selectedOffer}
        currency={currency}
        costData={costData}
      />
      <Flex flexDirection="column" gap="16px">
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.catchy"
          sx={{ padding: "0 10px", fontWeight: "light" }}
        >
          {translate(
            "team_account_teamplan_changeplan_order_summary_seats_total",
            {
              totalSeats: costData.totalSeats,
            }
          )}
        </Paragraph>
        <Row
          label={
            <Paragraph color="ds.text.neutral.standard">
              {translate(
                "team_account_teamplan_changeplan_order_summary_subtotal"
              )}
            </Paragraph>
          }
          value={
            currency ? (
              <Paragraph color="ds.text.neutral.standard">
                {translate.price(currency, costData.subtotal / 100)}
              </Paragraph>
            ) : null
          }
        />
        {costData.tax && currency ? (
          <Row
            label={
              <Paragraph color="ds.text.neutral.quiet">
                {translate(taxCopy)}
              </Paragraph>
            }
            value={
              <Paragraph color="ds.text.neutral.quiet">
                {translate.price(currency, costData.tax / 100)}
              </Paragraph>
            }
          />
        ) : null}
        {costData?.proratedDiscount ? (
          <Row
            label={
              <Flex alignItems="center" gap="5px">
                <Paragraph color="ds.text.neutral.quiet">
                  {translate(
                    "team_account_teamplan_changeplan_order_summary_prorated_discount"
                  )}
                </Paragraph>
                <Tooltip
                  content={translate(
                    "team_account_teamplan_changeplan_order_summary_prorated_discount_tooltip"
                  )}
                >
                  <Icon
                    name="FeedbackInfoOutlined"
                    size="large"
                    color="ds.text.neutral.quiet"
                  />
                </Tooltip>
              </Flex>
            }
            value={
              currency ? (
                <Paragraph color="ds.text.neutral.quiet">
                  {translate.price(currency, costData.proratedDiscount / 100)}
                </Paragraph>
              ) : null
            }
          />
        ) : null}
        {costData?.promoPrice ? (
          <Row
            label={
              <Paragraph color="ds.text.neutral.quiet">
                {translate("team_account_teamplan_upgrade_premium_coupon")}
              </Paragraph>
            }
            value={
              currency ? (
                <Paragraph color="ds.text.neutral.quiet">
                  -{translate.price(currency, costData.promoPrice / 100)}
                </Paragraph>
              ) : null
            }
          />
        ) : null}
        <HorizontalRule />
        {typeof costData?.total === "number" ? (
          <Row
            label={
              <Paragraph textStyle="ds.title.block.medium">
                {translate("team_account_teamplan_total")}
              </Paragraph>
            }
            value={
              currency ? (
                <Paragraph textStyle="ds.title.block.medium">
                  {translate.price(currency, costData.total / 100)}
                </Paragraph>
              ) : null
            }
          />
        ) : null}
      </Flex>
    </Flex>
  );
};
