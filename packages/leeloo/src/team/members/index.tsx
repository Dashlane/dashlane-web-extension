import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Maybe } from "tsmonad";
import { TeamMemberInfo } from "@dashlane/communication";
import { Heading, useToast } from "@dashlane/design-system";
import {
  DataStatus,
  useFeatureFlip,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  FlowStep,
  PageView,
  UserSendManualInviteEvent,
} from "@dashlane/hermes";
import {
  AvailableFeatureFlips,
  teamMembersApi,
  teamPlanDetailsApi,
} from "@dashlane/team-admin-contracts";
import { LEE_INCORRECT_AUTHENTICATION, LeeWithStorage } from "../../lee";
import { useAlert } from "../../libs/alert-notifications/use-alert";
import { getCurrentTeamId } from "../../libs/carbon/spaces";
import { getTeamMembers } from "../../libs/carbon/triggers";
import LoadingSpinner from "../../libs/dashlane-style/loading-spinner";
import { useFrozenState } from "../../libs/frozen-state/frozen-state-dialog-context";
import { useConditionsForTrialExtensionDialogs } from "../../libs/hooks/use-conditions-for-trial-extension-dialogs";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import useTranslate from "../../libs/i18n/useTranslate";
import { logEvent, logPageView } from "../../libs/logs/logEvent";
import { getAuth as getUserAuth } from "../../user";
import { useAlertQueue } from "../alerts/use-alert-queue";
import { getSeatsTaken } from "../helpers/get-seats-taken";
import { InviteDialogWithResults } from "../invite-dialog/invite-dialog-with-results";
import { ActivateInviteLinkDialog } from "../invite-link-activation-dialog/activate-invite-link-dialog";
import { ShareInviteLinkDialog as ShareInviteLinkDialogDS } from "../invite-link-sharing-dialog/share-invite-link-dialog";
import {
  InvitePartialSuccessState,
  useInviteResultPartialSuccess,
} from "../invite-result-dialog";
import { ConsolePage } from "../page";
import { BackupCodeGenerationDialogFlowInitiator } from "./backup-code-generation/backup-generation-dialog-flow-initiatior";
import { FailedIdPProvisioningsInfobox } from "./failed-provisionings/failed-idp-provisionings-infobox";
import { getPendingUsers } from "./get-pending-users";
import { hasRefusedMembers } from "./helpers";
import { List } from "./list";
import { CancelChangeLoginEmail } from "./member-actions/change-login-email/cancel-change-login-email-dialog";
import { ChangeLoginEmailDialog } from "./member-actions/change-login-email/change-login-email-dialog";
import { EnableInviteLinkDialog } from "./member-actions/enable-invite-link-dialog";
import * as actions from "./member-actions/reducer";
import { ReinviteAllDialog } from "./member-actions/reinvite-all-dialog";
import { RevokeDialog } from "./member-actions/revoke-dialog";
import {
  Role,
  RoleAssignmentDialog,
} from "./member-actions/role-assignment/role-assignment-dialog";
import { ShareInviteLinkDialog } from "./member-actions/share-invite-link-dialog";
import { MembersMissingPublicKeyErrorPopup } from "./members-missing-public-key-error/members-missing-public-key-error-popup";
import { NonMembersInfobox } from "./non-members-infobox/non-members-infobox";
import Summary from "./summary";
import { MemberAction } from "./types";
const I18N_KEYS = {
  MEMBERS_PAGE_TITLE: "team_members_page_title",
  INVITE_SUCCESS_MESSAGE: "team_members_invite_success_message",
  INVITE_ERROR_MSG_NO_FREE_SLOT:
    "team_members_invite_error_message_no_free_slot",
  INVITE_ERROR_MSG: "team_members_invite_error_message",
  CLOSE_TOAST: "_common_toast_close_label",
};
export interface State {
  members: Maybe<TeamMemberInfo[]>;
  totalSeatCount: Maybe<number>;
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
export const handleSingleChangeAsBatch = async (
  members: TeamMemberInfo[],
  asyncCallback: (member: TeamMemberInfo) => Promise<string>
): Promise<ErrorsAndSuccesses> => {
  const errorsAndSuccesses: ErrorsAndSuccesses = {
    errors: [],
    successes: [],
  };
  for await (const member of members) {
    try {
      const login = await asyncCallback(member);
      errorsAndSuccesses.successes.push(login);
    } catch (e) {
      errorsAndSuccesses.errors.push(e);
    }
  }
  return errorsAndSuccesses;
};
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
  const { proposeMembers } = useModuleCommands(teamMembersApi);
  const { showToast } = useToast();
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const teamTrialStatus = useTeamTrialStatus();
  const { data: teamSeatsData, status: teamSeatsStatus } = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamSeats"
  );
  const [isLoading, setIsLoading] = useState(true);
  const {
    invitePartialSuccessState,
    setInvitePartialSuccessState,
    handleInvitationResultClosed,
  } = useInviteResultPartialSuccess();
  const [memberActionDialog, setMemberActionDialog] =
    useState<null | ReactNode>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const isInviteLinkGrapheneFF = useFeatureFlip(
    AvailableFeatureFlips.WebOnboardingInviteLinkTacMigration
  );
  const [
    membersMissingPublicKeyErrorPopupState,
    setMembersMissingPublicKeyErrorPopupState,
  ] = useState<{
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
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    } else {
      setShowInviteDialog(true);
      logEvent(
        new UserSendManualInviteEvent({
          flowStep: FlowStep.Start,
          inviteCount: 0,
          inviteFailedCount: 0,
          inviteResentCount: 0,
          inviteSuccessfulCount: 0,
          isImport: false,
          isResend: false,
        })
      );
    }
  }, [shouldShowFrozenStateDialog]);
  const handleInviteCompleteSuccess = (
    successfullyInvitedMemberEmails: string[]
  ) => {
    lee.dispatch(
      actions.newMembersProposedAction(successfullyInvitedMemberEmails)
    );
  };
  const handleInvitePartialSuccess = (
    successfullyInvitedMembers: InvitePartialSuccessState["invitedMembers"],
    refusedMembers: InvitePartialSuccessState["refusedMembers"]
  ) => {
    setInvitePartialSuccessState({
      show: true,
      invitedMembers: successfullyInvitedMembers,
      refusedMembers: refusedMembers,
    });
    handleInviteCompleteSuccess(Object.keys(successfullyInvitedMembers));
  };
  const applyActionOnMembers = useCallback(
    (
      memberAction: MemberAction,
      selectedMembers: TeamMemberInfo[] = [],
      newRole?: Role
    ): void => {
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
          if (response.tag === "failure") {
            throw new Error(response.error);
          }
          if (response.data && hasRefusedMembers(response.data)) {
            const { refusedMembers } = response.data.content;
            Object.values(refusedMembers).forEach((login) => {
              const member = selectedMembers.find(
                (proposedMember) => proposedMember.login === login
              );
              handleInvitePartialSuccess(
                response.data.proposedMembers,
                response.data.refusedMembers
              );
              lee.dispatch(actions.userResentInvitationFailed(member));
            });
            logEvent(
              new UserSendManualInviteEvent({
                flowStep: FlowStep.Complete,
                inviteCount:
                  memberLogins.length + Object.keys(refusedMembers).length,
                inviteFailedCount: Object.keys(refusedMembers).length,
                inviteResentCount: memberLogins.length,
                inviteSuccessfulCount:
                  memberLogins.length - Object.keys(refusedMembers).length,
                isImport: false,
                isResend: true,
              })
            );
          } else {
            showToast({
              description: translate(I18N_KEYS.INVITE_SUCCESS_MESSAGE),
              mood: "brand",
              closeActionLabel: translate(I18N_KEYS.CLOSE_TOAST),
            });
            logEvent(
              new UserSendManualInviteEvent({
                flowStep: FlowStep.Complete,
                inviteCount: memberLogins.length,
                inviteFailedCount: 0,
                inviteResentCount: memberLogins.length,
                inviteSuccessfulCount: memberLogins.length,
                isImport: false,
                isResend: true,
              })
            );
          }
        } catch (e) {
          const { message = "", data = {} } = e;
          const noFreeSlotsText = translate(
            I18N_KEYS.INVITE_ERROR_MSG_NO_FREE_SLOT
          );
          const defaultErrorText = translate(I18N_KEYS.INVITE_ERROR_MSG);
          const { content: { error: errorContent = message } = {} } = data;
          const inviteErrorMessage = [
            "no_free_slot_free_plan",
            "no_free_slot",
          ].includes(errorContent)
            ? noFreeSlotsText
            : defaultErrorText;
          selectedMembers.forEach((member) => {
            lee.dispatch(actions.userResentInvitationFailed(member));
          });
          showToast({
            description: inviteErrorMessage,
            mood: "danger",
            closeActionLabel: translate(I18N_KEYS.CLOSE_TOAST),
          });
          logEvent(
            new UserSendManualInviteEvent({
              flowStep: FlowStep.Error,
              inviteCount: memberLogins.length,
              inviteFailedCount: memberLogins.length,
              inviteResentCount: memberLogins.length,
              inviteSuccessfulCount: 0,
              isImport: false,
              isResend: true,
            })
          );
        }
      };
      const memberLogins = selectedMembers.map((m) => m.login);
      switch (memberAction) {
        case "reassign":
          return setMemberActionDialog(
            <RoleAssignmentDialog
              lee={lee}
              selectedMembers={selectedMembers}
              newRole={newRole}
              closeDialog={() => setMemberActionDialog(null)}
            />
          );
        case "reactivate":
          if (shouldShowFrozenStateDialog) {
            openTrialDiscontinuedDialog();
            return;
          }
          resendOrReactivate();
          return;
        case "reinvite":
          if (shouldShowFrozenStateDialog) {
            openTrialDiscontinuedDialog();
            return;
          }
          resendOrReactivate();
          return;
        case "reinviteAll":
          if (shouldShowFrozenStateDialog) {
            openTrialDiscontinuedDialog();
            return;
          }
          return setMemberActionDialog(
            <ReinviteAllDialog
              resendOrReactivate={resendOrReactivate}
              closeDialog={() => setMemberActionDialog(null)}
            />
          );
        case "revoke":
          return setMemberActionDialog(
            <RevokeDialog
              lee={lee}
              selectedMembers={selectedMembers}
              closeDialog={() => setMemberActionDialog(null)}
            />
          );
        case "changeLoginEmail":
          return setMemberActionDialog(
            <ChangeLoginEmailDialog
              selectedMembers={selectedMembers}
              closeDialog={() => setMemberActionDialog(null)}
            />
          );
        case "cancelChangeLoginEmail":
          return setMemberActionDialog(
            <CancelChangeLoginEmail
              selectedMembers={selectedMembers}
              closeDialog={() => setMemberActionDialog(null)}
            />
          );
        case "generateBackupCode":
          return setMemberActionDialog(
            <BackupCodeGenerationDialogFlowInitiator
              memberLogin={memberLogins[0]}
              isOpen={true}
              closeBackupCodeDialog={() => setMemberActionDialog(null)}
            />
          );
        case "enableInviteLink":
          if (shouldShowFrozenStateDialog) {
            openTrialDiscontinuedDialog();
            return;
          }
          return setMemberActionDialog(
            isInviteLinkGrapheneFF === true ? (
              <ActivateInviteLinkDialog
                isOpen={true}
                onCancel={() => setMemberActionDialog(null)}
                onInviteLinkActivation={() =>
                  applyActionOnMembers("shareInviteLink")
                }
              />
            ) : (
              <EnableInviteLinkDialog
                closeDialog={() => setMemberActionDialog(null)}
                applyActionOnMembers={applyActionOnMembers}
              />
            )
          );
        case "shareInviteLink":
          if (shouldShowFrozenStateDialog) {
            openTrialDiscontinuedDialog();
            return;
          }
          return setMemberActionDialog(
            isInviteLinkGrapheneFF === true ? (
              <ShareInviteLinkDialogDS
                isOpen={true}
                onClose={() => setMemberActionDialog(null)}
              />
            ) : (
              <ShareInviteLinkDialog
                closeDialog={() => setMemberActionDialog(null)}
              />
            )
          );
      }
    },
    [
      alert,
      getAuth,
      handleInvitePartialSuccess,
      shouldShowFrozenStateDialog,
      translate,
    ]
  );
  useEffect(() => {
    if (
      componentDidMount.current ||
      mightShowExtendTrialDialog === null ||
      shouldShowFrozenStateDialog === null
    ) {
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
    getTeamMembers({ teamId })
      .then((members) => {
        lee.dispatch(actions.membersLoaded({ members }));
        actions.statusLoaded({
          extraFreeSlots: teamSeatsData?.extraFree ?? 0,
          membersNumber: members.length,
        });
        setIsLoading(false);
        const isOneMemberTeam = members && members.length === 1;
        const hasOpenDialogURLParam = location.state?.openSendInvitesDialog;
        if (
          !shouldShowFrozenStateDialog &&
          ((!mightShowExtendTrialDialog && isOneMemberTeam) ||
            hasOpenDialogURLParam)
        ) {
          startInviteDialogFlow();
        } else if (
          location.state?.openResendPendingInvitationsDialog &&
          !shouldShowFrozenStateDialog
        ) {
          applyActionOnMembers("reinviteAll", getPendingUsers(members));
          return;
        }
        const membersWithoutPublicKey = members
          .filter((m) => !m.hasPublicKey)
          .filter((m) => m.status === "accepted");
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
    shouldShowFrozenStateDialog,
    translate,
    teamSeatsData?.extraFree,
  ]);
  if (!teamTrialStatus || teamSeatsStatus !== DataStatus.Success) {
    return null;
  }
  const seatsTaken = getSeatsTaken(lee.state.members.valueOr([]));
  return (
    <ConsolePage
      header={
        <Heading
          as="h1"
          color="ds.text.neutral.standard"
          textStyle="ds.title.section.large"
        >
          {translate(I18N_KEYS.MEMBERS_PAGE_TITLE)}
        </Heading>
      }
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <NonMembersInfobox />
        <FailedIdPProvisioningsInfobox />
        <Summary
          onReinviteAllClick={() => {
            applyActionOnMembers(
              "reinviteAll",
              getPendingUsers(lee.state.members.valueOr([]))
            );
          }}
        />
        <div sx={{ display: "flex", justifyContent: "center" }}>
          {isLoading ? (
            <LoadingSpinner containerStyle={{ minHeight: 240 }} />
          ) : (
            <List
              lee={lee}
              members={lee.state.members.valueOr([])}
              onMembersActionSelect={applyActionOnMembers}
              onMembersInvite={startInviteDialogFlow}
            />
          )}
        </div>
        {membersMissingPublicKeyErrorPopupState.showError ? (
          <MembersMissingPublicKeyErrorPopup
            membersWithoutPublicKey={
              membersMissingPublicKeyErrorPopupState.membersWithoutPublicKey
            }
            onClose={() =>
              setMembersMissingPublicKeyErrorPopupState((prev) => {
                return { ...prev, showError: false };
              })
            }
          />
        ) : null}
        {memberActionDialog}
        <InviteDialogWithResults
          lee={lee}
          teamId={getCurrentTeamId(lee.globalState)}
          totalSeatCount={lee.state.totalSeatCount.valueOr(0)}
          numSeatsTaken={seatsTaken}
          excludedInviteMembers={lee.state.members
            .valueOr([] as TeamMemberInfo[])
            .filter(({ status }) => status !== "removed")
            .map(({ login }) => login)}
          isFreeTrial={teamTrialStatus.isFreeTrial}
          shouldShowInviteDialog={showInviteDialog}
          handleCloseInviteDialog={() => setShowInviteDialog(false)}
          handleInvitePartialSuccess={handleInvitePartialSuccess}
          handleInviteCompleteSuccess={handleInviteCompleteSuccess}
          invitePartialSuccessState={invitePartialSuccessState}
          handleInvitationResultClosed={handleInvitationResultClosed}
        />
      </div>
    </ConsolePage>
  );
};
export default TeamMembers;
