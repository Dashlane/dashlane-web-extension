import { Dispatch, SetStateAction } from "react";
import { CancellationStep } from "../types";
import { AccountReferralCard } from "./account-referral-card";
import { SubscriptionSideContent } from "./subscription-side-content";
interface Props {
  setStep: Dispatch<SetStateAction<CancellationStep>>;
}
export const SubscriptionSideContentWrapper = ({ setStep }: Props) => {
  return (
    <div
      sx={{
        maxWidth: "20vw",
        gap: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AccountReferralCard />
      <SubscriptionSideContent setCancellationStep={setStep} />
    </div>
  );
};
