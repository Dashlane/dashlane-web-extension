import { Dispatch, SetStateAction } from "react";
import { useFeatureFlip } from "@dashlane/framework-react";
import {
  GetPlanPricingDetailsResult,
  SpaceTier,
  TEAM_PLAN_DETAILS_FEATURE_FLIPS,
} from "@dashlane/team-admin-contracts";
import { NextBillingDetails } from "../../../libs/api/types";
import { AddSeatsWrapper, BillingDetails } from "./add-seats-wrapper";
import { CostDetailsForTier } from "./teamPlanCalculator";
import { ChoosePaymentMethodDialog } from "../billing/choose-payment-method-dialog/choose-payment-method-dialog";
import { useAddSeatsSuccessContext } from "../upgrade-success/upsell-success-context";
import { AddSeatsNG } from "./add-seats-ds";
interface Props {
  nextBillingDetails: NextBillingDetails;
  numberOfCurrentPaidSlots: number;
  numberOfCurrentUsedSlots: number;
  planTier: SpaceTier;
  prefilledNumberOfSeatsToBuy?: number;
  isAddSeatsDialogOpen: boolean;
  isChoosePaymentMethodDialogOpen: boolean;
  setIsAddSeatsDialogOpen: Dispatch<SetStateAction<boolean>>;
  setIsChoosePaymentMethodDialogOpen: Dispatch<SetStateAction<boolean>>;
}
export const AddAdditionalSeatsFlow = ({
  nextBillingDetails,
  numberOfCurrentPaidSlots,
  numberOfCurrentUsedSlots,
  planTier,
  prefilledNumberOfSeatsToBuy,
  isAddSeatsDialogOpen,
  isChoosePaymentMethodDialogOpen,
  setIsAddSeatsDialogOpen,
  setIsChoosePaymentMethodDialogOpen,
}: Props) => {
  const isMigrationFFOn = useFeatureFlip(
    TEAM_PLAN_DETAILS_FEATURE_FLIPS.ComputePlanPricingMigration
  );
  const { setSeatDetails, setIsAddSeatsSuccessPageOpen } =
    useAddSeatsSuccessContext();
  const onCloseAddSeatsDialog = () => {
    setIsAddSeatsDialogOpen(false);
  };
  const openAddSeatsDialog = () => {
    setIsAddSeatsDialogOpen(true);
    setIsChoosePaymentMethodDialogOpen(false);
  };
  const onCloseChoosePaymentMethod = () => {
    setIsChoosePaymentMethodDialogOpen(false);
  };
  const onUpgradeSuccess = (
    additionalSeatsDetails: CostDetailsForTier[],
    additionalBillingDetails: BillingDetails | GetPlanPricingDetailsResult
  ) => {
    setSeatDetails({
      lastAdditionalSeatsDetails: additionalSeatsDetails,
      lastBillingDetails: additionalBillingDetails,
    });
    setIsAddSeatsDialogOpen(false);
    setIsAddSeatsSuccessPageOpen(true);
  };
  return isAddSeatsDialogOpen ? (
    isMigrationFFOn ? (
      <AddSeatsNG
        numberOfCurrentPaidSlots={numberOfCurrentPaidSlots}
        onUpgradeSuccess={onUpgradeSuccess}
        onClose={onCloseAddSeatsDialog}
        prefilledNumberOfSeatsToBuy={prefilledNumberOfSeatsToBuy}
      />
    ) : (
      <AddSeatsWrapper
        nextBillingDetails={nextBillingDetails}
        numberOfCurrentPaidSlots={numberOfCurrentPaidSlots}
        numberOfCurrentUsedSlots={numberOfCurrentUsedSlots}
        onUpgradeSuccess={onUpgradeSuccess}
        onRequestClose={onCloseAddSeatsDialog}
        planTier={planTier}
        prefilledNumberOfSeatsToBuy={prefilledNumberOfSeatsToBuy}
      />
    )
  ) : isChoosePaymentMethodDialogOpen ? (
    <ChoosePaymentMethodDialog
      openUpgradeDialog={openAddSeatsDialog}
      handleClose={onCloseChoosePaymentMethod}
    />
  ) : null;
};
