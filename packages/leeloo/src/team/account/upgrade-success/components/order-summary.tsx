import React from "react";
import { colors, Flex, Heading, Paragraph } from "@dashlane/design-system";
import { GetPlanPricingDetailsResult } from "@dashlane/team-admin-contracts";
import { format as dateFormatter } from "date-fns";
import { InfoCircleIcon, Tooltip } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useBillingSeatDetails } from "../../add-seats/useBillingSeatDetails";
import { CostDetailsForTier } from "../../add-seats/teamPlanCalculator";
import { BillingDetails } from "../../add-seats/add-seats-wrapper";
import { SMALL_CARD_CONTAINER } from "./styles";
interface RowProps {
  label?: React.ReactNode;
  value?: React.ReactNode;
  alignItems?: string;
}
export const Row = ({ label, value, ...props }: RowProps) => (
  <Flex justifyContent="flex-end" {...props}>
    {label ? (
      <Flex alignItems="center" sx={{ flex: 1 }}>
        {label}
      </Flex>
    ) : null}
    {value ? <Flex alignItems="center">{value}</Flex> : null}
  </Flex>
);
interface OrderSummaryProps {
  billingDetails: BillingDetails | GetPlanPricingDetailsResult;
  additionalSeatsDetails: CostDetailsForTier[];
}
export const OrderSummary = ({
  billingDetails,
  additionalSeatsDetails,
}: OrderSummaryProps) => {
  const { translate } = useTranslate();
  const {
    additionalSeatsCount,
    additionalSeatsTaxesTranslation,
    hasTax,
    tierPriceTranslation,
    proratedDiscountTranslation,
    hasProratedDiscount,
    dueTodayTranslation,
  } = useBillingSeatDetails({
    billingDetails,
    additionalSeatsDetails,
  });
  return (
    <Flex flexDirection="column" gap="32px" sx={SMALL_CARD_CONTAINER}>
      <Row
        alignItems="end"
        label={
          <Heading as="h2" color="ds.text.neutral.catchy">
            {translate("team_account_addseats_success_order_summary_header")}
          </Heading>
        }
        value={
          <Paragraph
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
          >
            {dateFormatter(new Date(), "MM/dd/yyyy")}
          </Paragraph>
        }
      />
      <Flex flexDirection="column" gap="16px">
        <Row
          label={
            <Paragraph color="ds.text.neutral.standard">
              {translate("team_account_teamplan_upgrade_new_seat", {
                count: additionalSeatsCount,
              })}
            </Paragraph>
          }
          value={
            <Paragraph color="ds.text.neutral.standard">
              {tierPriceTranslation}
            </Paragraph>
          }
        />
        {hasTax ? (
          <Row
            label={
              <Paragraph color="ds.text.neutral.standard">
                {translate("team_account_addseats_success_order_summary_tax")}
              </Paragraph>
            }
            value={
              <Paragraph color="ds.text.neutral.standard">
                {additionalSeatsTaxesTranslation}
              </Paragraph>
            }
          />
        ) : null}
        {hasProratedDiscount ? (
          <Row
            label={
              <Flex alignItems="center" gap="5px">
                <Paragraph color="ds.text.neutral.standard">
                  {translate(
                    "team_account_addseats_success_order_summary_prorated_discount"
                  )}
                </Paragraph>
                <Tooltip
                  content={translate(
                    "team_account_addseats_success_order_summary_prorated_discount_tooltip"
                  )}
                >
                  <InfoCircleIcon size={16} color="ds.text.neutral.standard" />
                </Tooltip>
              </Flex>
            }
            value={
              <Paragraph color="ds.text.neutral.standard">
                {proratedDiscountTranslation}
              </Paragraph>
            }
          />
        ) : null}
        <div
          style={{
            width: "100%",
            borderColor: colors.lightTheme.ds.border.neutral.quiet.idle,
            borderWidth: "1px",
            borderStyle: "solid",
            borderBottom: "0",
            margin: "0",
          }}
        />
        <Row
          label={
            <Paragraph
              textStyle="ds.body.standard.strong"
              color="ds.text.neutral.standard"
            >
              {translate("team_account_addseats_success_order_summary_total")}
            </Paragraph>
          }
          value={
            <Paragraph
              textStyle="ds.body.standard.strong"
              color="ds.text.neutral.standard"
            >
              {dueTodayTranslation}
            </Paragraph>
          }
        />
      </Flex>
    </Flex>
  );
};
