import { Dispatch, SetStateAction } from "react";
import { useFeatureFlip } from "@dashlane/framework-react";
import { PLANS_FF } from "@dashlane/plans-contracts";
import { BillingHistoryCard } from "../billing-history/billing-history-card";
import { PaymentMethodCard } from "../payment-method/payment-method-card";
import { PlanCard } from "../plan-information/plan-card";
import { CancellationStep } from "../types";
import { CancelLossAversionDialog } from "../cancel-refund-flow/cancel-loss-aversion-dialog";
interface Props {
  setStep: Dispatch<SetStateAction<CancellationStep>>;
  step: CancellationStep;
}
export const SubscriptionPage = ({ setStep, step }: Props) => {
  const hasLossAversionFF = !!useFeatureFlip(
    PLANS_FF.CANCEL_DISCOUNT_PHASE2_FF
  );
  return (
    <div sx={{ maxWidth: "70vw" }}>
      <PlanCard />
      <PaymentMethodCard
        styles={{
          marginBottom: "16px",
          padding: "32px",
          maxWidth: "70vw",
          gap: "8px",
        }}
      />
      <BillingHistoryCard setCancellationStep={setStep} />
      {hasLossAversionFF ? (
        <CancelLossAversionDialog
          isOpen={step === CancellationStep.LOSS_AVERSION}
          setStep={setStep}
        />
      ) : null}
    </div>
  );
};
