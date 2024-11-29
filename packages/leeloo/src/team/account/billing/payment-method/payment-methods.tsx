import { useState } from "react";
import {
  Card,
  ExpressiveIcon,
  Heading,
  LinkButton,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { BillingMethod } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { openUrl } from "../../../../libs/external-urls";
import { PaymentLoading } from "../../../../libs/billing/PaymentLoading";
import { useTeamBillingInformation } from "../../../../libs/hooks/use-team-billing-information";
import { DASHLANE_PAY_WITH_INVOICE } from "../../../urls";
import { useCreditCardPaymentMethodDisplay } from "../../upgrade-success/useCreditCardPaymentDisplay";
import { Divider } from "../../components/divider";
import { CreditCardInfo } from "./credit-card-info";
const I18N_KEYS = {
  PAYMENT_METHOD_SINGULAR: "account_summary_payment_method_singular",
  PAYMENT_METHOD_PLURAL: "account_summary_payment_method_plural",
  ADD_NEW_BUTTON: "account_summary_payment_card_add_new_button",
  UPDATE_BUTTON: "account_summary_payment_card_update_button",
  NO_PAYMENT_METHOD: "account_summary_no_payment_method",
  SUBSCRIPTION_PAYMENT_METHOD: "account_summary_subscription_payment_method",
  SEATS_PAYMENT_METHOD: "account_summary_seats_payment_method",
  NO_CARD: "account_summary_no_payment_card_added",
  CONTACT_SUPPORT_FOR_CHANGE: "account_summary_contact_support",
  PAYING_BY_INVOICE: "account_summary_paying_by_invoice",
};
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
  SECTION_CONTAINER: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  INVOICE_CONTAINER: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  CARD: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
};
export const PaymentMethods = () => {
  const { translate } = useTranslate();
  const billingInformation = useTeamBillingInformation();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const {
    last4DigitsFormatted,
    hasCreditCardPaymentMethod,
    cardSvg,
    isExpired,
    expFormatted,
    pollUntilCardUpdate,
  } = useCreditCardPaymentMethodDisplay({});
  if (!billingInformation) {
    return null;
  }
  const isInvoice = billingInformation.billingType === BillingMethod.Invoice;
  const noBillingMethod = !billingInformation.billingType;
  const handleClickOnCardUpdateOrAdd = () => {
    pollUntilCardUpdate();
    setPaymentLoading(true);
  };
  const handleClickOnContactSupport = () => {
    openUrl(DASHLANE_PAY_WITH_INVOICE);
  };
  const getHeadingButtonProperties = () => {
    if (noBillingMethod) {
      return {
        key: I18N_KEYS.ADD_NEW_BUTTON,
        onClick: handleClickOnCardUpdateOrAdd,
      };
    } else if (!isInvoice) {
      return {
        key: I18N_KEYS.UPDATE_BUTTON,
        onClick: handleClickOnCardUpdateOrAdd,
      };
    }
    return null;
  };
  const headingButtonProperties = getHeadingButtonProperties();
  return (
    <Card sx={SX_STYLES.CARD}>
      <div sx={{ display: "flex", justifyContent: "space-between" }}>
        <Heading
          textStyle="ds.title.section.medium"
          color="ds.text.neutral.catchy"
          as="h2"
        >
          {translate(
            isInvoice
              ? I18N_KEYS.PAYMENT_METHOD_PLURAL
              : I18N_KEYS.PAYMENT_METHOD_SINGULAR
          )}
        </Heading>
        {paymentLoading ? (
          <PaymentLoading b2c={false} setPaymentLoading={setPaymentLoading} />
        ) : (
          headingButtonProperties && (
            <LinkButton
              isExternal
              onClick={headingButtonProperties.onClick}
              sx={{ cursor: "pointer" }}
            >
              {translate(headingButtonProperties.key)}
            </LinkButton>
          )
        )}
      </div>

      {noBillingMethod ? (
        <Paragraph color="ds.text.inverse.quiet">
          {translate(I18N_KEYS.NO_PAYMENT_METHOD)}
        </Paragraph>
      ) : null}

      {isInvoice ? (
        <div>
          <div sx={SX_STYLES.INVOICE_CONTAINER}>
            <div sx={SX_STYLES.SECTION_CONTAINER}>
              <Paragraph
                textStyle="ds.title.supporting.small"
                color="ds.text.neutral.quiet"
              >
                {translate(I18N_KEYS.SUBSCRIPTION_PAYMENT_METHOD)}
              </Paragraph>
              <LinkButton isExternal onClick={handleClickOnContactSupport}>
                {translate(I18N_KEYS.CONTACT_SUPPORT_FOR_CHANGE)}
              </LinkButton>
            </div>
            <div sx={{ display: "flex", gap: "8px" }}>
              <ExpressiveIcon name="ItemTaxNumberOutlined" mood="neutral" />
              <Paragraph sx={{ alignSelf: "center" }}>
                {translate(I18N_KEYS.PAYING_BY_INVOICE)}
              </Paragraph>
            </div>
          </div>

          <Divider />

          <div>
            <div sx={SX_STYLES.SECTION_CONTAINER}>
              <Paragraph
                textStyle="ds.title.supporting.small"
                color="ds.text.neutral.quiet"
              >
                {translate(I18N_KEYS.SEATS_PAYMENT_METHOD)}
              </Paragraph>
              <LinkButton isExternal onClick={handleClickOnCardUpdateOrAdd}>
                {translate(
                  hasCreditCardPaymentMethod
                    ? I18N_KEYS.UPDATE_BUTTON
                    : I18N_KEYS.ADD_NEW_BUTTON
                )}
              </LinkButton>
            </div>

            {hasCreditCardPaymentMethod &&
            cardSvg &&
            last4DigitsFormatted &&
            expFormatted ? (
              <CreditCardInfo
                cardSvg={cardSvg}
                last4DigitsFormatted={last4DigitsFormatted}
                isExpired={isExpired}
                expFormatted={expFormatted}
              />
            ) : (
              <Paragraph color="ds.text.inverse.quiet">
                {translate(I18N_KEYS.NO_CARD)}
              </Paragraph>
            )}
          </div>
        </div>
      ) : cardSvg && last4DigitsFormatted && expFormatted ? (
        <CreditCardInfo
          cardSvg={cardSvg}
          last4DigitsFormatted={last4DigitsFormatted}
          isExpired={isExpired}
          expFormatted={expFormatted}
        />
      ) : null}
    </Card>
  );
};
