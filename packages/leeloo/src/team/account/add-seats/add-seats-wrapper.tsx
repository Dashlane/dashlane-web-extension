import { useCallback, useEffect, useRef, useState } from "react";
import { PageView } from "@dashlane/hermes";
import { Button } from "@dashlane/design-system";
import { SpaceTier, teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { NextBillingDetails } from "../../../libs/api/types";
import { SimpleDialog } from "../../../libs/dashlane-style/dialogs/simple/simple-dialog";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import { useNodePremiumStatus } from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { useAlertQueue } from "../../alerts/use-alert-queue";
import { useBillingCountry } from "../../helpers/useBillingCountry";
import AddSeatsDialog, { AdditionalSeatCount } from ".";
import {
  CostDetailsForTier,
  getAdditionalSeatsCostDetails,
} from "./teamPlanCalculator";
import { AddSeatsProcessingModal } from "./add-seats-processing-modal";
import { getLocalizedPlanTier } from "../add-seats/helpers";
import { useAdditionalSeatCountPricing } from "./useAdditionalSeatCountPricing";
const I18N_KEYS = {
  ADD_SEATS_TITLE: "team_account_teamplan_upgrade_add_seats_title",
  BUY_SEAT: "team_account_teamplan_upgrade_buy_seat",
  PREMIUM_CANCEL: "team_account_teamplan_upgrade_premium_cancel",
};
const DEFAULT_SEAT_COUNT = 1;
export interface BillingDetails {
  renewal: {
    seatsCount: number;
    value: number;
    taxes?: number;
  };
  additionalSeats: {
    seatsCount: number;
    value: number;
    taxes?: number;
  };
  currency: "usd" | "eur";
}
interface Props {
  onUpgradeSuccess: (
    additionalSeatsDetails: CostDetailsForTier[],
    billingDetails: BillingDetails
  ) => void;
  nextBillingDetails: NextBillingDetails;
  numberOfCurrentPaidSlots: number;
  numberOfCurrentUsedSlots: number;
  onRequestClose: () => void;
  planTier: SpaceTier;
  prefilledNumberOfSeatsToBuy?: number;
}
export const AddSeatsWrapper = ({
  onUpgradeSuccess,
  nextBillingDetails,
  numberOfCurrentPaidSlots,
  numberOfCurrentUsedSlots,
  onRequestClose,
  planTier,
  prefilledNumberOfSeatsToBuy,
}: Props) => {
  const premiumPlan = useRef<AdditionalSeatCount>(null);
  const [isAddSeatsDialogOpen, setIsAddSeatsDialogOpen] = useState(true);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const { translate } = useTranslate();
  const { reportTACError } = useAlertQueue();
  const teamBillingInformation = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamBillingInformation"
  );
  const { addSeats } = useModuleCommands(teamPlanDetailsApi);
  const premiumStatus = useNodePremiumStatus();
  const { loading: billingCountryLoading, billingCountry } =
    useBillingCountry();
  const currentPlanPriceRange =
    teamBillingInformation.status === DataStatus.Success
      ? teamBillingInformation.data.planDetails.priceRanges
      : undefined;
  const planType =
    premiumStatus.status === DataStatus.Success
      ? premiumStatus.data.b2bStatus?.currentTeam?.teamInfo.planType
      : undefined;
  const initialNumberOfNewSeats =
    prefilledNumberOfSeatsToBuy ?? DEFAULT_SEAT_COUNT;
  const getNumberOfLicences = useCallback(() => {
    return premiumPlan?.current?.additionalSeatCount ?? initialNumberOfNewSeats;
  }, []);
  const dataLoading =
    premiumPlan === null ||
    teamBillingInformation.status === DataStatus.Loading ||
    premiumStatus.status === DataStatus.Loading ||
    billingCountryLoading ||
    billingCountry === undefined;
  const { billingDetails, isComputingBilling, onSeatCountChange } =
    useAdditionalSeatCountPricing(getNumberOfLicences);
  const planName = getLocalizedPlanTier(planTier, translate);
  useEffect(() => {
    logPageView(PageView.TacAccountBuy);
  }, []);
  useEffect(() => {
    if (teamBillingInformation.status === DataStatus.Error) {
      const updatePriceRangesError = new Error(
        "Error retrieving TeamBillingInformation to update price ranges"
      );
      reportTACError(updatePriceRangesError);
    }
  }, [teamBillingInformation]);
  useEffect(() => {
    onSeatCountChange(getNumberOfLicences());
  }, [getNumberOfLicences]);
  const additionalSeatsDetails = getAdditionalSeatsCostDetails(
    numberOfCurrentPaidSlots,
    billingDetails.renewal.seatsCount,
    currentPlanPriceRange
  );
  const handleBuyMoreSeats = async () => {
    setIsAddSeatsDialogOpen(false);
    setIsLoadingOpen(true);
    const response = await addSeats({ seats: getNumberOfLicences() });
    if (response.tag === "success") {
      onUpgradeSuccess(additionalSeatsDetails, billingDetails);
    }
  };
  if (dataLoading) {
    return null;
  }
  const dialogFooter = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        maxWidth: "100%",
      }}
    >
      <Button
        intensity="quiet"
        mood="neutral"
        size="medium"
        onClick={onRequestClose}
        sx={{ marginRight: "8px" }}
      >
        {translate(I18N_KEYS.PREMIUM_CANCEL)}
      </Button>
      <Button size="medium" onClick={handleBuyMoreSeats} id="buy-seats-button">
        {translate(I18N_KEYS.BUY_SEAT, { count: getNumberOfLicences() })}
      </Button>
    </div>
  );
  return (
    <>
      {isLoadingOpen ? <AddSeatsProcessingModal /> : null}
      {isAddSeatsDialogOpen ? (
        <SimpleDialog
          showCloseIcon
          footer={dialogFooter}
          title={translate(I18N_KEYS.ADD_SEATS_TITLE, { plan: planName })}
          isOpen={true}
          onRequestClose={onRequestClose}
        >
          <AddSeatsDialog
            ref={premiumPlan}
            planType={planType}
            nextBillingDetails={nextBillingDetails}
            billingDetails={billingDetails}
            isComputingBilling={isComputingBilling}
            onSeatCountChange={onSeatCountChange}
            numberOfCurrentPaidSlots={numberOfCurrentPaidSlots}
            numberOfCurrentUsedSlots={numberOfCurrentUsedSlots}
            currentPlanPriceRanges={currentPlanPriceRange}
            billingCountry={billingCountry}
            initialNumberOfNewSeats={initialNumberOfNewSeats}
          />
        </SimpleDialog>
      ) : null}
    </>
  );
};
