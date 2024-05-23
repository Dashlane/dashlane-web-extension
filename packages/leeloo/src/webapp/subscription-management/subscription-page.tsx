import React, { useEffect, useState } from 'react';
import { PageView, SurveyAnswer } from '@dashlane/hermes';
import { colors, FlexContainer } from '@dashlane/ui-components';
import { logPageView } from 'libs/logs/logEvent';
import { BillingHistoryCard } from './billing-history/billing-history-card';
import { InvoiceListCard } from './billing-history/invoice-list-card';
import { CancelCompleteCard } from './cancel-refund-flow/cancel-complete';
import { CancelConfirmationCard } from './cancel-refund-flow/cancel-confirmation';
import { CancelOrRefundFailureCard } from './cancel-refund-flow/cancel-refund-failure';
import { CancelOrRefundPendingCard } from './cancel-refund-flow/cancel-refund-pending';
import { RefundCompleteCard } from './cancel-refund-flow/refund-complete';
import { PaymentMethodCard } from './payment-method/payment-method-card';
import { PlanCard } from './plan-card';
import { SubscriptionHeader } from './subscription-header';
export enum CancellationStep {
    SUBSCRIPTION = 'subscription',
    CANCEL_CONFIRM = 'cancelConfirm',
    CANCEL_COMPLETE = 'cancelComplete',
    CANCEL_FAILURE = 'cancelFailure',
    CANCEL_PENDING = 'cancelPending',
    REFUND_COMPLETE = 'refundComplete',
    REFUND_FAILURE = 'refundFailure',
    REFUND_PENDING = 'refundPending',
    INVOICE_LIST = 'invoiceList'
}
export const SubscriptionPage = () => {
    const [step, setStep] = useState<CancellationStep>(CancellationStep.SUBSCRIPTION);
    const [surveyAnswer, setSurveyAnswer] = useState<SurveyAnswer | undefined>(undefined);
    useEffect(() => {
        logPageView(PageView.PlansManagement);
    }, []);
    return (<FlexContainer sx={{
            background: colors.dashGreen06,
            minHeight: '100%',
            overflowX: 'scroll',
        }}>
      <>
        <SubscriptionHeader cancellationStep={step} setCancellationStep={setStep}/>
        <FlexContainer sx={{ margin: '0 32px', width: '800px' }}>
          {step === CancellationStep.SUBSCRIPTION ? (<>
              <PlanCard setCancellationStep={setStep}/>
              <PaymentMethodCard styles={{ marginBottom: '16px', padding: '32px' }}/>
              <BillingHistoryCard setCancellationStep={setStep}/>
            </>) : null}

          {step === CancellationStep.CANCEL_CONFIRM ? (<CancelConfirmationCard setSurveyAnswer={setSurveyAnswer} surveyAnswer={surveyAnswer} setCancellationStep={setStep}/>) : null}

          {[
            CancellationStep.CANCEL_PENDING,
            CancellationStep.REFUND_PENDING,
        ].includes(step) ? (<CancelOrRefundPendingCard />) : null}

          {step === CancellationStep.CANCEL_FAILURE ? (<CancelOrRefundFailureCard isRefund={false}/>) : null}

          {step === CancellationStep.REFUND_FAILURE ? (<CancelOrRefundFailureCard isRefund={true}/>) : null}

          {step === CancellationStep.CANCEL_COMPLETE ? (<CancelCompleteCard surveyAnswer={surveyAnswer} setCancellationStep={setStep}/>) : null}

          {step === CancellationStep.REFUND_COMPLETE ? (<RefundCompleteCard />) : null}
          {step === CancellationStep.INVOICE_LIST ? <InvoiceListCard /> : null}
        </FlexContainer>
      </>
    </FlexContainer>);
};
