import { AlertSeverity, DialogFooter } from "@dashlane/ui-components";
import { TeamMemberInfo } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SimpleDialog } from "../../../../libs/dashlane-style/dialogs/simple/simple-dialog";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import {
  getCurrentRole,
  MemberUpdate,
  Role,
  RoleAssignmentErrorsAndSuccesses,
  roleTitles,
} from "./role-assignment-dialog";
const I18N_KEYS = {
  RIGHTS_CHANGE_MULTIPLE_TITLE: "team_members_assignment_multiple_dialog_title",
  RIGHTS_CHANGE_MULTIPLE_ADMIN_MSG:
    "team_members_assignment_multiple_dialog_admin_message",
  RIGHTS_CHANGE_MULTIPLE_GROUP_MANAGER_MSG:
    "team_members_assignment_multiple_dialog_group_manager_message",
  RIGHTS_CHANGE_MULTIPLE_MEMBER_MSG:
    "team_members_assignment_multiple_dialog_member_message",
  RIGHTS_CHANGE_MULTIPLE_SUBMIT:
    "team_members_assignment_multiple_dialog_submit",
  RIGHTS_CHANGE_MULTIPLE_CANCEL:
    "team_members_assignment_multiple_dialog_cancel",
  RIGHTS_CHANGE_MULTIPLE_PARTIAL_SUCCESS:
    "team_members_assignment_multiple_partial_success",
  RIGHTS_CHANGE_MULTIPLE_SUCCESS: "team_members_assignment_multiple_success",
  RIGHTS_CHANGE_MULTIPLE_ERROR: "team_members_assignment_multiple_error",
};
export const MultipleRoleAssignmentDialog = ({
  selectedMembers,
  newRole,
  updateUsersRights,
  closeDialog,
}: {
  selectedMembers: TeamMemberInfo[];
  newRole: Role;
  updateUsersRights: (
    memberUpdates: MemberUpdate[]
  ) => Promise<RoleAssignmentErrorsAndSuccesses | undefined>;
  closeDialog: () => void;
}) => {
  const { translate } = useTranslate();
  const alert = useAlert();
  const getChangeRoleMessage = () => {
    switch (newRole) {
      case Role.TeamCaptain:
        return translate(I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_ADMIN_MSG);
      case Role.GroupManager:
        return translate(I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_GROUP_MANAGER_MSG);
      default:
        return translate(I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_MEMBER_MSG);
    }
  };
  const updateSelectedUserRights = async () => {
    const memberUpdates = selectedMembers.map((member) => {
      return {
        member: member,
        oldRole: getCurrentRole(member),
        newRole: newRole,
      };
    });
    try {
      const result = await updateUsersRights(memberUpdates);
      if (!result) {
        return;
      }
      const newRoleTitle = translate(roleTitles[newRole]);
      if (result.successes.length && result.errors.length) {
        alert.showAlert(
          translate(I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_PARTIAL_SUCCESS, {
            countSuccess: result.successes.length,
            countTotal: memberUpdates.length,
            newRole: newRoleTitle,
          }),
          AlertSeverity.WARNING
        );
      } else if (result.successes.length) {
        alert.showAlert(
          translate(I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_SUCCESS, {
            count: result.successes.length,
            newRole: newRoleTitle,
          }),
          AlertSeverity.SUCCESS
        );
      } else if (result.errors.length) {
        alert.showAlert(
          translate(I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_ERROR, {
            count: result.errors.length,
          }),
          AlertSeverity.ERROR
        );
      }
    } catch {
      alert.showAlert(
        translate(I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_ERROR, {
          count: selectedMembers.length,
        }),
        AlertSeverity.ERROR
      );
    } finally {
      closeDialog();
    }
  };
  return (
    <SimpleDialog
      isOpen
      footer={
        <DialogFooter
          intent="primary"
          primaryButtonTitle={translate(
            I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_SUBMIT
          )}
          primaryButtonOnClick={updateSelectedUserRights}
          secondaryButtonTitle={translate(
            I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_CANCEL
          )}
          secondaryButtonOnClick={closeDialog}
        />
      }
      onRequestClose={closeDialog}
      title={translate(I18N_KEYS.RIGHTS_CHANGE_MULTIPLE_TITLE, {
        countTotal: selectedMembers.length,
        newRole: translate(roleTitles[newRole]),
      })}
    >
      {getChangeRoleMessage()}
    </SimpleDialog>
  );
};
