import { DialogFooter } from "@dashlane/ui-components";
import { permissionsApi } from "@dashlane/access-rights-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { TeamMemberInfo } from "@dashlane/communication";
import { getAuth } from "../../../../user";
import { LEE_INCORRECT_AUTHENTICATION, LeeWithStorage } from "../../../../lee";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SimpleDialog } from "../../../../libs/dashlane-style/dialogs/simple/simple-dialog";
import {
  addTeamAdmin,
  removeTeamAdmin,
  teamUpdated,
} from "../../../../libs/carbon/triggers";
import { useAlertQueue } from "../../../alerts/use-alert-queue";
import * as actions from "../reducer";
import { State } from "../..";
import { SingleRoleAssignmentDialog } from "./single-assignment-dialog";
import { MultipleRoleAssignmentDialog } from "./multiple-assignment-dialog";
const I18N_KEYS = {
  ADMIN_LABEL: "team_members_assignment_dialog_admin_label",
  GROUP_MANAGER_LABEL: "team_members_assignment_dialog_group_manager_label",
  MEMBER_LABEL: "team_members_assignment_dialog_member_label",
  RIGHTS_CHANGE_NOBODY_TITLE: "team_members_assignment_nobody_dialog_title",
  RIGHTS_CHANGE_NOBODY_MSG: "team_members_assignment_nobody_dialog_message",
  RIGHTS_CHANGE_NOBODY_CANCEL: "team_members_assignment_nobody_dialog_cancel",
};
export enum Role {
  TeamCaptain = "teamCaptain",
  GroupManager = "groupManager",
  Member = "member",
}
export type RoleAssignmentErrorsAndSuccesses = {
  errors: {
    member: string;
    error: Error;
  }[];
  successes: string[];
};
export interface MemberUpdate {
  member: TeamMemberInfo;
  oldRole: Role;
  newRole: Role;
}
export const getCurrentRole = (member: TeamMemberInfo) => {
  if (member.isTeamCaptain) {
    return Role.TeamCaptain;
  } else if (member.isGroupManager) {
    return Role.GroupManager;
  } else {
    return Role.Member;
  }
};
export const roleTitles: Record<Role, string> = {
  teamCaptain: I18N_KEYS.ADMIN_LABEL,
  groupManager: I18N_KEYS.GROUP_MANAGER_LABEL,
  member: I18N_KEYS.MEMBER_LABEL,
};
export const RoleAssignmentDialog = ({
  selectedMembers,
  newRole,
  lee,
  closeDialog,
}: {
  selectedMembers: TeamMemberInfo[];
  newRole?: Role;
  lee: LeeWithStorage<State>;
  closeDialog: () => void;
}) => {
  const { reportTACError } = useAlertQueue();
  const { translate } = useTranslate();
  const { addGroupManager, removeGroupManager } =
    useModuleCommands(permissionsApi);
  const updateUsersRights = async (
    memberUpdates: MemberUpdate[]
  ): Promise<RoleAssignmentErrorsAndSuccesses | undefined> => {
    const auth = getAuth(lee.globalState);
    if (!auth) {
      reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
      return;
    }
    const { teamId } = auth;
    if (!teamId) {
      throw new Error("No team ID when attempting role assignment");
    }
    const assignmentStatus: RoleAssignmentErrorsAndSuccesses = {
      errors: [],
      successes: [],
    };
    for await (const { member, oldRole, newRole } of memberUpdates) {
      try {
        switch (oldRole) {
          case Role.TeamCaptain:
            await removeTeamAdmin({
              teamId,
              memberLogin: member.login,
            });
            lee.dispatch(actions.userDemotedCaptain(member));
            await teamUpdated({
              teamId,
              action: "adminDemoted",
              users: [member.login],
            });
            break;
          case Role.GroupManager:
            await removeGroupManager({ memberLogin: member.login, teamId });
            lee.dispatch(actions.userRemovedGroupManager(member));
            break;
          default:
            break;
        }
        switch (newRole) {
          case Role.TeamCaptain:
            await addTeamAdmin({
              teamId,
              memberLogin: member.login,
            });
            lee.dispatch(actions.userPromotedCaptain(member));
            await teamUpdated({
              teamId,
              action: "adminPromoted",
              users: [member.login],
            });
            break;
          case Role.GroupManager:
            await addGroupManager({ memberLogin: member.login, teamId });
            lee.dispatch(actions.userAddedGroupManager(member));
            break;
          default:
            break;
        }
        assignmentStatus.successes.push(member.login);
      } catch (e) {
        assignmentStatus.errors.push({ member: member.login, error: e });
      }
    }
    return assignmentStatus;
  };
  if (!selectedMembers.length) {
    return (
      <SimpleDialog
        isOpen
        footer={
          <DialogFooter
            intent="secondary"
            secondaryButtonTitle={translate(
              I18N_KEYS.RIGHTS_CHANGE_NOBODY_CANCEL
            )}
            secondaryButtonOnClick={closeDialog}
          />
        }
        onRequestClose={closeDialog}
        title={translate(I18N_KEYS.RIGHTS_CHANGE_NOBODY_TITLE)}
      >
        {translate(I18N_KEYS.RIGHTS_CHANGE_NOBODY_MSG, {
          newRole: newRole ? translate(roleTitles[newRole]) : "",
        })}
      </SimpleDialog>
    );
  } else if (selectedMembers.length === 1) {
    return (
      <SingleRoleAssignmentDialog
        member={selectedMembers[0]}
        newRole={newRole}
        updateUsersRights={updateUsersRights}
        closeDialog={closeDialog}
      />
    );
  }
  return (
    <MultipleRoleAssignmentDialog
      selectedMembers={selectedMembers}
      newRole={newRole ?? Role.Member}
      updateUsersRights={updateUsersRights}
      closeDialog={closeDialog}
    />
  );
};
