import { useCallback, useEffect, useState } from 'react';
import { Card, GridChild, GridContainer, jsx } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { GetDarkWebInsightsSummaryResponse } from '@dashlane/communication';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { DataStatus, useFeatureFlip, useModuleQuery, } from '@dashlane/framework-react';
import { GetReportQueryResult, teamPasswordHealthApi, } from '@dashlane/team-admin-contracts';
import { carbonConnector } from 'libs/carbon/connector';
import { logPageView } from 'libs/logs/logEvent';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { DomainVerificationStatus, useDomainVerification, } from 'team/helpers/use-domain-verification';
import { Loader } from 'team/components/loader';
import { useCheckPasswordHealthNotification } from 'team/get-started/hooks/notifications';
import { UpgradeTile, useShowUpgradeTile, } from 'team/upgrade-tile/upgrade-tile';
import { CardsRow } from './cards-row/CardsRow';
import { PasswordHealthCard } from './password-health-card/PasswordHealthCard';
import { DWIGetStartedTile } from './dwi-discovery-tile/DWIGetStartedTile';
import { DWICard, DWITile } from './dwi-discovery-tile/DWITile';
import { ChoosePaymentMethodDialog } from './choose-payment-method-dialog/choose-payment-method-dialog';
import { PurchaseDialog } from './purchase-dialog/purchase-dialog';
const SX_STYLES = {
    PAGE: {
        minHeight: '100%',
        width: 'min-content',
        padding: '32px 48px',
    },
};
const DEFAULT_REPORT: GetReportQueryResult = {
    seats: {
        pending: 0,
        provisioned: 0,
        used: 0,
    },
    passwordHealthHistory: [],
    passwordHealth: {
        compromised: 0,
        passwords: 0,
        reused: 0,
        safe: 0,
        securityIndex: 0,
        weak: 0,
    },
};
export enum DiscontinuationModalState {
    PURCHASE,
    PAYMENT
}
export const Dashboard = () => {
    const { data, status: queryStatus } = useModuleQuery(teamPasswordHealthApi, 'getReport');
    const hasB2BDiscontinuationFFEnabled = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationPhase1);
    const report = queryStatus === DataStatus.Success ? data : DEFAULT_REPORT;
    const isQueryLoading = queryStatus === DataStatus.Loading;
    const [modalState, setModalState] = useState<DiscontinuationModalState>(DiscontinuationModalState.PURCHASE);
    const { verifiedOrPendingDomain: { domain, status: verificationStatus }, } = useDomainVerification();
    const [dwiSummaryResponse, setDwiSummaryResponse] = useState<GetDarkWebInsightsSummaryResponse | null>(null);
    const passwordHealthHistoryEmpty = queryStatus === DataStatus.Success &&
        report.passwordHealthHistory.length === 0;
    const fetchDWISummary = useCallback(async () => {
        const result = await carbonConnector.getDarkWebInsightsSummary();
        setDwiSummaryResponse(result);
    }, []);
    useEffect(() => {
        logPageView(PageView.TacDashboard);
        fetchDWISummary();
    }, [fetchDWISummary]);
    const showUpgradeTile = useShowUpgradeTile({ dismissible: true });
    const { translate } = useTranslate();
    const [showTrialDiscontinueModal, setShowTrialDiscontinueModal] = useState(false);
    const discontinuedStatus = useDiscontinuedStatus();
    const shouldShowOldTrialDiscontinuedDialog = !discontinuedStatus.isLoading &&
        discontinuedStatus.isTeamSoftDiscontinued &&
        discontinuedStatus.isTrial &&
        hasB2BDiscontinuationFFEnabled === false;
    useEffect(() => {
        if (shouldShowOldTrialDiscontinuedDialog) {
            setShowTrialDiscontinueModal(true);
        }
    }, [shouldShowOldTrialDiscontinuedDialog]);
    useCheckPasswordHealthNotification();
    return (<div sx={SX_STYLES.PAGE}>
      <GridContainer fullWidth alignItems="top" gap="32px" gridTemplateColumns="auto auto auto auto" gridTemplateRows="auto auto" gridTemplateAreas={`'cards cards cards cards' '${showUpgradeTile
            ? 'pwHealth pwHealth pwHealth upgrade'
            : 'pwHealth pwHealth pwHealth dwi'}'`}>
        <GridChild gridArea="cards">
          <CardsRow passwordHealth={report.passwordHealth} seats={report.seats} passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}/>
        </GridChild>
        <GridChild gridArea="pwHealth" sx={{
            height: '418px',
            width: '710px',
        }}>
          <PasswordHealthCard isLoading={isQueryLoading} report={report} passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}/>
        </GridChild>
        {showUpgradeTile ? (<GridChild gridArea="upgrade" sx={{ width: '282px' }}>
            <Card sx={{
                padding: '16px',
                backgroundColor: 'ds.container.agnostic.neutral.supershy',
                borderColor: 'ds.border.neutral.quiet.idle',
            }}>
              <UpgradeTile dismissible/>
            </Card>
          </GridChild>) : (<GridChild gridArea="dwi">
            {verificationStatus === DomainVerificationStatus.Loading ? (<DWICard />) : domain !== null ? (<DWITile verifiedOrPendingDomain={domain} dwiSummaryResponse={dwiSummaryResponse}/>) : (<DWIGetStartedTile dwiSummaryResponse={dwiSummaryResponse}/>)}
          </GridChild>)}
      </GridContainer>
      {isQueryLoading ? <Loader /> : null}
      
      {showTrialDiscontinueModal &&
            !discontinuedStatus.isLoading &&
            discontinuedStatus.planCopy ? (modalState === DiscontinuationModalState.PURCHASE ? (<PurchaseDialog isOpen={true} planCopy={translate(discontinuedStatus.planCopy)} setModalState={setModalState} handleClose={() => {
                setShowTrialDiscontinueModal(false);
            }}/>) : (<ChoosePaymentMethodDialog isOpen={true} plan={discontinuedStatus.planFeature} setModalState={setModalState}/>)) : null}
    </div>);
};
