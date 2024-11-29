import { Card, Flex, Heading, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useCreditCardPaymentMethodDisplay } from "../../../account/upgrade-success/useCreditCardPaymentDisplay";
import { Row } from "../../../change-plan/components/row";
import { Offer } from "@dashlane/team-admin-contracts";
import { isOfferBusinessTier } from "../../../change-plan/utils";
import { CheckoutOrderSummaryOutput } from "../../types";
import { HorizontalDivider } from "../../../page/support/horizontal-divider";
const I18N_KEYS = {
  EXPIRATION_DATE: "manage_subscription_payment_section_expiration_date",
  HEADER: "team_account_teamplan_changeplan_order_summary_header",
  PAID_BY_CREDIT_CARD: "team_post_trial_checkout_paid",
  PLANS_BUSINESS_NAME: "team_account_teamplan_changeplan_plans_business_name",
  PLANS_STANDARD_NAME: "manage_subscription_plan_name_dashlane_standard",
  PROMO: "team_account_teamplan_upgrade_premium_coupon",
  SEATS_YEAR: "team_post_trial_checkout_seats_for_year",
  TAX: "team_account_teamplan_changeplan_order_summary_tax",
  TOTAL: "team_account_teamplan_total",
  VAT: "team_account_teamplan_vat",
};
interface OrderSummarySuccessProps {
  billingCountry: string | undefined;
  orderSummaryData: CheckoutOrderSummaryOutput;
  selectedOffer: Offer;
}
export const OrderSummarySuccess = ({
  billingCountry,
  orderSummaryData,
  selectedOffer,
}: OrderSummarySuccessProps) => {
  const { translate } = useTranslate();
  const { numberOfSeats, planPrice, promoPrice, subtotal, tax, total } =
    orderSummaryData;
  const { last4DigitsFormatted, cardSvg, expFormatted } =
    useCreditCardPaymentMethodDisplay({ b2c: false });
  const expirationDate = expFormatted
    ? translate(I18N_KEYS.EXPIRATION_DATE, {
        date: expFormatted,
      })
    : null;
  const planName = isOfferBusinessTier(selectedOffer)
    ? translate(I18N_KEYS.PLANS_BUSINESS_NAME)
    : translate(I18N_KEYS.PLANS_STANDARD_NAME);
  const taxCopy = billingCountry === "US" ? I18N_KEYS.TAX : I18N_KEYS.VAT;
  return (
    <Card sx={{ width: "472px" }}>
      <Flex flexDirection="column" gap="16px" sx={{ marginTop: "16px" }}>
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
          <Heading
            as="h3"
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
          >
            {translate(I18N_KEYS.HEADER)}
          </Heading>
          <Heading
            as="h2"
            textStyle="ds.title.section.medium"
            color="ds.text.neutral.catchy"
          >
            {planName}
          </Heading>
        </div>
        <Row
          label={
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.catchy"
            >
              {translate(I18N_KEYS.SEATS_YEAR, {
                cost: translate.price(selectedOffer.currency, planPrice / 100, {
                  notation: "compact",
                }),
                numOfSeats: numberOfSeats,
              })}
            </Paragraph>
          }
          value={
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.catchy"
            >
              {translate.price(selectedOffer.currency, subtotal / 100)}
            </Paragraph>
          }
        />
        {tax !== 0 ? (
          <Row
            label={
              <Paragraph
                textStyle="ds.body.standard.regular"
                color="ds.text.neutral.catchy"
              >
                {translate(taxCopy)}
              </Paragraph>
            }
            value={
              <Paragraph
                textStyle="ds.body.standard.regular"
                color="ds.text.neutral.standard"
              >
                {translate.price(selectedOffer.currency, tax / 100)}
              </Paragraph>
            }
          />
        ) : null}
        {promoPrice ? (
          <Row
            label={
              <Paragraph
                textStyle="ds.body.standard.regular"
                color="ds.text.neutral.catchy"
              >
                {translate(I18N_KEYS.PROMO)}
              </Paragraph>
            }
            value={
              <Paragraph
                textStyle="ds.body.standard.regular"
                color="ds.text.neutral.catchy"
              >
                -{translate.price(selectedOffer.currency, promoPrice / 100)}
              </Paragraph>
            }
          />
        ) : null}
        <HorizontalDivider />
        {total ? (
          <Row
            label={
              <Paragraph
                textStyle="ds.body.standard.strong"
                color="ds.text.neutral.catchy"
              >
                {translate(I18N_KEYS.TOTAL)}
              </Paragraph>
            }
            value={
              <Paragraph
                textStyle="ds.specialty.spotlight.small"
                color="ds.text.neutral.catchy"
              >
                {translate.price(selectedOffer.currency, total / 100)}
              </Paragraph>
            }
          />
        ) : null}
        <Row
          label={
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.catchy"
            >
              {translate(I18N_KEYS.PAID_BY_CREDIT_CARD)}
            </Paragraph>
          }
          value={
            <Flex alignItems="center" gap="8px">
              {cardSvg}
              <Paragraph
                textStyle="ds.body.standard.regular"
                color="ds.text.neutral.standard"
                sx={{ display: "flex", gap: "4px" }}
              >
                <span>••••</span>
                <span>{last4DigitsFormatted}</span>
              </Paragraph>
              <Paragraph
                textStyle="ds.body.standard.regular"
                color="ds.text.neutral.standard"
                sx={{ display: "flex", gap: "12px" }}
              >
                {expirationDate}
              </Paragraph>
            </Flex>
          }
        />
      </Flex>
    </Card>
  );
};
