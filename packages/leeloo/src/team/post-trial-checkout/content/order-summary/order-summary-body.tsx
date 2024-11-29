import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Icon,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import {
  Button as HermesButton,
  PageView,
  PaymentMethod,
  PaymentStatus,
  Plan,
  PriceCurrencyCode,
  UserClickEvent,
  UserPurchaseSubscriptionEvent,
} from "@dashlane/hermes";
import { Offer, teamPlanUpdateApi } from "@dashlane/team-admin-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { HorizontalDivider } from "../../../page/support/horizontal-divider";
import { Row } from "../../../change-plan/components/row";
import { useTaxInformation } from "../../../change-plan/hooks/use-tax-information";
import { usePromoCode } from "../../hooks/use-promo-code";
import { DASHLANE_SUPPORT_PURCHASE_ORDER } from "../../../urls";
import { openUrl } from "../../../../libs/external-urls";
import {
  CheckoutOrderSummaryOutput,
  PaymentMethodType,
  PostTrialCheckoutState,
} from "../../types";
import { logEvent, logPageView } from "../../../../libs/logs/logEvent";
import { PromoCode } from "./promo-code";
import { getPaymentErrorStatus } from "./getPaymentErrorStatus";
const I18N_KEYS = {
  CONFIRM_AND_PAY:
    "team_account_teamplan_changeplan_order_summary_confirm_and_pay",
  GENERIC_ERROR: "team_post_trial_checkout_error_process_request",
  PAYMENT_DECLINED_ERROR: "team_post_trial_checkout_error_payment_declined",
  REQUEST_PURCHASE_ORDER: "team_post_trial_checkout_request_purchase_order",
  TAX: "team_account_teamplan_changeplan_order_summary_tax",
  TAX_TOOLTIP: "team_account_teamplan_changeplan_order_summary_tax_tooltip",
  TOTAL: "team_account_teamplan_total",
  VAT: "team_account_teamplan_vat",
};
interface OrderSummaryBodyProps {
  billingCountry: string | undefined;
  isSeatsQtyValid: boolean;
  paymentMethodType: PaymentMethodType;
  planPrice: number;
  selectedOffer?: Offer;
  selectedSeatsQty: number;
  setErrorMessage: (errorMessage: string) => void;
  setHasTax: (hasTaxAmount: boolean) => void;
  setRenewalPrice: (selectedPlanRenwalPrice: number) => void;
  setOrderSummaryData: (orderSummaryData: CheckoutOrderSummaryOutput) => void;
  setPostTrialCheckoutState: (
    newPostTrialCheckoutState: PostTrialCheckoutState
  ) => void;
}
export const OrderSummaryBody = ({
  billingCountry,
  isSeatsQtyValid,
  paymentMethodType,
  planPrice,
  selectedOffer,
  selectedSeatsQty,
  setErrorMessage,
  setHasTax,
  setOrderSummaryData,
  setPostTrialCheckoutState,
  setRenewalPrice,
}: OrderSummaryBodyProps) => {
  const { translate } = useTranslate();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { upgradeTeamWithExistingCc } = useModuleCommands(teamPlanUpdateApi);
  const subtotal = planPrice * selectedSeatsQty;
  const {
    cancelPromoCode,
    clearPromoCode,
    currentPromoCode,
    discountedSeatPrice,
    hasError,
    isLoading,
    planId,
    setCurrentPromoCode,
    setShowInput,
    showInput,
    validatePromoCode,
  } = usePromoCode({
    selectedOffer,
    selectedSeatsQty,
  });
  const discountedSubtotal = discountedSeatPrice * selectedSeatsQty;
  const promoPrice = subtotal - discountedSubtotal;
  const preTaxAmount =
    discountedSeatPrice !== 0 ? discountedSubtotal : subtotal;
  const { isLoading: isTaxInformationLoading, taxInformation } =
    useTaxInformation({
      total: preTaxAmount,
      initialSkip: billingCountry === undefined,
    });
  useEffect(() => {
    if (discountedSeatPrice === 0 && taxInformation?.amount !== undefined) {
      setHasTax(taxInformation.amount > 0);
      setRenewalPrice(subtotal + taxInformation.amount);
    }
  }, [setHasTax, setRenewalPrice, subtotal, taxInformation?.amount]);
  const taxCopy =
    !billingCountry || billingCountry === "US" ? I18N_KEYS.TAX : I18N_KEYS.VAT;
  const taxAmount = (!isTaxInformationLoading && taxInformation?.amount) || 0;
  const total = taxAmount ? preTaxAmount + taxAmount : undefined;
  const buttonCopy =
    paymentMethodType === "invoice"
      ? I18N_KEYS.REQUEST_PURCHASE_ORDER
      : I18N_KEYS.CONFIRM_AND_PAY;
  const handleInvoice = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.RequestPurchaseOrder,
      })
    );
    openUrl(DASHLANE_SUPPORT_PURCHASE_ORDER);
  };
  const getErrorMessage = (errorTag: string) => {
    if (errorTag === "UNSUPPORTED_PAYMENT_MEAN") {
      return translate(I18N_KEYS.PAYMENT_DECLINED_ERROR);
    } else {
      return translate(I18N_KEYS.GENERIC_ERROR);
    }
  };
  const handlePayment = async (planOffer: string) => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.ConfirmAndPay,
      })
    );
    setIsSaving(() => true);
    const response = await upgradeTeamWithExistingCc({
      planId: planOffer,
      countryCode: billingCountry,
      membersNumber: selectedSeatsQty,
      amountToPayInCents: preTaxAmount,
      taxesToPayInCents: taxAmount,
      couponCode: currentPromoCode,
    });
    const purchasedPlan = planOffer.includes("standard")
      ? Plan.Standard
      : Plan.Business;
    const paymentCurrency =
      PriceCurrencyCode[
        (selectedOffer?.currency
          ? selectedOffer.currency.charAt(0).toUpperCase() +
            selectedOffer.currency.slice(1)
          : "Usd") as keyof typeof PriceCurrencyCode
      ];
    setIsSaving(() => false);
    if (response.tag === "success") {
      logEvent(
        new UserPurchaseSubscriptionEvent({
          paymentAmount: preTaxAmount,
          paymentCurrency,
          paymentMethod: PaymentMethod.CreditCard,
          paymentStatus: PaymentStatus.Success,
          purchasedPlan,
          purchasedSeatsCount: selectedSeatsQty,
        })
      );
      setPostTrialCheckoutState(PostTrialCheckoutState.SUCCESS);
      setOrderSummaryData({
        numberOfSeats: selectedSeatsQty,
        planPrice,
        promoPrice: discountedSeatPrice !== 0 ? promoPrice : undefined,
        subtotal,
        tax: taxAmount,
        total,
      });
      logPageView(PageView.TacCheckoutSuccess);
    } else {
      const paymentErrorTag = response.error.tag;
      logEvent(
        new UserPurchaseSubscriptionEvent({
          paymentAmount: preTaxAmount,
          paymentCurrency,
          paymentMethod: PaymentMethod.CreditCard,
          paymentStatus: getPaymentErrorStatus(paymentErrorTag),
          purchasedPlan,
          purchasedSeatsCount: selectedSeatsQty,
        })
      );
      setErrorMessage(getErrorMessage(paymentErrorTag));
    }
  };
  if (!selectedOffer) {
    return null;
  }
  const handlePaymentAction = () => {
    if (paymentMethodType === "invoice") {
      return handleInvoice();
    }
    return handlePayment(planId || selectedOffer.name);
  };
  const buttonContent = () => {
    if (isSaving) {
      return <IndeterminateLoader />;
    }
    return translate(buttonCopy);
  };
  const isButtonDisabled =
    (isTaxInformationLoading && paymentMethodType !== "invoice") ||
    !isSeatsQtyValid;
  return (
    <>
      <HorizontalDivider />
      <Row
        label={
          <Paragraph
            textStyle="ds.body.standard.strong"
            color="ds.text.neutral.catchy"
          >
            {translate(
              "team_account_teamplan_changeplan_order_summary_subtotal"
            )}
          </Paragraph>
        }
        value={
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.standard"
          >
            {translate.price(selectedOffer.currency, subtotal / 100)}
          </Paragraph>
        }
      />
      <Row
        label={
          <Paragraph
            textStyle="ds.body.standard.strong"
            color="ds.text.neutral.catchy"
          >
            <Flex flexDirection="row" gap="4px">
              {translate(taxCopy)}
              <Icon
                color="ds.text.neutral.quiet"
                name="FeedbackInfoOutlined"
                tooltip={{
                  content: translate(I18N_KEYS.TAX_TOOLTIP),
                }}
              />
            </Flex>
          </Paragraph>
        }
        value={
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.standard"
          >
            {translate.price(selectedOffer.currency, taxAmount / 100)}
          </Paragraph>
        }
      />
      <PromoCode
        currency={selectedOffer.currency}
        hasError={hasError}
        isLoading={isLoading}
        onCancel={cancelPromoCode}
        onChange={setCurrentPromoCode}
        onClear={clearPromoCode}
        onSubmit={validatePromoCode}
        promoCode={currentPromoCode}
        promoPrice={promoPrice}
        setShowInput={setShowInput}
        showInput={showInput}
      />
      <HorizontalDivider />
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
          isTaxInformationLoading ? (
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.standard"
            >
              {translate.price(selectedOffer.currency, subtotal / 100)}
            </Paragraph>
          ) : total ? (
            <Paragraph
              textStyle="ds.specialty.spotlight.small"
              color="ds.text.neutral.catchy"
            >
              {translate.price(selectedOffer.currency, total / 100)}
            </Paragraph>
          ) : null
        }
      />
      <Button
        size="large"
        sx={{ width: "100%" }}
        type="button"
        disabled={isButtonDisabled}
        onClick={handlePaymentAction}
      >
        {buttonContent()}
      </Button>
    </>
  );
};
