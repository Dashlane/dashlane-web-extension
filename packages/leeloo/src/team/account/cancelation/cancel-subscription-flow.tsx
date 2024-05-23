import { Fragment, useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { Button, ClickOrigin, UserClickEvent } from '@dashlane/hermes';
import { AlertSeverity } from '@dashlane/ui-components';
import { useModuleCommands } from '@dashlane/framework-react';
import { CancellationStatus, ReasonsForCancelling, teamPlanDetailsApi, } from '@dashlane/team-admin-contracts';
import { DASHLANE_CONTACT_FORM_DASHLANE_FOR_BUSINESS } from 'team/urls';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { openUrl } from 'libs/external-urls';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { logEvent } from 'libs/logs/logEvent';
import { useAlert } from 'libs/alert-notifications/use-alert';
import useTranslate from 'libs/i18n/useTranslate';
import { CancelSubscription } from './cancel-subscription';
import { CancelSubscriptionSurvey } from './cancel-subscription-survey';
import { CancelSubscriptionConfirmationDialog } from './cancel-subscription-success-dialog';
export enum CancelSubscriptionDialog {
    NONE = 'none',
    SURVEY = 'survey',
    REQUEST_SUCCESS = 'requestSentConfirmation',
    REQUEST_ERROR = 'requestError'
}
export type ZenDeskRequestStatus = 'idle' | 'pending' | 'finished';
interface CancelSubscriptionFlowProps {
    status: CancellationStatus;
}
const I18N_KEYS = {
    ERROR_MESSAGE: 'team_account_cancel_request_error',
};
export const CancelSubscriptionFlow = ({ status, }: CancelSubscriptionFlowProps) => {
    const [currentDialog, setCurrentDialog] = useState<CancelSubscriptionDialog>(CancelSubscriptionDialog.NONE);
    const [requestStatus, setRequestStatus] = useState<ZenDeskRequestStatus>('idle');
    const discontinuedStatus = useDiscontinuedStatus();
    const teamTrialStatus = useTeamTrialStatus();
    const { translate } = useTranslate();
    const errorAlert = useAlert();
    useEffect(() => {
        if (currentDialog === CancelSubscriptionDialog.REQUEST_ERROR) {
            errorAlert.showAlert(translate(I18N_KEYS.ERROR_MESSAGE), AlertSeverity.ERROR, false, undefined, undefined, 10000);
        }
    }, [currentDialog]);
    const { requestTeamPlanCancellation } = useModuleCommands(teamPlanDetailsApi);
    const dataHasLoaded = !discontinuedStatus.isLoading && teamTrialStatus;
    if (!dataHasLoaded) {
        return null;
    }
    if (discontinuedStatus.isTeamSoftDiscontinued) {
        return null;
    }
    const handleCloseCancelSurvey = () => {
        setCurrentDialog(CancelSubscriptionDialog.NONE);
    };
    const handleCloseCancelConfirmation = () => {
        setCurrentDialog(CancelSubscriptionDialog.NONE);
    };
    const handleStartCancelRequest = () => {
        logEvent(new UserClickEvent({
            clickOrigin: ClickOrigin.BillingInformation,
            button: Button.CancelSubscription,
        }));
        setCurrentDialog(CancelSubscriptionDialog.SURVEY);
    };
    const handleReactivateSubscriptionRequest = () => {
        logEvent(new UserClickEvent({
            clickOrigin: ClickOrigin.BillingInformation,
            button: Button.ReactivateSubscription,
        }));
        openUrl(DASHLANE_CONTACT_FORM_DASHLANE_FOR_BUSINESS);
    };
    const sendCancelRequest = async (reasonsToCancel: ReasonsForCancelling[]) => {
        setRequestStatus('pending');
        try {
            const response = await requestTeamPlanCancellation({
                reasons: reasonsToCancel,
            });
            setRequestStatus('finished');
            if (response.tag === 'failure') {
                throw new Error('Failed to request team plan cancellation.');
            }
            else {
                setCurrentDialog(CancelSubscriptionDialog.REQUEST_SUCCESS);
            }
        }
        catch (error) {
            setCurrentDialog(CancelSubscriptionDialog.REQUEST_ERROR);
        }
    };
    return (<>
      
      <CancelSubscription status={status} handleClickButton={status === CancellationStatus.None
            ? handleStartCancelRequest
            : handleReactivateSubscriptionRequest}/>

      
      {currentDialog === CancelSubscriptionDialog.SURVEY ? (<CancelSubscriptionSurvey spaceTier={teamTrialStatus.spaceTier} handleClose={handleCloseCancelSurvey} sendCancelRequest={sendCancelRequest} requestStatus={requestStatus}/>) : null}

      
      {currentDialog === CancelSubscriptionDialog.REQUEST_SUCCESS ? (<CancelSubscriptionConfirmationDialog handleClose={handleCloseCancelConfirmation}/>) : null}
    </>);
};
