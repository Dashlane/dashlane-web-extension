import { useEffect, useState } from "react";
import { Dialog, DialogProps } from "@dashlane/design-system";
import {
  UseInviteTeamMembersDialogData,
  useInviteTeamMembersDialogData,
} from "./hooks/use-invite-team-members-dialog-data";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  InvitationStepError,
  InvitationStepIdle,
  InvitationStepSuccess,
} from "./steps";
import { InvitationStep } from "./types";
import { logCancelSendManualInvite } from "./logs";
const I18N_KEYS = {
  DIALOG_TITLE_INVITE:
    "onb_vault_get_started_invite_members_dialog_step_idle_title",
  DIALOG_TITLE_ERROR:
    "onb_vault_get_started_invite_members_dialog_step_failure_title",
  DIALOG_TITLE_COMPLETED:
    "onb_vault_get_started_invite_members_dialog_step_success_title",
  ACTION_BUTTON_INVITE:
    "onb_vault_get_started_invite_members_dialog_step_idle_action_invite",
  CANCEL_BUTTON_INVITE:
    "onb_vault_get_started_invite_members_dialog_step_idle_action_cancel",
  CANCEL_BUTTON_FAILURE:
    "onb_vault_get_started_invite_members_dialog_step_failure_cancel",
  ACTION_BUTTON_TRY_AGAIN:
    "onb_vault_get_started_invite_members_dialog_step_failure_action_retry",
  ACTION_BUTTON_GOT_IT:
    "onb_vault_get_started_invite_members_dialog_step_success_button",
};
const DialogComponent = ({
  status,
  dialogData,
  isLoading,
}: {
  status: InvitationStep;
  dialogData: UseInviteTeamMembersDialogData;
  isLoading: boolean;
}) => {
  switch (status) {
    case InvitationStep.ERROR:
      return <InvitationStepError />;
    case InvitationStep.SUCCESS:
      return <InvitationStepSuccess />;
    default:
      return (
        <InvitationStepIdle dialogData={dialogData} isLoading={isLoading} />
      );
  }
};
interface InviteTeamMembersDialogProps {
  isShown: boolean;
  setIsShown: (isDialogShow: boolean) => void;
}
export const InviteTeamMembersDialog = ({
  isShown,
  setIsShown,
}: InviteTeamMembersDialogProps) => {
  const { translate } = useTranslate();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<InvitationStep>(InvitationStep.IDLE);
  const dialogData = useInviteTeamMembersDialogData();
  useEffect(() => {
    if (isShown) {
    }
  }, [isShown, status]);
  const handleResetDialog = () => {
    setIsLoading(false);
    setStatus(InvitationStep.IDLE);
    dialogData.handleEmailsReset();
  };
  const handleCancel = () => {
    if (status === InvitationStep.IDLE) {
      logCancelSendManualInvite();
    }
    setIsShown(false);
    handleResetDialog();
  };
  const handleInvite = () => {
    setIsLoading(true);
    dialogData
      .handleProposeMembers()
      .then((invitationStep) => {
        setStatus(invitationStep);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const getDialogTitle = (status: InvitationStep) => {
    switch (status) {
      case InvitationStep.ERROR:
        return translate(I18N_KEYS.DIALOG_TITLE_ERROR);
      case InvitationStep.SUCCESS:
        return translate(I18N_KEYS.DIALOG_TITLE_COMPLETED);
      default:
        return translate(I18N_KEYS.DIALOG_TITLE_INVITE);
    }
  };
  const getDialogActions = (status: InvitationStep): DialogProps["actions"] => {
    switch (status) {
      case InvitationStep.ERROR:
        return {
          primary: {
            children: translate(I18N_KEYS.ACTION_BUTTON_TRY_AGAIN),
            onClick: handleResetDialog,
            layout: "iconTrailing",
          },
          secondary: {
            children: translate(I18N_KEYS.CANCEL_BUTTON_FAILURE),
            onClick: handleCancel,
          },
        };
      case InvitationStep.SUCCESS:
        return {
          primary: {
            children: translate(I18N_KEYS.ACTION_BUTTON_GOT_IT),
            onClick: handleCancel,
            layout: "iconTrailing",
          },
        };
      default:
        return {
          primary: {
            children: translate(I18N_KEYS.ACTION_BUTTON_INVITE),
            onClick: handleInvite,
            layout: "iconTrailing",
            isLoading: isLoading,
            disabled: dialogData.emailFields.every(({ value }) => value === ""),
          },
          secondary: {
            children: translate(I18N_KEYS.CANCEL_BUTTON_INVITE),
            onClick: handleCancel,
            disabled: isLoading,
          },
        };
    }
  };
  return (
    <Dialog
      isOpen={isShown}
      title={getDialogTitle(status)}
      actions={getDialogActions(status)}
      closeActionLabel={translate(I18N_KEYS.CANCEL_BUTTON_INVITE)}
      onClose={handleCancel}
    >
      <DialogComponent
        status={status}
        dialogData={dialogData}
        isLoading={isLoading}
      />
    </Dialog>
  );
};
