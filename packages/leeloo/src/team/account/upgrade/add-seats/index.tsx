import { forwardRef, Fragment, useImperativeHandle, useState } from 'react';
import { Maybe } from 'tsmonad';
import { fromUnixTime } from 'date-fns';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Infobox, jsx } from '@dashlane/design-system';
import { NextBillingDetails, PriceRange } from 'libs/api/types';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { BillingDetails } from 'team/account/upgrade/';
import { ADDITIONAL_SEAT_CAP, MIN_SEAT_PREMIUM, SALES_EMAIL } from '../helpers';
import { AddSeatsDialogBody } from './add-seats-dialog-body';
import { CostDetailsForTier, getAdditionalSeatsCostDetails, } from './teamPlanCalculator';
import styles from './styles.css';
const I18N_KEYS = {
    BELOW_USED_SEAT_COUNT: 'team_account_teamplan_upgrade_premium_below_used_seat_count',
    BUY_MORE_SEATS_THAN_CAP: 'team_account_teamplan_upgrade_premium_buy_more_seats_than_cap',
    BUY_MORE_SEATS_WHEN_PREMIUM: 'team_account_teamplan_upgrade_premium_buy_more_seats_when_premium',
    NUMBER_OF_ADDITIONAL_SEATS: 'team_account_teamplan_upgrade_premium_number_of_additional_seats',
    NUMBER_OF_SEATS: 'team_account_teamplan_upgrade_premium_number_of_seats',
    COUPON: 'team_account_teamplan_upgrade_premium_coupon',
    REDEEM: 'team_account_teamplan_upgrade_premium_redeem',
    PAY_TODAY: 'team_account_teamplan_upgrade_premium_pay_today',
};
export interface State {
    additionalSeatCount: Maybe<number>;
}
export type AdditionalSeatCount = {
    additionalSeatCount: number;
};
const DEFAULT_SEAT_COUNT = 1;
export interface Props {
    nextBillingDetails: NextBillingDetails;
    billingDetails: BillingDetails;
    isComputingBilling: boolean;
    onSeatCountChange: (seats: number) => void;
    numberOfCurrentPaidSlots: number;
    numberOfCurrentUsedSlots: number;
    currentPlanPriceRanges?: PriceRange[];
}
const AddSeatsDialog = forwardRef<AdditionalSeatCount, Props>(function AddSeatsDialog({ nextBillingDetails, billingDetails, isComputingBilling, onSeatCountChange, numberOfCurrentPaidSlots, numberOfCurrentUsedSlots, currentPlanPriceRanges, }, ref) {
    const [additionalSeatCount, setAdditionalSeatCount] = useState(DEFAULT_SEAT_COUNT);
    const [isSeatCountAboveCap, setIsSeatCountAboveCap] = useState(false);
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatus();
    useImperativeHandle(ref, () => ({
        additionalSeatCount,
    }));
    const onAdditionalSeatCountChange = (seatCount: number) => {
        const newSeatCountBelowMinimum = seatCount < 0;
        const newSseatCountAboveCap = seatCount > ADDITIONAL_SEAT_CAP;
        setIsSeatCountAboveCap(newSseatCountAboveCap);
        setAdditionalSeatCount(seatCount);
        if (newSseatCountAboveCap || newSeatCountBelowMinimum) {
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
    const additionalSeatsCostDetails: CostDetailsForTier[] = getAdditionalSeatsCostDetails(numberOfCurrentPaidSlots, billingDetails.renewal.seatsCount, currentPlanPriceRanges);
    const additionalSeatsTaxes = billingDetails.additionalSeats.taxes ?? 0;
    const seatsPrice = billingDetails.additionalSeats.value + additionalSeatsTaxes;
    const dueNowTranslation = isSeatCountAboveCap
        ? '-'
        : translate.price(billingDetails.currency, seatsPrice / 100);
    const seatCountLabel = translate(I18N_KEYS.NUMBER_OF_ADDITIONAL_SEATS);
    const toasterErrorMessage = getToasterErrorMessage();
    const planType = premiumStatus.status === DataStatus.Success
        ? premiumStatus.data.planType
        : '';
    return (<>
        {toasterErrorMessage ? (<Infobox className={styles.errorToaster} title={toasterErrorMessage} mood="danger"/>) : null}
        <AddSeatsDialogBody nextBillingDate={nextBillingDate} billingDetails={billingDetails} dueNowTranslation={dueNowTranslation} seatCountLabel={seatCountLabel} totalSeatCount={totalSeatCount} onAdditionalSeatCountChange={onAdditionalSeatCountChange} isComputingBilling={isComputingBilling} additionalSeatsDetails={additionalSeatsCostDetails} planType={planType}/>
      </>);
});
export default AddSeatsDialog;
