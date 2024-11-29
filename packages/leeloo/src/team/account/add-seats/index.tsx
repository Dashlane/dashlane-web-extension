import { forwardRef, useImperativeHandle, useState } from "react";
import { fromUnixTime } from "date-fns";
import { Infobox } from "@dashlane/design-system";
import { NextBillingDetails, PriceRange } from "../../../libs/api/types";
import useTranslate from "../../../libs/i18n/useTranslate";
import { BillingDetails } from "./add-seats-wrapper";
import {
  ADDITIONAL_SEAT_CAP,
  MIN_SEAT_PREMIUM,
  SALES_EMAIL,
} from "../add-seats/helpers";
import { AddSeatsDialogBody } from "./add-seats-dialog-body";
import {
  CostDetailsForTier,
  getAdditionalSeatsCostDetails,
} from "./teamPlanCalculator";
import styles from "./styles.css";
const I18N_KEYS = {
  BELOW_USED_SEAT_COUNT:
    "team_account_teamplan_upgrade_premium_below_used_seat_count",
  BUY_MORE_SEATS_THAN_CAP:
    "team_account_teamplan_upgrade_premium_buy_more_seats_than_cap",
  BUY_MORE_SEATS_WHEN_PREMIUM:
    "team_account_teamplan_upgrade_premium_buy_more_seats_when_premium",
  NUMBER_OF_ADDITIONAL_SEATS:
    "team_account_teamplan_upgrade_premium_number_of_additional_seats",
  NUMBER_OF_SEATS: "team_account_teamplan_upgrade_premium_number_of_seats",
  COUPON: "team_account_teamplan_upgrade_premium_coupon",
  REDEEM: "team_account_teamplan_upgrade_premium_redeem",
  PAY_TODAY: "team_account_teamplan_upgrade_premium_pay_today",
};
export type AdditionalSeatCount = {
  additionalSeatCount: number;
};
export interface Props {
  nextBillingDetails: NextBillingDetails;
  billingDetails: BillingDetails;
  isComputingBilling: boolean;
  onSeatCountChange: (seats: number) => void;
  numberOfCurrentPaidSlots: number;
  numberOfCurrentUsedSlots: number;
  currentPlanPriceRanges?: PriceRange[];
  planType?: string;
  billingCountry: string;
  initialNumberOfNewSeats: number;
}
const AddSeatsDialog = forwardRef<AdditionalSeatCount, Props>(
  function AddSeatsDialog(
    {
      nextBillingDetails,
      billingDetails,
      isComputingBilling,
      onSeatCountChange,
      numberOfCurrentPaidSlots,
      numberOfCurrentUsedSlots,
      currentPlanPriceRanges,
      planType,
      billingCountry,
      initialNumberOfNewSeats,
    },
    ref
  ) {
    const [additionalSeatCount, setAdditionalSeatCount] = useState(
      initialNumberOfNewSeats
    );
    const [isSeatCountAboveCap, setIsSeatCountAboveCap] = useState(false);
    const { translate } = useTranslate();
    useImperativeHandle(ref, () => ({
      additionalSeatCount,
    }));
    const onAdditionalSeatCountChange = (seatCount: number) => {
      const newSeatCountBelowMinimum = seatCount < 0;
      const newSeatCountAboveCap = seatCount > ADDITIONAL_SEAT_CAP;
      setIsSeatCountAboveCap(newSeatCountAboveCap);
      setAdditionalSeatCount(seatCount);
      if (newSeatCountAboveCap || newSeatCountBelowMinimum) {
        return;
      }
      onSeatCountChange(seatCount);
    };
    const totalSeatCount = numberOfCurrentPaidSlots + additionalSeatCount;
    const getToasterErrorMessage = () => {
      if (isSeatCountAboveCap) {
        return translate(I18N_KEYS.BUY_MORE_SEATS_THAN_CAP, {
          seatCap: ADDITIONAL_SEAT_CAP,
          salesEmail: SALES_EMAIL,
        });
      }
      if (additionalSeatCount < MIN_SEAT_PREMIUM) {
        return translate(I18N_KEYS.BUY_MORE_SEATS_WHEN_PREMIUM, {
          count: MIN_SEAT_PREMIUM,
        });
      }
      if (numberOfCurrentUsedSlots > totalSeatCount) {
        return translate(I18N_KEYS.BELOW_USED_SEAT_COUNT, {
          usedSeatCount: numberOfCurrentUsedSlots,
        });
      }
      return null;
    };
    const nextBillingDate: Date = fromUnixTime(nextBillingDetails.dateUnix);
    const additionalSeatsCostDetails: CostDetailsForTier[] =
      getAdditionalSeatsCostDetails(
        numberOfCurrentPaidSlots,
        billingDetails.renewal.seatsCount,
        currentPlanPriceRanges
      );
    const additionalSeatsTaxes = billingDetails.additionalSeats.taxes ?? 0;
    const seatsPrice =
      billingDetails.additionalSeats.value + additionalSeatsTaxes;
    const dueNowTranslation = isSeatCountAboveCap
      ? "-"
      : translate.price(billingDetails.currency, seatsPrice / 100);
    const seatCountLabel = translate(I18N_KEYS.NUMBER_OF_ADDITIONAL_SEATS);
    const toasterErrorMessage = getToasterErrorMessage();
    return (
      <>
        {toasterErrorMessage ? (
          <Infobox
            className={styles.errorToaster}
            title={toasterErrorMessage}
            mood="danger"
          />
        ) : null}
        <AddSeatsDialogBody
          nextBillingDate={nextBillingDate}
          billingDetails={billingDetails}
          dueNowTranslation={dueNowTranslation}
          seatCountLabel={seatCountLabel}
          totalSeatCount={totalSeatCount}
          onAdditionalSeatCountChange={onAdditionalSeatCountChange}
          isComputingBilling={isComputingBilling}
          additionalSeatsDetails={additionalSeatsCostDetails}
          planType={planType ?? ""}
          billingCountry={billingCountry}
          initialAdditionalSeatCount={initialNumberOfNewSeats}
        />
      </>
    );
  }
);
export default AddSeatsDialog;
