import { Fragment, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { throttle } from 'lodash';
import { Maybe } from 'tsmonad';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { DataStatus } from '@dashlane/framework-react';
import { Button, ClickOrigin, FlowStep, PageView, PriceCurrencyCode, UserBuySeatEvent, UserClickEvent, } from '@dashlane/hermes';
import { jsx } from '@dashlane/design-system';
import { Lee, LEE_INCORRECT_AUTHENTICATION } from 'lee';
import { transformUnknownErrorToErrorMessage } from 'helpers';
import Premium from 'libs/api/Premium';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { useTeamBillingInformation } from 'libs/hooks/use-team-billing-information';
import { openUrl } from 'libs/external-urls';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { getAuth } from 'user';
import { BUSINESS_BUY } from 'team/urls';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { TeamSetup } from './setup/team-setup';
import { BillingInformation } from './billing/billing-information';
import { PastReceiptsDialog } from './billing/past-receipts-dialog/past-receipts-dialog';
import { PaymentMethodDialog } from './billing/payment-method-dialog/payment-method-dialog';
import { BillingDetails, TeamUpgrade } from './upgrade';
import { CostDetailsForTier } from './upgrade/add-seats/teamPlanCalculator';
import { UpgradeSuccess } from './upgrade-success';
import { SX_ACCOUNT_STYLES } from './account.styles';
const COLLAPSE_THRESHOLD = 1371;
const RESIZE_THROTTLE = 100;
const isUnderCollapseThreshold = () => document.documentElement.clientWidth < COLLAPSE_THRESHOLD;
interface Props {
    lee: Lee;
}
export const TeamAccount = ({ lee }: Props) => {
    const accountInfo = useAccountInfo();
    const premiumStatus = usePremiumStatus();
    const teamTrialStatus = useTeamTrialStatus();
    const { reportTACError } = useAlertQueue();
    const teamBillingInformation = useTeamBillingInformation();
    const { search } = useLocation();
    const [isWindowCollapsed, setIsWindowCollapsed] = useState(isUnderCollapseThreshold());
    const [showPastReceiptsDialog, setShowPastReceiptsDialog] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isTeamUpgradeOpen, setIsTeamUpgradeOpen] = useState(false);
    const [isTeamUpgradeSuccessOpen, setIsTeamUpgradeSuccessOpen] = useState(false);
    const [lastAdditionalSeatsDetails, setLastAdditionalSeatsDetails] = useState<CostDetailsForTier[] | undefined>();
    const [lastBillingDetails, setLastBillingDetails] = useState<BillingDetails | undefined>();
    const [planName, setPlanName] = useState(Maybe.nothing<string>());
    const fetchTeamStatus = useCallback(async () => {
        const auth = getAuth(lee.globalState);
        if (!auth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
            return;
        }
        try {
            const result = await new Premium().status({
                auth,
                teamInformation: true,
                autoRenewal: true,
            });
            setPlanName(Maybe.maybe(result.planName));
        }
        catch (error) {
            const fetchTeamStatusError = new Error(transformUnknownErrorToErrorMessage(error));
            reportTACError(fetchTeamStatusError);
        }
    }, []);
    useEffect(() => {
        fetchTeamStatus();
        logPageView(PageView.TacAccount);
    }, [fetchTeamStatus]);
    const teamUpgradeDialog = (action: 'open' | 'close') => {
        if (action === 'open') {
            setIsTeamUpgradeOpen(true);
            setShowConfirm(false);
            setIsTeamUpgradeSuccessOpen(false);
        }
        if (action === 'close') {
            logPageView(PageView.TacAccount);
            setIsTeamUpgradeOpen(false);
            setIsTeamUpgradeSuccessOpen(false);
        }
    };
    useEffect(() => {
        if (search?.includes('showSeatsDialog')) {
            setTimeout(() => {
                logEvent(new UserBuySeatEvent({
                    flowStep: FlowStep.Start,
                    hasPromo: false,
                    initialSeatCount: teamBillingInformation?.seatsNumber ?? 0,
                    priceAmountCents: teamBillingInformation?.nextBillingDetails.amount ?? 0,
                    priceCurrencyCode: PriceCurrencyCode[teamBillingInformation?.nextBillingDetails.currency ?? ''],
                    purchasedSeatCount: teamBillingInformation?.seatsNumber ?? 0,
                }));
                teamUpgradeDialog('open');
            }, 2000);
        }
    }, []);
    useEffect(() => {
        const windowResizeListener = throttle(() => {
            const shouldBeCollapsed = isUnderCollapseThreshold();
            if (shouldBeCollapsed && !isWindowCollapsed) {
                setIsWindowCollapsed(true);
            }
            else if (!shouldBeCollapsed && isWindowCollapsed) {
                setIsWindowCollapsed(false);
            }
        }, RESIZE_THROTTLE);
        window.addEventListener('resize', windowResizeListener);
        return () => window.removeEventListener('resize', windowResizeListener);
    }, [isWindowCollapsed]);
    if (!teamTrialStatus || !teamBillingInformation) {
        return null;
    }
    const { lastBillingDateUnix, nextBillingDetails, spaceTier, seatsNumber, usersToBeRenewedCount, } = teamBillingInformation;
    const { isFreeTrial } = teamTrialStatus;
    const upgradeTeam = (clickOrigin: ClickOrigin) => {
        const planParam = spaceTier === SpaceTier.Team ? 'team' : 'business';
        const url = `${BUSINESS_BUY}?plan=${planParam}&subCode=${accountInfo?.subscriptionCode}`;
        logEvent(new UserClickEvent({
            button: Button.BuyDashlane,
            clickOrigin,
        }));
        openUrl(url);
    };
    const handleUpgradeSuccess = (additionalSeatsDetails: CostDetailsForTier[], billingDetails: BillingDetails) => {
        setLastAdditionalSeatsDetails(additionalSeatsDetails);
        setLastBillingDetails(billingDetails);
        setIsTeamUpgradeOpen(false);
        setIsTeamUpgradeSuccessOpen(true);
    };
    const handleGetPastReceipts = () => {
        logPageView(PageView.TacAccountCustomizeInvoice);
        setShowPastReceiptsDialog(true);
    };
    const closePastReceiptDialog = () => {
        logPageView(PageView.TacAccount);
        setShowPastReceiptsDialog(false);
    };
    const hasInvoicePlanType = premiumStatus.status === DataStatus.Success && premiumStatus.data
        ? premiumStatus.data.planType === 'invoice'
        : false;
    const showDialog = () => {
        if (hasInvoicePlanType) {
            setShowConfirm(true);
        }
        else {
            teamUpgradeDialog('open');
        }
    };
    const handleRequestBuyMoreSeats = () => {
        logEvent(new UserBuySeatEvent({
            flowStep: FlowStep.Start,
            hasPromo: false,
            initialSeatCount: seatsNumber,
            priceAmountCents: nextBillingDetails.amount,
            priceCurrencyCode: PriceCurrencyCode[nextBillingDetails.currency],
            purchasedSeatCount: seatsNumber,
        }));
        showDialog();
    };
    return (<div sx={SX_ACCOUNT_STYLES.ACCOUNT_PAGE}>
      {!isTeamUpgradeSuccessOpen ? (<>
          <TeamSetup lee={lee} onRequestBuyMoreSeats={handleRequestBuyMoreSeats} onRequestTeamUpgrade={upgradeTeam} seatsNumber={seatsNumber} isWindowCollapsed={isWindowCollapsed}/>
          {showConfirm ? (<PaymentMethodDialog openUpgradeDialog={() => teamUpgradeDialog('open')} handleClose={() => setShowConfirm(false)}/>) : null}
          <BillingInformation lee={lee} handleGetPastReceipts={handleGetPastReceipts} onRequestTeamUpgrade={() => {
                if (isFreeTrial) {
                    upgradeTeam(ClickOrigin.BillingInformation);
                }
                else {
                    showDialog();
                }
            }} planName={planName} usersToBeRenewedCount={usersToBeRenewedCount} isWindowCollapsed={isWindowCollapsed}/>
        </>) : null}
      {isTeamUpgradeOpen ? (<TeamUpgrade key={lastBillingDateUnix} lee={lee} nextBillingDetails={nextBillingDetails} numberOfCurrentPaidSlots={seatsNumber} numberOfCurrentUsedSlots={usersToBeRenewedCount} onUpgradeSuccess={handleUpgradeSuccess} onRequestClose={() => teamUpgradeDialog('close')} planTier={spaceTier}/>) : null}
      <PastReceiptsDialog lee={lee} onClose={closePastReceiptDialog} isOpen={showPastReceiptsDialog}/>
      {isTeamUpgradeSuccessOpen &&
            lastAdditionalSeatsDetails &&
            lastBillingDetails ? (<UpgradeSuccess planTier={spaceTier} lastAdditionalSeatsDetails={lastAdditionalSeatsDetails} lastBillingDetails={lastBillingDetails} onGetPastReceipts={handleGetPastReceipts} onNavigateBack={() => {
                setIsTeamUpgradeSuccessOpen(false);
                setLastAdditionalSeatsDetails(undefined);
                setLastBillingDetails(undefined);
                fetchTeamStatus();
            }}/>) : null}
    </div>);
};
