import { Fragment, useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { CallToAction, UserCallToActionEvent } from '@dashlane/hermes';
import { DataStatus, useFeatureFlip, useModuleCommands, useModuleQueries, } from '@dashlane/framework-react';
import { isSuccess } from '@dashlane/framework-types';
import { SpaceTier, teamAdminNotificationsApi, teamPlanDetailsApi, } from '@dashlane/team-admin-contracts';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { logEvent } from 'libs/logs/logEvent';
import { getUrlSearchParams } from 'libs/router';
import { ExtendTrialDialog } from './extend-trial-dialog';
import { ExtendTrialSurvey } from './extend-trial-survey';
import { TrialExtendedConfirmationDialog } from './trial-extended-confirmation-dialog';
import { TrialExtendedNotificationDialog } from './trial-extended-notification-dialog';
const OFFER_TO_EXTEND_TRIAL_FF = FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebOfferToExtendPhase1;
export const SEARCH_PARAM = 'extendTrialStep';
export enum TrialDialog {
    NONE = 'none',
    EXTEND_TRIAL = 'extendTrial',
    SURVEY = 'survey',
    TRIAL_EXTENDED_CONFIRMATION = 'trialExtendedConfirmation',
    TRIAL_EXTENDED_NOTIFICATION = 'trialExtendedNotification'
}
interface Props {
    initialDialog?: TrialDialog;
}
export const ExtendTrialDialogFlow = ({ initialDialog }: Props) => {
    const [currentDialog, setCurrentDialog] = useState<TrialDialog>(initialDialog ?? TrialDialog.NONE);
    const isOfferToExtendTrialFeatureFlipEnabled = !!useFeatureFlip(OFFER_TO_EXTEND_TRIAL_FF);
    const adminNotificationCommands = useModuleCommands(teamAdminNotificationsApi);
    const teamPlanDetailsCommands = useModuleCommands(teamPlanDetailsApi);
    const teamTrialStatus = useTeamTrialStatus();
    const notificationsQueries = useModuleQueries(teamAdminNotificationsApi, {
        hasSeenOfferToExtendFreeTrial: {},
        hasSeenNotificationTrialExtended: {},
    }, []);
    const discontinuedStatus = useDiscontinuedStatus();
    const searchParams = getUrlSearchParams();
    const searchParamValue = searchParams.get(SEARCH_PARAM);
    const hasStartedExtendTrialFlowFromLink = !!searchParamValue && searchParamValue === 'true';
    const hasSeenOfferToExtendFreeTrial = notificationsQueries.hasSeenOfferToExtendFreeTrial.status ===
        DataStatus.Success
        ? notificationsQueries.hasSeenOfferToExtendFreeTrial.data
        : null;
    const hasSeenNotificationTrialExtended = notificationsQueries.hasSeenNotificationTrialExtended.status ===
        DataStatus.Success
        ? notificationsQueries.hasSeenNotificationTrialExtended.data
        : null;
    const dataHasLoaded = teamTrialStatus &&
        !discontinuedStatus.isLoading &&
        hasSeenOfferToExtendFreeTrial !== null &&
        hasSeenNotificationTrialExtended !== null;
    useEffect(() => {
        if (dataHasLoaded &&
            teamTrialStatus.isFreeTrial &&
            discontinuedStatus.isTeamSoftDiscontinued === false) {
            if (!teamTrialStatus.isGracePeriod &&
                teamTrialStatus.daysLeftInTrial === 0) {
                if (hasStartedExtendTrialFlowFromLink) {
                    setCurrentDialog(TrialDialog.SURVEY);
                }
                else if (!hasSeenOfferToExtendFreeTrial) {
                    setCurrentDialog(TrialDialog.EXTEND_TRIAL);
                }
            }
            if (teamTrialStatus.isGracePeriod && !hasSeenNotificationTrialExtended) {
                setCurrentDialog(TrialDialog.TRIAL_EXTENDED_NOTIFICATION);
            }
        }
    }, [
        dataHasLoaded,
        hasSeenNotificationTrialExtended,
        hasSeenOfferToExtendFreeTrial,
        hasStartedExtendTrialFlowFromLink,
        discontinuedStatus,
        teamTrialStatus,
    ]);
    const handleCloseExtendTrialDialog = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [
                CallToAction.ExtendTrial,
                CallToAction.BuyDashlane,
                CallToAction.Dismiss,
            ],
            chosenAction: CallToAction.Dismiss,
            hasChosenNoAction: false,
        }));
        adminNotificationCommands.markOfferToExtendFreeTrialSeen();
        setCurrentDialog(TrialDialog.NONE);
    };
    const handleCloseExtendSurvey = () => {
        teamPlanDetailsCommands.extendFreeTrial().then((result) => {
            if (isSuccess(result)) {
                setCurrentDialog(TrialDialog.TRIAL_EXTENDED_CONFIRMATION);
                adminNotificationCommands.markOfferToExtendFreeTrialSeen();
                adminNotificationCommands.markNotificationTrialExtendedSeen();
            }
            else {
                setCurrentDialog(TrialDialog.NONE);
            }
        });
    };
    const handleCloseExtendedTrialConfirmationDialog = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [CallToAction.SeeAllPlans, CallToAction.Close],
            chosenAction: CallToAction.Close,
            hasChosenNoAction: false,
        }));
        adminNotificationCommands.markNotificationTrialExtendedSeen();
        setCurrentDialog(TrialDialog.NONE);
    };
    const handleExtendTrial = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [
                CallToAction.ExtendTrial,
                CallToAction.BuyDashlane,
                CallToAction.Dismiss,
            ],
            chosenAction: CallToAction.ExtendTrial,
            hasChosenNoAction: false,
        }));
        adminNotificationCommands.markOfferToExtendFreeTrialSeen();
        adminNotificationCommands.markNotificationTrialExtendedSeen();
        setCurrentDialog(TrialDialog.SURVEY);
    };
    const handleCloseExtendedTrialNotificationDialog = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [CallToAction.BuyDashlane, CallToAction.Dismiss],
            chosenAction: CallToAction.Dismiss,
            hasChosenNoAction: false,
        }));
        adminNotificationCommands.markNotificationTrialExtendedSeen();
        setCurrentDialog(TrialDialog.NONE);
    };
    if (!dataHasLoaded) {
        return null;
    }
    if (!isOfferToExtendTrialFeatureFlipEnabled ||
        discontinuedStatus.isTeamSoftDiscontinued) {
        return null;
    }
    const isTeamPlan = teamTrialStatus.spaceTier === SpaceTier.Team;
    return (<>
      <ExtendTrialDialog isOpen={currentDialog === TrialDialog.EXTEND_TRIAL} handleClose={handleCloseExtendTrialDialog} isTeamPlan={isTeamPlan} handleExtendTrial={handleExtendTrial}/>

      <ExtendTrialSurvey isOpen={currentDialog === TrialDialog.SURVEY} handleClose={handleCloseExtendSurvey}/>

      <TrialExtendedConfirmationDialog isOpen={currentDialog === TrialDialog.TRIAL_EXTENDED_CONFIRMATION} onClose={handleCloseExtendedTrialConfirmationDialog}/>

      <TrialExtendedNotificationDialog isOpen={currentDialog === TrialDialog.TRIAL_EXTENDED_NOTIFICATION} isTeamPlan={isTeamPlan} onClose={handleCloseExtendedTrialNotificationDialog}/>
    </>);
};
