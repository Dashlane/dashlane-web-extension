import { useEffect, useState } from "react";
import { PageView } from "@dashlane/hermes";
import { logPageView } from "../../../libs/logs/logEvent";
import { InvoiceListCard } from "../billing-history/invoice-list-card";
import { CancelCompleteCard } from "../cancel-refund-flow/cancel-complete";
import { CancelOrRefundFailureCard } from "../cancel-refund-flow/cancel-refund-failure";
import { CancelOrRefundPendingCard } from "../cancel-refund-flow/cancel-refund-pending";
import { RefundCompleteCard } from "../cancel-refund-flow/refund-complete";
import { SubscriptionSideContentWrapper } from "../subscription-side-content/subscription-side-content-wrapper";
import { CancellationStep, SurveyAnswer } from "../types";
import { SubscriptionHeader } from "./subscription-header";
import { SubscriptionPage } from "./subscription-page";
import { CancelSubscriptionSurvey } from "../cancel-refund-flow/cancel-survey";
export const SubscriptionPageWrapper = () => {
  const [step, setStep] = useState<CancellationStep>(
    CancellationStep.SUBSCRIPTION
  );
  const [surveyAnswer, setSurveyAnswer] = useState<SurveyAnswer | undefined>(
    undefined
  );
  useEffect(() => {
    logPageView(PageView.PlansManagement);
  }, []);
  return (
    <div
      sx={{
        background: "ds.background.alternate",
        width: "100%",
        height: "100%",
        overflowX: "scroll",
      }}
    >
      <SubscriptionHeader
        cancellationStep={step}
        setCancellationStep={setStep}
      />
      {step === CancellationStep.SUBSCRIPTION ||
      step === CancellationStep.LOSS_AVERSION ? (
        <div sx={{ display: "flex", padding: "32px", gap: "16px" }}>
          <SubscriptionPage setStep={setStep} step={step} />
          <SubscriptionSideContentWrapper setStep={setStep} />
        </div>
      ) : null}

      <div sx={{ padding: "32px" }}>
        {step === CancellationStep.CANCEL_CONFIRM ? (
          <CancelSubscriptionSurvey
            setCancellationStep={setStep}
            setSurveyAnswer={setSurveyAnswer}
            surveyAnswer={surveyAnswer}
          />
        ) : null}

        {[
          CancellationStep.CANCEL_PENDING,
          CancellationStep.REFUND_PENDING,
        ].includes(step) ? (
          <CancelOrRefundPendingCard />
        ) : null}

        {step === CancellationStep.CANCEL_FAILURE ? (
          <CancelOrRefundFailureCard isRefund={false} />
        ) : null}

        {step === CancellationStep.REFUND_FAILURE ? (
          <CancelOrRefundFailureCard isRefund={true} />
        ) : null}

        {step === CancellationStep.CANCEL_COMPLETE ? (
          <CancelCompleteCard
            surveyAnswer={surveyAnswer}
            setCancellationStep={setStep}
          />
        ) : null}

        {step === CancellationStep.REFUND_COMPLETE ? (
          <RefundCompleteCard />
        ) : null}
        {step === CancellationStep.INVOICE_LIST ? <InvoiceListCard /> : null}
      </div>
    </div>
  );
};
