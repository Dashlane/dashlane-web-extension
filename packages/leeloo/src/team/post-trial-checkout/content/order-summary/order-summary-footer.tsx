import { addYears } from "date-fns";
import { Flex, LinkButton, Paragraph } from "@dashlane/design-system";
import { Offer } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { LOCALE_FORMAT } from "../../../../libs/i18n/helpers";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "../../../urls";
import { useCreditCardPaymentMethodDisplay } from "../../../account/upgrade-success/useCreditCardPaymentDisplay";
const I18N_KEYS = {
  ADD_CREDIT_CARD: "team_post_trial_checkout_add_credit_card",
  CANCEL_SUBSCRIPTION: "team_post_trial_checkout_cancel_subscription",
  CREDIT_CARD_REQUIRED: "team_post_trial_checkout_credit_card_required",
  FOOTER_HEADER: "team_account_teamplan_changeplan_order_summary_footer_header",
  FOOTER_MARKUP: "team_account_teamplan_changeplan_order_summary_footer_markup",
  FOOTER_RENEWAL:
    "team_account_teamplan_changeplan_order_summary_footer_renewal",
  PAYMENT_METHOD_REQUIRED: "team_post_trial_checkout_payment_method_required",
  RENEWAL_VAT: "team_account_teamplan_changeplan_order_summary_renewal_vat",
};
interface OrderSummaryFooterProps {
  billingCountry: string | undefined;
  handleClickAddBillingInfo: () => void;
  hasTax: boolean;
  renewalPrice: number;
  selectedOffer?: Offer;
  selectedSeatsQty: number;
}
export const OrderSummaryFooter = ({
  billingCountry,
  handleClickAddBillingInfo,
  hasTax,
  renewalPrice,
  selectedOffer,
  selectedSeatsQty,
}: OrderSummaryFooterProps) => {
  const { translate } = useTranslate();
  const renewalDate = addYears(new Date(), 1);
  const taxCopy =
    billingCountry === "US" ? I18N_KEYS.FOOTER_RENEWAL : I18N_KEYS.RENEWAL_VAT;
  const paragraphCopy = hasTax ? taxCopy : I18N_KEYS.FOOTER_HEADER;
  const { billingInformation } = useCreditCardPaymentMethodDisplay({
    b2c: false,
  });
  const hasBillingInformation = billingInformation?.last4;
  if (!selectedOffer) {
    return null;
  }
  if (!hasBillingInformation) {
    return (
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="baseline"
        sx={{ marginTop: "8px" }}
      >
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.warning.quiet"
        >
          {selectedSeatsQty > 20
            ? translate(I18N_KEYS.PAYMENT_METHOD_REQUIRED)
            : translate(I18N_KEYS.CREDIT_CARD_REQUIRED)}
        </Paragraph>
        <LinkButton
          color="ds.text.brand.standard"
          isExternal
          onClick={handleClickAddBillingInfo}
          sx={{ marginRight: "8px" }}
        >
          {translate(I18N_KEYS.ADD_CREDIT_CARD)}
        </LinkButton>
      </Flex>
    );
  }
  return renewalPrice > 0 ? (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "10px",
      }}
    >
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.standard"
      >
        {translate(paragraphCopy, {
          price: translate.price(selectedOffer.currency, renewalPrice / 100),
          date: translate.shortDate(renewalDate, LOCALE_FORMAT.ll),
        })}
        <br />
        {translate(I18N_KEYS.CANCEL_SUBSCRIPTION)}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.helper.regular"
        color="ds.text.neutral.quiet"
      >
        {translate.markup(
          I18N_KEYS.FOOTER_MARKUP,
          {
            privacyPolicyUrl: PRIVACY_POLICY,
            termsUrl: TERMS_OF_SERVICE,
          },
          {
            linkTarget: "_blank",
          }
        )}
      </Paragraph>
    </div>
  ) : null;
};
