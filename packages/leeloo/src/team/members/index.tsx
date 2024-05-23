import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Maybe } from 'tsmonad';
import { jsx, useToast } from '@dashlane/design-system';
import { FlowStep, PageView, UserSendManualInviteEvent, } from '@dashlane/hermes';
import { TeamMemberInfo } from '@dashlane/communication';
import { teamMembersApi } from '@dashlane/team-admin-contracts';
import { useFeatureFlip, useModuleCommands } from '@dashlane/framework-react';
import { LEE_INCORRECT_AUTHENTICATION, LeeWithStorage } from 'lee';
import { getAuth as getUserAuth } from 'user';
import TeamPlans from 'libs/api/TeamPlans';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import { TeamPlansProposeMembersResultContent } from 'libs/api/types';
import { getTeamMembers } from 'libs/carbon/triggers';
import { getCurrentTeamId } from 'libs/carbon/spaces';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useConditionsForTrialExtensionDialogs } from 'libs/hooks/use-conditions-for-trial-extension-dialogs';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { InvitePartialSuccessState, useInviteResultPartialSuccess, } from 'team/invite-result-dialog';
import { getSeatsTaken } from 'team/helpers/get-seats-taken';
import { InviteDialogWithResults } from 'team/invite-dialog/invite-dialog-with-results';
import { useAssignAdminNotification, useInviteMembersNotification, } from 'team/get-started/hooks/notifications';
import { BackupCodeGenerationDialogFlowInitiator } from './backup-code-generation/backup-generation-dialog-flow-initiatior';
import * as actions from './member-actions/reducer';
import { ReinviteAllDialog } from './member-actions/reinvite-all-dialog';
import { RevokeDialog } from './member-actions/revoke-dialog';
import { ShareInviteLinkDialog } from './member-actions/share-invite-link-dialog';
import { MembersMissingPublicKeyErrorPopup } from './members-missing-public-key-error/members-missing-public-key-error-popup';
import { EnableInviteLinkDialog } from './member-actions/enable-invite-link-dialog';
import { Role, RoleAssignmentDialog, } from './member-actions/role-assignment/role-assignment-dialog';
import { getPendingUsers } from './get-pending-users';
import Header from './header';
import Summary from './summary';
import { List } from './list';
import { MemberAction } from './types';
const I18N_KEYS = {
    INVITE_SUCCESS_MESSAGE: 'team_members_invite_success_message',
    INVITE_ERROR_MSG_NO_FREE_SLOT: 'team_members_invite_error_message_no_free_slot',
    INVITE_ERROR_MSG: 'team_members_invite_error_message',
};
export interface State {
    members: Maybe<TeamMemberInfo[]>;
    totalSeatCount: Maybe<number>;
    isFreeTrial: Maybe<boolean>;
    teamName: Maybe<string>;
    teamSecurityScore: Maybe<number>;
}
interface Props {
    lee: LeeWithStorage<State>;
    location: {
        pathname: string;
        state: {
            openSendInvitesDialog: boolean;
            openResendPendingInvitationsDialog: boolean;
        };
    };
}
type ErrorsAndSuccesses = {
    errors: Error[];
    successes: string[];
};
export const handleSingleChangeAsBatch = async (members: TeamMemberInfo[], asyncCallback: (member: TeamMemberInfo) => Promise<string>): Promise<ErrorsAndSuccesses> => {
    const errorsAndSuccesses: ErrorsAndSuccesses = {
        errors: [],
        successes: [],
    };
    for await (const member of members) {
        try {
            const login = await asyncCallback(member);
            errorsAndSuccesses.successes.push(login);
        }
        catch (e) {
            errorsAndSuccesses.errors.push(e);
        }
    }
    return errorsAndSuccesses;
};
export const hasRefusedMembers = ({ refusedMembers = {}, }: Partial<TeamPlansProposeMembersResultContent> = {}): boolean => Object.keys(refusedMembers).length > 0;
export const makeErrors = (errors: unknown): Error[] => {
    return (errors instanceof Array ? errors : [errors]).map((error) => {
        if (error instanceof Error) {
            return error;
        }
        if (error instanceof Object) {
            return new Error(JSON.stringify(error));
        }
        return new Error(error);
    });
};
const TeamMembers = ({ lee, location }: Props) => {
    const componentDidMount = useRef<boolean>(false);
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const alert = useAlert();
    const mightShowExtendTrialDialog = useConditionsForTrialExtensionDialogs();
    const { routes } = useRouterGlobalSettingsContext();
    const { proposeMembers } = useModuleCommands(teamMembersApi);
    const isSetupRolloutCtaProdActive = useFeatureFlip('setup_rollout_cta_prod');
    const { showToast } = useToast();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const [isLoading, setIsLoading] = useState(true);
    const { invitePartialSuccessState, setInvitePartialSuccessState, handleInvitationResultClosed, } = useInviteResultPartialSuccess();
    const [memberActionDialog, setMemberActionDialog] = useState<null | ReactNode>(null);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [membersMissingPublicKeyErrorPopupState, setMembersMissingPublicKeyErrorPopupState,] = useState<{
        showError: boolean;
        membersWithoutPublicKey: TeamMemberInfo[];
    }>({ showError: false, membersWithoutPublicKey: [] });
    const getAuth = useCallback(() => {
        const auth = getUserAuth(lee.globalState);
        if (!auth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
        }
        return auth;
    }, [lee.globalState, reportTACError]);
    const startInviteDialogFlow = useCallback(() => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
        else {
            setShowInviteDialog(true);
            logEvent(new UserSendManualInviteEvent({
                flowStep: FlowStep.Start,
                inviteCount: 0,
                inviteFailedCount: 0,
                inviteResentCount: 0,
                inviteSuccessfulCount: 0,
                isImport: false,
                isResend: false,
            }));
        }
    }, [shouldShowTrialDiscontinuedDialog]);
    const handleInviteCompleteSuccess = (successfullyInvitedMemberEmails: string[]) => {
        lee.dispatch(actions.newMembersProposedAction(successfullyInvitedMemberEmails));
    };
    const handleInvitePartialSuccess = (successfullyInvitedMembers: InvitePartialSuccessState['invitedMembers'], refusedMembers: InvitePartialSuccessState['refusedMembers']) => {
        setInvitePartialSuccessState({
            show: true,
            invitedMembers: successfullyInvitedMembers,
            refusedMembers: refusedMembers,
        });
        handleInviteCompleteSuccess(Object.keys(successfullyInvitedMembers));
    };
    const applyActionOnMembers = useCallback((memberAction: MemberAction, selectedMembers: TeamMemberInfo[] = [], newRole?: Role): void => {
        const resendOrReactivate = async () => {
            selectedMembers.forEach((member) => {
                lee.dispatch(actions.userResentInvitation(member));
            });
            const auth = getAuth();
            if (!auth) {
                return;
            }
            const memberLogins = selectedMembers.map((m) => m.login);
            try {
                const response: {
                    [key: string]: any;
                } = await proposeMembers({
                    proposedMemberLogins: memberLogins,
                });
                if (response.tag === 'failure') {
                    throw new Error(response.error);
                }
                if (response.data && hasRefusedMembers(response.data)) {
                    const { refusedMembers } = response.data.content;
                    Object.values(refusedMembers).forEach((login) => {
                        const member = selectedMembers.find((proposedMember) => proposedMember.login === login);
                        handleInvitePartialSuccess(response.data.proposedMembers, response.data.refusedMembers);
                        lee.dispatch(actions.userResentInvitationFailed(member));
                    });
                    logEvent(new UserSendManualInviteEvent({
                        flowStep: FlowStep.Complete,
                        inviteCount: 0,
                        inviteFailedCount: Object.keys(refusedMembers).length,
                        inviteResentCount: memberLogins.length,
                        inviteSuccessfulCount: memberLogins.length - Object.keys(refusedMembers).length,
                        isImport: false,
                        isResend: true,
                    }));
                }
                else {
                    showToast({
                        description: translate(I18N_KEYS.INVITE_SUCCESS_MESSAGE),
                        mood: 'brand',
                    });
                    logEvent(new UserSendManualInviteEvent({
                        flowStep: FlowStep.Complete,
                        inviteCount: 0,
                        inviteFailedCount: 0,
                        inviteResentCount: memberLogins.length,
                        inviteSuccessfulCount: memberLogins.length,
                        isImport: false,
                        isResend: true,
                    }));
                }
            }
            catch (e) {
                const { message = '', data = {} } = e;
                const noFreeSlotsText = translate(I18N_KEYS.INVITE_ERROR_MSG_NO_FREE_SLOT);
                const defaultErrorText = translate(I18N_KEYS.INVITE_ERROR_MSG);
                const { content: { error: errorContent = message } = {} } = data;
                const inviteErrorMessage = [
                    'no_free_slot_free_plan',
                    'no_free_slot',
                ].includes(errorContent)
                    ? noFreeSlotsText
                    : defaultErrorText;
                selectedMembers.forEach((member) => {
                    lee.dispatch(actions.userResentInvitationFailed(member));
                });
                showToast({
                    description: inviteErrorMessage,
                    mood: 'danger',
                });
                logEvent(new UserSendManualInviteEvent({
                    flowStep: FlowStep.Error,
                    inviteCount: 0,
                    inviteFailedCount: memberLogins.length,
                    inviteResentCount: memberLogins.length,
                    inviteSuccessfulCount: 0,
                    isImport: false,
                    isResend: true,
                }));
            }
        };
        const memberLogins = selectedMembers.map((m) => m.login);
        switch (memberAction) {
            case 'reassign':
                return setMemberActionDialog(<RoleAssignmentDialog lee={lee} selectedMembers={selectedMembers} newRole={newRole} closeDialog={() => setMemberActionDialog(null)}/>);
            case 'reactivate':
                if (shouldShowTrialDiscontinuedDialog) {
                    openTrialDiscontinuedDialog();
                    return;
                }
                resendOrReactivate();
                return;
            case 'reinvite':
                if (shouldShowTrialDiscontinuedDialog) {
                    openTrialDiscontinuedDialog();
                    return;
                }
                resendOrReactivate();
                return;
            case 'reinviteAll':
                if (shouldShowTrialDiscontinuedDialog) {
                    openTrialDiscontinuedDialog();
                    return;
                }
                return setMemberActionDialog(<ReinviteAllDialog resendOrReactivate={resendOrReactivate} closeDialog={() => setMemberActionDialog(null)}/>);
            case 'revoke':
                return setMemberActionDialog(<RevokeDialog lee={lee} selectedMembers={selectedMembers} closeDialog={() => setMemberActionDialog(null)}/>);
            case 'generateBackupCode':
                return setMemberActionDialog(<BackupCodeGenerationDialogFlowInitiator memberLogin={memberLogins[0]} isOpen={true} closeBackupCodeDialog={() => setMemberActionDialog(null)}/>);
            case 'enableInviteLink':
                if (shouldShowTrialDiscontinuedDialog) {
                    openTrialDiscontinuedDialog();
                    return;
                }
                return setMemberActionDialog(<EnableInviteLinkDialog closeDialog={() => setMemberActionDialog(null)} applyActionOnMembers={applyActionOnMembers}/>);
            case 'shareInviteLink':
                if (shouldShowTrialDiscontinuedDialog) {
                    openTrialDiscontinuedDialog();
                    return;
                }
                return setMemberActionDialog(<ShareInviteLinkDialog closeDialog={() => setMemberActionDialog(null)}/>);
        }
    }, [
        alert,
        getAuth,
        handleInvitePartialSuccess,
        shouldShowTrialDiscontinuedDialog,
        translate,
    ]);
    useEffect(() => {
        if (componentDidMount.current ||
            mightShowExtendTrialDialog === null ||
            shouldShowTrialDiscontinuedDialog === null) {
            return;
        }
        componentDidMount.current = true;
        const auth = getAuth();
        if (!auth) {
            return;
        }
        const { teamId } = auth;
        if (!teamId) {
            return;
        }
        new TeamPlans()
            .status({ auth })
            .then((status) => {
            lee.dispatch(actions.statusLoaded({
                extraFreeSlots: status.content.team.extraFreeSlots,
                membersNumber: status.content.team.membersNumber,
                isFreeTrial: status.content.team.isFreeTrial,
                teamName: status.content.team.info.name ?? '',
                teamSecurityScore: status.content.team.securityIndex,
            }));
            return getTeamMembers({ teamId });
        })
            .then((members) => {
            lee.dispatch(actions.membersLoaded({ members }));
            setIsLoading(false);
            const isOneMemberTeam = members && members.length === 1;
            const hasOpenDialogURLParam = location.state?.openSendInvitesDialog;
            if (!shouldShowTrialDiscontinuedDialog &&
                ((!mightShowExtendTrialDialog && isOneMemberTeam) ||
                    hasOpenDialogURLParam)) {
                startInviteDialogFlow();
            }
            else if (location.state?.openResendPendingInvitationsDialog &&
                !shouldShowTrialDiscontinuedDialog) {
                applyActionOnMembers('reinviteAll', getPendingUsers(members));
                return;
            }
            const membersWithoutPublicKey = members
                .filter((m) => !m.hasPublicKey)
                .filter((m) => m.status === 'accepted');
            if (membersWithoutPublicKey.length) {
                setMembersMissingPublicKeyErrorPopupState({
                    showError: true,
                    membersWithoutPublicKey,
                });
            }
        })
            .catch(reportTACError);
        logPageView(PageView.TacUserList);
    }, [
        startInviteDialogFlow,
        applyActionOnMembers,
        getAuth,
        lee,
        location.state?.openResendPendingInvitationsDialog,
        location.state?.openSendInvitesDialog,
        mightShowExtendTrialDialog,
        reportTACError,
        shouldShowTrialDiscontinuedDialog,
        translate,
    ]);
    const seatsTaken = getSeatsTaken(lee.state.members.valueOr([]));
    useInviteMembersNotification();
    useAssignAdminNotification();
    return (<div sx={{
            padding: '16px 32px 32px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '56px',
        }}>
      
      {isSetupRolloutCtaProdActive ? (<Summary onReinviteAllClick={() => {
                applyActionOnMembers('reinviteAll', getPendingUsers(lee.state.members.valueOr([])));
            }}/>) : (<Header takenSeats={seatsTaken} totalSeats={lee.state.totalSeatCount.valueOr(0)} teamSecurityScore={lee.state.teamSecurityScore} accountRoute={routes.teamAccountRoutePath} companyName={lee.state.teamName.valueOr('—')} shouldDisplayTeamSecurityScore={true}/>)}
      <div sx={{ display: 'flex', justifyContent: 'center' }}>
        {isLoading ? (<LoadingSpinner containerStyle={{ minHeight: 240 }}/>) : (<List lee={lee} members={lee.state.members.valueOr([])} onMembersActionSelect={applyActionOnMembers} onMembersInvite={() => startInviteDialogFlow()}/>)}
      </div>
      {membersMissingPublicKeyErrorPopupState.showError ? (<MembersMissingPublicKeyErrorPopup membersWithoutPublicKey={membersMissingPublicKeyErrorPopupState.membersWithoutPublicKey} onClose={() => setMembersMissingPublicKeyErrorPopupState((prev) => {
                return { ...prev, showError: false };
            })}/>) : null}
      {memberActionDialog}
      <InviteDialogWithResults lee={lee} teamId={getCurrentTeamId(lee.globalState)} totalSeatCount={lee.state.totalSeatCount.valueOr(0)} numSeatsTaken={seatsTaken} excludedInviteMembers={lee.state.members
            .valueOr([] as TeamMemberInfo[])
            .filter(({ status }) => status !== 'removed')
            .map(({ login }) => login)} isFreeTrial={lee.state.isFreeTrial.valueOr(true)} shouldShowInviteDialog={showInviteDialog} handleCloseInviteDialog={() => setShowInviteDialog(false)} handleInvitePartialSuccess={handleInvitePartialSuccess} handleInviteCompleteSuccess={handleInviteCompleteSuccess} invitePartialSuccessState={invitePartialSuccessState} handleInvitationResultClosed={handleInvitationResultClosed}/>
    </div>);
};
export default TeamMembers;
