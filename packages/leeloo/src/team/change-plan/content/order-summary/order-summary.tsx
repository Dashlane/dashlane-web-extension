import { Fragment } from 'react';
import { PlanChangeStep } from '@dashlane/hermes';
import { BillingMethod, Offer } from '@dashlane/team-admin-contracts';
import { Button, colors, FlexContainer, jsx, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamBillingInformation } from 'libs/hooks/use-team-billing-information';
import { HorizontalRule } from 'team/change-plan/components/HorizontalRule';
import { Row } from 'team/change-plan/components/row';
import { useMidCycleTierUpgrade } from 'team/change-plan/hooks/useMidCycleTierUpgrade';
import { usePromoCode } from 'team/change-plan/hooks/usePromoCode';
import { ChangePlanCard } from 'team/change-plan/layout/change-plan-card';
import { useMidCycleTierLogs } from 'team/change-plan/logs';
import { OrderSummaryDataOutput } from 'team/change-plan/types';
import { OrderSummaryBody } from './order-summary-body';
import { OrderSummaryBodyInvoice } from './order-summary-body-invoice';
import { OrderSummaryFooter } from './order-summary-footer';
import { OrderSummaryHeader } from './order-summary-header';
import { PromoCode } from './promo-code';
const I18N_KEYS = {
    HEADER: 'team_account_teamplan_changeplan_order_summary_header',
    DUE_TODAY: 'team_account_teamplan_changeplan_order_summary_due_today_V2',
    CONFIRM_AND_PAY: 'team_account_teamplan_changeplan_order_summary_confirm_and_pay',
};
interface OrderSummaryProps {
    currency: string | undefined;
    additionalSeats: number;
    currentSeats: number;
    selectedOffer?: Offer;
    email: string;
    emailValid: boolean;
    onSuccess: () => void;
    onError: () => void;
    setAdditionalSeats: (newAdditionalSeats: number) => void;
    setOrderSummaryData: (orderSummaryData: OrderSummaryDataOutput) => void;
}
export const OrderSummary = ({ currency, currentSeats, additionalSeats, selectedOffer, email, emailValid, onSuccess, onError, setAdditionalSeats, setOrderSummaryData, }: OrderSummaryProps) => {
    const { translate } = useTranslate();
    const billingInfo = useTeamBillingInformation();
    const hasInvoicePaymentMethod = billingInfo?.billingType === BillingMethod.Invoice;
    const { promoCode, currentPromoCode, showInput, isLoading, setShowInput, setCurrentPromoCode, validatePromoCode, clearPromoCode, cancelPromoCode, hasError, teamOffers: discountedTeamOffers, } = usePromoCode({
        selectedOffer,
        additionalSeats,
        currentSeats,
    });
    const { isSaving, costData, changeTierMidCycle, isTaxLoading, isProratedDiscountLoading, } = useMidCycleTierUpgrade({
        selectedOffer,
        discountedTeamOffers,
        currentSeats,
        additionalSeats,
        promoCode,
        email,
        onSuccess,
        onError,
    });
    const { logChangePlanEvent } = useMidCycleTierLogs({
        selectedOffer,
        hasPromo: !!promoCode,
        currentSeats,
        additionalSeats,
        planChangeStep: PlanChangeStep.ConfirmAndPayCta,
    });
    const handleClickOnConfirmAndPay = async () => {
        if (hasError || promoCode !== currentPromoCode) {
            const validPromoCode = await validatePromoCode();
            if (!validPromoCode) {
                return;
            }
        }
        logChangePlanEvent();
        changeTierMidCycle(currentPromoCode);
        setOrderSummaryData(costData);
    };
    if (!billingInfo) {
        return null;
    }
    return (<ChangePlanCard title={translate(I18N_KEYS.HEADER)}>
      <FlexContainer flexDirection="column" gap="16px" sx={{ marginTop: '16px' }}>
        <OrderSummaryHeader selectedOffer={selectedOffer} currency={currency} costData={costData}/>

        {hasInvoicePaymentMethod ? (<OrderSummaryBodyInvoice selectedOffer={selectedOffer} costData={costData}/>) : (<>
            <OrderSummaryBody currency={currency} costData={costData} isProratedDiscountLoading={isProratedDiscountLoading} isTaxLoading={isTaxLoading} selectedOffer={selectedOffer} setAdditionalSeats={setAdditionalSeats}/>

            {selectedOffer && currency ? (<PromoCode currency={currency} promoCode={currentPromoCode} promoPrice={costData?.promoPrice} hasError={hasError} showInput={showInput} isLoading={isLoading} setShowInput={setShowInput} onSubmit={validatePromoCode} onChange={setCurrentPromoCode} onCancel={cancelPromoCode} onClear={clearPromoCode}/>) : null}
            <HorizontalRule />
            <Row label={<Paragraph bold size="large">
                  {translate(I18N_KEYS.DUE_TODAY)}
                </Paragraph>} value={!currency || isTaxLoading || isProratedDiscountLoading ? (<LoadingIcon size={23} color={colors.black}/>) : !selectedOffer ? (<Paragraph bold size="large">
                    {`${translate.priceSymbol(currency)}--.--`}
                  </Paragraph>) : costData.total ? (<Paragraph bold size="large">
                    {translate.price(currency, costData.total / 100)}
                  </Paragraph>) : null}/>

            {isSaving ? (<Button size="large" sx={{ width: '100%' }} type="button" disabled={true}>
                <LoadingIcon />
              </Button>) : (<Button data-testid="btn-confirm-and-pay" size="large" sx={{ width: '100%' }} type="button" disabled={!selectedOffer || !emailValid || isLoading} onClick={handleClickOnConfirmAndPay}>
                {translate(I18N_KEYS.CONFIRM_AND_PAY)}
              </Button>)}
          </>)}

        <OrderSummaryFooter selectedOffer={selectedOffer} currency={currency} costData={costData}/>
      </FlexContainer>
    </ChangePlanCard>);
};
