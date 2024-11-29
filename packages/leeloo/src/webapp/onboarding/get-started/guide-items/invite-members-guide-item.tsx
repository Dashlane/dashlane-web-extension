import { useState } from "react";
import { TaskAction } from "../types/action.types";
import { ActionType, GuideItemComponentProps } from "../types/item.types";
import { logTaskInviteMembersClick } from "../logs";
import { logStartSendManualInvite } from "../invite-team-members-dialog/logs";
import { InviteTeamMembersDialog } from "../invite-team-members-dialog/invite-team-members-dialog";
import { GuideItemComponent } from "./components/guide-item-component";
const I18N_KEYS = {
  TITLE: "onb_vault_get_started_task_invite_members",
  ACTION: "onb_vault_get_started_btn_invite_members",
};
export const InviteMembersGuideItem = ({ status }: GuideItemComponentProps) => {
  const [openInviteMembersDialog, setOpenInviteMembersDialog] = useState(false);
  const handleOpenInviteDialog = () => {
    setOpenInviteMembersDialog(true);
    logTaskInviteMembersClick();
    logStartSendManualInvite();
  };
  const action: TaskAction = {
    label: I18N_KEYS.ACTION,
    type: ActionType.TASK,
    handler: handleOpenInviteDialog,
  };
  return (
    <>
      <GuideItemComponent
        icon="ItemEmailOutlined"
        title={I18N_KEYS.TITLE}
        action={action}
        status={status}
      />
      <InviteTeamMembersDialog
        isShown={openInviteMembersDialog}
        setIsShown={setOpenInviteMembersDialog}
      />
    </>
  );
};
