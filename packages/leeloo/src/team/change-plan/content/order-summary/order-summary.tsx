import { useState } from "react";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { Flex, IndeterminateLoader, Infobox } from "@dashlane/design-system";
import { Button, Paragraph } from "@dashlane/ui-components";
import {
  BillingMethod,
  Offer,
  SpaceTier,
} from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useTeamBillingInformation } from "../../../../libs/hooks/use-team-billing-information";
import { HorizontalRule } from "../../components/HorizontalRule";
import { Row } from "../../components/row";
import { useMidCycleTierUpgrade } from "../../hooks/useMidCycleTierUpgrade";
import { usePromoCode } from "../../hooks/usePromoCode";
import { ChangePlanCard } from "../../layout/change-plan-card";
import { OrderSummaryDataOutput } from "../../types";
import { OrderSummaryBody } from "./order-summary-body";
import { OrderSummaryBodyInvoice } from "./order-summary-body-invoice";
import { OrderSummaryFooter } from "./order-summary-footer";
import { OrderSummaryHeader } from "./order-summary-header";
import { PromoCode } from "./promo-code";
const I18N_KEYS = {
  HEADER: "team_account_teamplan_changeplan_order_summary_header",
  DUE_TODAY: "team_account_teamplan_changeplan_order_summary_due_today_V2",
  CONFIRM_AND_PAY:
    "team_account_teamplan_changeplan_order_summary_confirm_and_pay",
  ERROR_NO_MTU_GRACE: "team_account_teamplan_changeplan_error_mtu_grace",
};
interface OrderSummaryProps {
  currency: string | undefined;
  selectedSeatsQty: number;
  currentSeats: number;
  currentActiveSeats: number;
  currentSpaceTier: SpaceTier;
  selectedOffer?: Offer;
  email: string;
  emailValid: boolean;
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
  setSelectedSeatsQty: (newAdditionalSeats: number) => void;
  setOrderSummaryData: (orderSummaryData: OrderSummaryDataOutput) => void;
}
export const OrderSummary = ({
  currency,
  currentSeats,
  currentActiveSeats,
  currentSpaceTier,
  selectedSeatsQty,
  selectedOffer,
  email,
  emailValid,
  onSuccess,
  onError,
  setSelectedSeatsQty,
  setOrderSummaryData,
}: OrderSummaryProps) => {
  const { translate } = useTranslate();
  const billingInfo = useTeamBillingInformation();
  const hasInvoicePaymentMethod =
    billingInfo?.billingType === BillingMethod.Invoice;
  const {
    promoCode,
    currentPromoCode,
    showInput,
    isLoading,
    setShowInput,
    setCurrentPromoCode,
    validatePromoCode,
    clearPromoCode,
    cancelPromoCode,
    hasError,
    teamOffers: discountedTeamOffers,
  } = usePromoCode({
    selectedOffer,
    selectedSeatsQty,
    currentSeats,
  });
  const {
    isSaving,
    costData,
    changeTierMidCycle,
    isTaxLoading,
    isProratedDiscountLoading,
    isMidCycleGracePeriod,
  } = useMidCycleTierUpgrade({
    selectedOffer,
    discountedTeamOffers,
    currentSeats,
    currentActiveSeats,
    selectedSeatsQty,
    promoCode,
    email,
    onSuccess,
    onError,
  });
  const [isAmountAllowed, setIsAmountAllowed] = useState(true);
  const handleAmountValidInfo = (info: boolean) => {
    setIsAmountAllowed(info);
  };
  const handleClickOnConfirmAndPay = async () => {
    if (hasError || promoCode !== currentPromoCode) {
      const validPromoCode = await validatePromoCode();
      if (!validPromoCode) {
        return;
      }
    }
    logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.OrderSummary,
        button: HermesButton.ConfirmUpgrade,
      })
    );
    changeTierMidCycle(currentPromoCode);
    setOrderSummaryData(costData);
  };
  if (!billingInfo) {
    return null;
  }
  return (
    <ChangePlanCard title={translate(I18N_KEYS.HEADER)}>
      <Flex flexDirection="column" gap="16px" sx={{ marginTop: "16px" }}>
        <OrderSummaryHeader
          selectedOffer={selectedOffer}
          currency={currency}
          costData={costData}
        />

        {hasInvoicePaymentMethod ? (
          <OrderSummaryBodyInvoice
            selectedOffer={selectedOffer}
            costData={costData}
          />
        ) : (
          <>
            <OrderSummaryBody
              currency={currency}
              costData={costData}
              isProratedDiscountLoading={isProratedDiscountLoading}
              isAmountAllowed={isAmountAllowed}
              isTaxLoading={isTaxLoading}
              selectedOffer={selectedOffer}
              setSelectedSeatsQty={setSelectedSeatsQty}
              currentSpaceTier={currentSpaceTier}
              signalAmountValidHandler={handleAmountValidInfo}
            />

            {selectedOffer && currency ? (
              <PromoCode
                currency={currency}
                promoCode={currentPromoCode}
                promoPrice={costData?.promoPrice}
                hasError={hasError}
                showInput={showInput}
                isLoading={isLoading}
                setShowInput={setShowInput}
                onSubmit={validatePromoCode}
                onChange={setCurrentPromoCode}
                onCancel={cancelPromoCode}
                onClear={clearPromoCode}
              />
            ) : null}
            <HorizontalRule />
            <Row
              label={
                <Paragraph bold size="large">
                  {translate(I18N_KEYS.DUE_TODAY)}
                </Paragraph>
              }
              value={
                !currency || isTaxLoading || isProratedDiscountLoading ? (
                  <IndeterminateLoader size={23} mood="neutral" />
                ) : !selectedOffer ? (
                  <Paragraph bold size="large">
                    {`${translate.priceSymbol(currency)}--.--`}
                  </Paragraph>
                ) : costData.total ? (
                  <Paragraph bold size="large">
                    {translate.price(currency, costData.total / 100)}
                  </Paragraph>
                ) : null
              }
            />

            {isSaving ? (
              <Button
                size="large"
                sx={{ width: "100%" }}
                type="button"
                disabled={true}
              >
                <IndeterminateLoader />
              </Button>
            ) : (
              <>
                {isMidCycleGracePeriod && (
                  <Infobox
                    title={translate(I18N_KEYS.ERROR_NO_MTU_GRACE)}
                    mood="danger"
                  />
                )}
                <Button
                  data-testid="btn-confirm-and-pay"
                  size="large"
                  sx={{ width: "100%" }}
                  type="button"
                  disabled={
                    !selectedOffer ||
                    !emailValid ||
                    isLoading ||
                    !isAmountAllowed ||
                    isMidCycleGracePeriod
                  }
                  onClick={handleClickOnConfirmAndPay}
                >
                  {translate(I18N_KEYS.CONFIRM_AND_PAY)}
                </Button>
              </>
            )}
          </>
        )}

        <OrderSummaryFooter
          selectedOffer={selectedOffer}
          currency={currency}
          costData={costData}
        />
      </Flex>
    </ChangePlanCard>
  );
};
