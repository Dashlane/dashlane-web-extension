import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Maybe } from 'tsmonad';
import { PageView } from '@dashlane/hermes';
import { Button, jsx } from '@dashlane/design-system';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { transformUnknownErrorToErrorMessage } from 'helpers';
import { Lee, LEE_INCORRECT_AUTHENTICATION } from 'lee';
import { getAuth } from 'user';
import { Auth, NextBillingDetails, PriceRange } from 'libs/api/types';
import TeamPlans from 'libs/api/TeamPlans';
import { carbonConnector } from 'libs/carbon/connector';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import AddSeatsDialog, { AdditionalSeatCount } from './add-seats';
import { CostDetailsForTier, getAdditionalSeatsCostDetails, } from './add-seats/teamPlanCalculator';
import { AddSeatsProcessingModal } from './add-seats/add-seats-processing-modal';
import { getLocalizedPlanTier, userBuySeatFailureEventLog, userBuySeatSuccesfulEventLog, } from './helpers';
import { useAdditionalSeatCountPricing } from './useAdditionalSeatCountPricing';
const I18N_KEYS = {
    ADD_SEATS_TITLE: 'team_account_teamplan_upgrade_add_seats_title',
    BUY_SEAT: 'team_account_teamplan_upgrade_buy_seat',
    PREMIUM_CANCEL: 'team_account_teamplan_upgrade_premium_cancel',
};
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
    currency: 'usd' | 'eur';
}
interface Props {
    lee: Lee;
    onUpgradeSuccess: (additionalSeatsDetails: CostDetailsForTier[], billingDetails: BillingDetails) => void;
    nextBillingDetails: NextBillingDetails;
    numberOfCurrentPaidSlots: number;
    numberOfCurrentUsedSlots: number;
    onRequestClose: () => void;
    planTier: SpaceTier;
}
export const TeamUpgrade = ({ lee, onUpgradeSuccess, nextBillingDetails, numberOfCurrentPaidSlots, numberOfCurrentUsedSlots, onRequestClose, planTier, }: Props) => {
    const premiumPlan = useRef<AdditionalSeatCount>(null);
    const [isAddSeatsDialogOpen, setIsAddSeatsDialogOpen] = useState(true);
    const [isLoadingOpen, setIsLoadingOpen] = useState(false);
    const [currentPlanPriceRange, setCurrentPlanPriceRange] = useState<PriceRange[] | undefined>();
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const getNumberOfLicences = useCallback(() => {
        return Maybe.maybe(premiumPlan.current).caseOf({
            just: (plan) => {
                return plan.additionalSeatCount;
            },
            nothing: () => 1,
        });
    }, []);
    const { billingDetails, isComputingBilling, onSeatCountChange } = useAdditionalSeatCountPricing(getNumberOfLicences);
    const getPlanDetails = async (auth: Auth) => {
        const status = await new TeamPlans().status({ auth });
        const { planDetails } = status.content.team;
        return { planDetails };
    };
    const updatePriceRanges = async () => {
        const auth = getAuth(lee.globalState);
        if (!auth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
            return;
        }
        try {
            const { planDetails: currentPlanDetails } = await getPlanDetails(auth);
            setCurrentPlanPriceRange(currentPlanDetails.priceRanges);
        }
        catch (error) {
            const updatePriceRangesError = new Error(transformUnknownErrorToErrorMessage(error));
            reportTACError(updatePriceRangesError);
        }
    };
    const planName = getLocalizedPlanTier(planTier, translate);
    useEffect(() => {
        logPageView(PageView.TacAccountBuy);
        updatePriceRanges();
    }, []);
    useEffect(() => {
        onSeatCountChange(getNumberOfLicences());
    }, [getNumberOfLicences]);
    const additionalSeatsDetails = getAdditionalSeatsCostDetails(numberOfCurrentPaidSlots, billingDetails.renewal.seatsCount, currentPlanPriceRange);
    const handleBuyMoreSeats = async () => {
        setIsAddSeatsDialogOpen(false);
        setIsLoadingOpen(true);
        try {
            const response = await carbonConnector.addSeats({
                seats: getNumberOfLicences(),
            });
            if (!response.success) {
                userBuySeatFailureEventLog(billingDetails);
            }
            else {
                userBuySeatSuccesfulEventLog(billingDetails);
                onUpgradeSuccess(additionalSeatsDetails, billingDetails);
            }
        }
        catch {
            userBuySeatFailureEventLog(billingDetails);
        }
    };
    const dialogFooter = (<div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            maxWidth: '100%',
        }}>
      <Button intensity="quiet" mood="neutral" size="medium" onClick={onRequestClose} sx={{ marginRight: '8px' }}>
        {translate(I18N_KEYS.PREMIUM_CANCEL)}
      </Button>
      <Button size="medium" onClick={handleBuyMoreSeats}>
        {translate(I18N_KEYS.BUY_SEAT, { count: getNumberOfLicences() })}
      </Button>
    </div>);
    return (<>
      {isLoadingOpen ? <AddSeatsProcessingModal /> : null}
      {isAddSeatsDialogOpen ? (<SimpleDialog showCloseIcon footer={dialogFooter} title={translate(I18N_KEYS.ADD_SEATS_TITLE, { plan: planName })} isOpen={true} onRequestClose={onRequestClose}>
          <AddSeatsDialog ref={premiumPlan} nextBillingDetails={nextBillingDetails} billingDetails={billingDetails} isComputingBilling={isComputingBilling} onSeatCountChange={onSeatCountChange} numberOfCurrentPaidSlots={numberOfCurrentPaidSlots} numberOfCurrentUsedSlots={numberOfCurrentUsedSlots} currentPlanPriceRanges={currentPlanPriceRange}/>
        </SimpleDialog>) : null}
    </>);
};
