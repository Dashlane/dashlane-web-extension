import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  IndeterminateLoader,
  Infobox,
  Paragraph,
  Radio,
  RadioGroup,
} from "@dashlane/design-system";
import {
  CarbonEndpointResult,
  DataStatus,
} from "@dashlane/carbon-api-consumers";
import { Country, PremiumStatus } from "@dashlane/communication";
import { useCreditCardPaymentMethodDisplay } from "../../account/upgrade-success/useCreditCardPaymentDisplay";
import { PaymentLoading } from "../../../libs/billing/PaymentLoading";
import { PaymentMethodDetails } from "../../../webapp/subscription-management/payment-method/payment-method-details";
import useTranslate from "../../../libs/i18n/useTranslate";
import { getIsEurozone } from "../helpers";
import { PaymentMethodType, PaymentMethodTypeEnum } from "../types";
const I18N_KEYS = {
  HEADING: "team_post_trial_checkout_payment_selection_heading",
  CREDIT_CARD_RADIO_DESCRIPTION:
    "team_post_trial_checkout_payment_selection_credit_card_description",
  EDIT_BILLING_INFO:
    "team_post_trial_checkout_payment_selection_edit_billing_info",
  ADD_BILLING_INFO:
    "team_post_trial_checkout_payment_selection_add_billing_info",
  INVOICE_RADIO_DESCRIPTION:
    "team_post_trial_checkout_payment_selection_invoice_radio_description",
  INVOICE_ENABLED_DESCRIPTION:
    "team_post_trial_checkout_payment_selection_invoice_enabled_description",
  INVOICE_INFOBOX_LABEL:
    "team_post_trial_checkout_payment_selection_invoice_infobox_label",
};
const isB2C = false;
const getBorderStyle = (invoiceEnabled: boolean, radioValue: string) => {
  if (!invoiceEnabled) {
    return "none";
  }
  return radioValue === PaymentMethodTypeEnum.INVOICE
    ? "1px solid ds.border.brand.standard.active"
    : "1px solid ds.border.neutral.quiet.idle";
};
export interface PaymentSelectionProps {
  handleClickAddBillingInfo: () => void;
  handleClickEditBillingInfo: () => void;
  paymentLoading: boolean;
  premiumStatus: CarbonEndpointResult<PremiumStatus>;
  seats: number;
  setPaymentLoading: (loading: boolean) => void;
  setPaymentMethodType: (paymentMethodType: PaymentMethodType) => void;
}
export const PaymentSelection = ({
  handleClickAddBillingInfo,
  handleClickEditBillingInfo,
  paymentLoading,
  premiumStatus,
  seats,
  setPaymentMethodType,
  setPaymentLoading,
}: PaymentSelectionProps) => {
  const { translate } = useTranslate();
  const [radioValue, setRadioValue] = useState<PaymentMethodType>(
    PaymentMethodTypeEnum.CREDIT_CARD
  );
  useEffect(() => {
    setPaymentMethodType(radioValue);
  }, [radioValue, setPaymentMethodType]);
  useEffect(() => {
    if (seats < 21) {
      setRadioValue(PaymentMethodTypeEnum.CREDIT_CARD);
    }
  }, [seats]);
  const { loading, billingInformation } = useCreditCardPaymentMethodDisplay({
    b2c: isB2C,
  });
  const hasBillingInformation = billingInformation?.last4;
  const isEurozone = getIsEurozone(billingInformation?.country as Country);
  const invoiceEnabled = seats > 20 || isEurozone;
  if (
    premiumStatus.status !== DataStatus.Success ||
    !premiumStatus.data ||
    loading
  ) {
    return <IndeterminateLoader />;
  }
  const renderPaymentContent = () => {
    if (paymentLoading) {
      return (
        <PaymentLoading b2c={isB2C} setPaymentLoading={setPaymentLoading} />
      );
    }
    if (hasBillingInformation) {
      return (
        <Flex
          justifyContent="space-between"
          sx={{ width: "100%", padding: "8px 8px 0" }}
        >
          <PaymentMethodDetails
            b2c={isB2C}
            isAppStoreUser={false}
            isGooglePlayUser={false}
          />
          <Button
            aria-label={translate(I18N_KEYS.EDIT_BILLING_INFO)}
            layout="iconOnly"
            icon="ActionEditOutlined"
            intensity="supershy"
            onClick={handleClickEditBillingInfo}
          />
        </Flex>
      );
    }
    return (
      <Button
        mood="brand"
        intensity="catchy"
        size="large"
        icon="ActionAddOutlined"
        layout="iconLeading"
        onClick={handleClickAddBillingInfo}
      >
        {translate(I18N_KEYS.ADD_BILLING_INFO)}
      </Button>
    );
  };
  return (
    <Card>
      <Heading as="h2">{translate(I18N_KEYS.HEADING)}</Heading>
      <RadioGroup
        groupName="options"
        value={radioValue}
        onChange={(event) =>
          setRadioValue(event.target.value as PaymentMethodType)
        }
      >
        <Flex gap="16px" flexDirection="row" flexWrap="nowrap">
          <div
            sx={{
              width: "50%",
              border:
                radioValue === PaymentMethodTypeEnum.CREDIT_CARD
                  ? "1px solid ds.border.brand.standard.active"
                  : "1px solid ds.border.neutral.quiet.idle",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <Radio
              label={
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  sx={{
                    marginLeft: "-40px",
                    gap: "8px",
                  }}
                >
                  <Icon
                    name="ItemPaymentOutlined"
                    color="ds.text.neutral.standard"
                    size="large"
                  />
                  <Paragraph
                    color="ds.text.neutral.standard"
                    textStyle="ds.body.standard.strong"
                  >
                    {translate(I18N_KEYS.CREDIT_CARD_RADIO_DESCRIPTION)}
                  </Paragraph>
                  {renderPaymentContent()}
                </Flex>
              }
              value={PaymentMethodTypeEnum.CREDIT_CARD}
            />
          </div>
          <div
            sx={{
              width: "50%",
              borderRadius: "8px",
              border: getBorderStyle(invoiceEnabled, radioValue),
              backgroundColor: invoiceEnabled
                ? "ds.container.agnostic.neutral.supershy"
                : "ds.container.agnostic.neutral.quiet",
              padding: "24px",
            }}
          >
            <Radio
              label={
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  sx={{
                    marginLeft: "-40px",
                    gap: "8px",
                  }}
                >
                  <Icon
                    name="ItemTaxNumberOutlined"
                    color={
                      invoiceEnabled
                        ? "ds.text.neutral.catchy"
                        : "ds.text.neutral.quiet"
                    }
                    size="large"
                  />
                  <Paragraph
                    color={
                      invoiceEnabled
                        ? "ds.text.neutral.catchy"
                        : "ds.text.neutral.quiet"
                    }
                    textStyle="ds.body.standard.strong"
                  >
                    {translate(I18N_KEYS.INVOICE_RADIO_DESCRIPTION)}
                  </Paragraph>
                  {invoiceEnabled ? (
                    <Paragraph
                      color="ds.text.neutral.standard"
                      sx={{ textAlign: "center" }}
                    >
                      {translate(I18N_KEYS.INVOICE_ENABLED_DESCRIPTION)}
                    </Paragraph>
                  ) : (
                    <Infobox
                      title={translate(I18N_KEYS.INVOICE_INFOBOX_LABEL)}
                    />
                  )}
                </Flex>
              }
              value={PaymentMethodTypeEnum.INVOICE}
              disabled={!invoiceEnabled}
            />
          </div>
        </Flex>
      </RadioGroup>
    </Card>
  );
};
