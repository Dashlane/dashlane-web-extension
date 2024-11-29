import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { Button, Card, Infobox } from "@dashlane/design-system";
import { BillingMethod, SpaceTier } from "@dashlane/team-admin-contracts";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { PaymentLoading } from "../../../libs/billing/PaymentLoading";
import {
  useDiscontinuedStatus,
  useNodePremiumStatus,
} from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { useTeamBillingInformation } from "../../../libs/hooks/use-team-billing-information";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import { openUrl } from "../../../libs/external-urls";
import { logEvent } from "../../../libs/logs/logEvent";
import { BUSINESS_BUY } from "../../urls";
import {
  getNumberOfPreFilledSeatsToBuy,
  getSubscriptionPhase,
  getTranslatedB2BPlanName,
  OPEN_ADD_SEATS_DIALOG_QUERY,
} from "./helpers";
import { useCreditCardPaymentMethodDisplay } from "../upgrade-success/useCreditCardPaymentDisplay";
import { getHeaderElements } from "./plan-information-header/plan-information-header-elements";
import { PlanInformationHeader } from "./plan-information-header/plan-information-header";
import { BillingInformationFields } from "./billing-information-fields";
import { AddAdditionalSeatsFlow } from "../add-seats/add-additional-seats-flow";
import { Divider } from "../components/divider";
const I18N_KEYS = {
  UPDATE_PAYMENT_METHOD_CTA: "account_summary_update_payment_method",
};
export const PlanInformation = () => {
  const { translate } = useTranslate();
  const { search } = useLocation();
  const teamBillingInformation = useTeamBillingInformation();
  const discontinuedStatus = useDiscontinuedStatus();
  const premiumStatus = useNodePremiumStatus();
  const teamTrialStatus = useTeamTrialStatus();
  const subscriptionCode = useSubscriptionCode();
  const { isExpired: isPaymentCardExpired, pollUntilCardUpdate } =
    useCreditCardPaymentMethodDisplay({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isAddSeatsDialogOpen, setIsAddSeatsDialogOpen] = useState(false);
  const [isChoosePaymentMethodDialogOpen, setIsChoosePaymentMethodDialogOpen] =
    useState(false);
  const openAddSeatsDialogs = () => {
    if (teamBillingInformation?.billingType === BillingMethod.Invoice) {
      setIsChoosePaymentMethodDialogOpen(true);
    } else {
      setIsAddSeatsDialogOpen(true);
    }
  };
  useEffect(() => {
    if (search?.includes(OPEN_ADD_SEATS_DIALOG_QUERY)) {
      const timer = setTimeout(() => {
        openAddSeatsDialogs();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);
  if (
    !teamBillingInformation ||
    discontinuedStatus.isLoading ||
    premiumStatus.status !== DataStatus.Success ||
    !premiumStatus.data.b2bStatus ||
    !teamTrialStatus
  ) {
    return null;
  }
  const subscriptionPhase = getSubscriptionPhase(
    discontinuedStatus,
    premiumStatus.data.b2bStatus,
    teamTrialStatus,
    isPaymentCardExpired
  );
  const {
    badgeLabel,
    badgeMood,
    supportingDescription,
    dateHeader,
    alertInfobox,
    withCtaButton,
  } = getHeaderElements(
    translate,
    subscriptionPhase,
    teamBillingInformation.nextBillingDetails,
    teamTrialStatus
  );
  const buyDashlaneLink = `${BUSINESS_BUY}?plan=business&subCode=${
    subscriptionCode ?? ""
  }`;
  const isRenewalStopped =
    premiumStatus.data.b2bStatus.currentTeam?.isRenewalStopped ?? false;
  const { currency, amountFormatted, pricePerSeat } =
    teamBillingInformation.nextBillingDetails;
  const hideTotalPrice =
    subscriptionPhase === "TRIAL" ||
    subscriptionPhase === "GRACE PERIOD" ||
    subscriptionPhase === "DISCONTINUED TRIAL";
  const subscriptionPhaseIsActive = [
    "ACTIVE",
    "ACTIVE CANCELED",
    "ACTIVE CARD EXPIRED",
  ].includes(subscriptionPhase);
  const withAddSeatsButton =
    teamBillingInformation.spaceTier !== SpaceTier.Starter &&
    teamBillingInformation.spaceTier !== SpaceTier.Standard &&
    subscriptionPhaseIsActive;
  const withUpgradeButton =
    [SpaceTier.Starter, SpaceTier.Team, SpaceTier.Standard].includes(
      teamBillingInformation.spaceTier
    ) && subscriptionPhaseIsActive;
  const prefilledNumberOfSeatsToBuy = getNumberOfPreFilledSeatsToBuy(search);
  const handleClickOnCardUpdate = () => {
    logEvent(
      new UserClickEvent({
        clickOrigin:
          alertInfobox?.mood === "danger"
            ? ClickOrigin.SubscriptionExpiredBanner
            : ClickOrigin.UpdateCreditCardReminder,
        button: HermesButton.UpdatePaymentMethod,
      })
    );
    pollUntilCardUpdate();
    setPaymentLoading(true);
  };
  const handleBuyDashlane = () => {
    openUrl(buyDashlaneLink);
  };
  const handleClickOnAddSeats = () => {
    logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.AccountStatus,
        button: HermesButton.BuySeats,
      })
    );
    openAddSeatsDialogs();
  };
  const planName = getTranslatedB2BPlanName(
    teamBillingInformation.spaceTier,
    translate
  );
  const isMonthlyPlanUI =
    teamBillingInformation.planDetails.duration === "monthly";
  return (
    <>
      {alertInfobox ? (
        <Infobox
          sx={{ marginBottom: "16px" }}
          title={alertInfobox.title}
          size="large"
          description={alertInfobox.description}
          mood={alertInfobox.mood}
          icon={alertInfobox.icon}
          actions={[
            <Button
              key={translate(I18N_KEYS.UPDATE_PAYMENT_METHOD_CTA)}
              onClick={handleClickOnCardUpdate}
            >
              {paymentLoading ? (
                <PaymentLoading
                  b2c={false}
                  setPaymentLoading={setPaymentLoading}
                />
              ) : (
                translate(I18N_KEYS.UPDATE_PAYMENT_METHOD_CTA)
              )}
            </Button>,
          ]}
        />
      ) : null}
      <Card sx={{ maxWidth: "752px", gap: "24px" }}>
        <PlanInformationHeader
          translate={translate}
          badgeLabel={badgeLabel}
          badgeMood={badgeMood}
          supportingDescription={supportingDescription}
          dateHeader={dateHeader}
          withCtaButton={withCtaButton}
          handleCta={handleBuyDashlane}
        />

        <Divider />

        <BillingInformationFields
          planName={planName}
          isMonthlyPlan={isMonthlyPlanUI}
          hideTotalPrice={hideTotalPrice}
          buyDashlaneLink={buyDashlaneLink}
          seatsNumber={teamBillingInformation.seatsNumber}
          isRenewalStopped={isRenewalStopped}
          currency={currency}
          pricePerSeat={pricePerSeat}
          amountFormatted={amountFormatted}
          addSeatsButton={{
            withAddSeatsButton,
            openAddSeatsDialog: handleClickOnAddSeats,
          }}
          upgradeButton={withUpgradeButton}
        />
      </Card>
      <AddAdditionalSeatsFlow
        planTier={teamBillingInformation.spaceTier}
        prefilledNumberOfSeatsToBuy={prefilledNumberOfSeatsToBuy}
        nextBillingDetails={teamBillingInformation.nextBillingDetails}
        numberOfCurrentPaidSlots={teamBillingInformation.seatsNumber}
        numberOfCurrentUsedSlots={teamBillingInformation.usersToBeRenewedCount}
        isAddSeatsDialogOpen={isAddSeatsDialogOpen}
        isChoosePaymentMethodDialogOpen={isChoosePaymentMethodDialogOpen}
        setIsAddSeatsDialogOpen={setIsAddSeatsDialogOpen}
        setIsChoosePaymentMethodDialogOpen={setIsChoosePaymentMethodDialogOpen}
      />
    </>
  );
};
