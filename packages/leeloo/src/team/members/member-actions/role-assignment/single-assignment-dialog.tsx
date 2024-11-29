import { useState } from "react";
import {
  AlertSeverity,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogTitle,
} from "@dashlane/ui-components";
import { Badge, Infobox, Paragraph } from "@dashlane/design-system";
import { TeamMemberInfo } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  RadioButton,
  RadioButtonGroup,
} from "../../../../libs/dashlane-style/radio-button";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import { useIsTeamDiscontinuedAfterTrial } from "../../../../libs/hooks/use-is-team-discontinued-after-trial";
import { useIsStandard } from "../../../helpers/use-is-standard";
import {
  getCurrentRole,
  MemberUpdate,
  Role,
  RoleAssignmentErrorsAndSuccesses,
  roleTitles,
} from "./role-assignment-dialog";
const I18N_KEYS = {
  DIALOG_TITLE: "team_members_assignment_dialog_title",
  ADMIN_DESCRIPTION: "team_members_assignment_dialog_admin_description",
  GROUP_MANAGER_DESCRIPTION:
    "team_members_assignment_dialog_group_manager_description",
  MEMBER_DESCRIPTION: "team_members_assignment_dialog_member_description",
  GROUPS_INFOBOX: "team_members_assignment_dialog_groups_infobox",
  UPDATE: "team_members_assignment_dialog_update_button",
  CANCEL: "team_members_assignment_dialog_cancel_button",
  CLOSE: "_common_dialog_dismiss_button",
  RIGHTS_CHANGE_SINGLE_SUCCESS: "team_members_assignment_single_success",
  RIGHTS_CHANGE_SINGLE_ERROR: "team_members_assignment_single_error",
  UPGRADE: "team_upgrade_label",
};
const roleDescriptions: Record<Role, string> = {
  teamCaptain: I18N_KEYS.ADMIN_DESCRIPTION,
  groupManager: I18N_KEYS.GROUP_MANAGER_DESCRIPTION,
  member: I18N_KEYS.MEMBER_DESCRIPTION,
};
enum StandardPlanRoleOrder {
  TeamCaptain = "teamCaptain",
  Member = "member",
  GroupManager = "groupManager",
}
export const SingleRoleAssignmentDialog = ({
  member,
  newRole,
  updateUsersRights,
  closeDialog,
}: {
  member: TeamMemberInfo;
  newRole?: Role;
  updateUsersRights: (
    memberUpdates: MemberUpdate[]
  ) => Promise<RoleAssignmentErrorsAndSuccesses | undefined>;
  closeDialog: () => void;
}) => {
  const { translate } = useTranslate();
  const alert = useAlert();
  const isB2BTrialDiscontinued = useIsTeamDiscontinuedAfterTrial();
  const startingRole: Role = getCurrentRole(member);
  const [selectedRole, setSelectedRole] = useState<string>(
    newRole ?? startingRole
  );
  const isStandardPlan = useIsStandard();
  const roleOrder = isStandardPlan ? StandardPlanRoleOrder : Role;
  const updateSelectedUserRights = async () => {
    if (selectedRole === startingRole) {
      return closeDialog();
    }
    try {
      const result = await updateUsersRights([
        { member, oldRole: startingRole, newRole: selectedRole as Role },
      ]);
      if (!result) {
        return;
      }
      if (result.successes.length) {
        alert.showAlert(
          translate(I18N_KEYS.RIGHTS_CHANGE_SINGLE_SUCCESS, {
            username: member.name || member.login || "Member",
            previousRole: translate(roleTitles[startingRole]),
            newRole: translate(roleTitles[selectedRole as Role]),
          }),
          AlertSeverity.SUCCESS
        );
      } else if (result.errors.length) {
        throw result.errors[0].error;
      }
    } catch {
      alert.showAlert(
        translate(I18N_KEYS.RIGHTS_CHANGE_SINGLE_ERROR, {
          username: member.name || member.login || "Member",
        }),
        AlertSeverity.ERROR
      );
    } finally {
      closeDialog();
    }
  };
  if (isB2BTrialDiscontinued === null) {
    return null;
  }
  const shouldOptionBeDisabled = (role: Role) => {
    if (
      (isB2BTrialDiscontinued &&
        role !== Role.TeamCaptain &&
        role !== selectedRole) ||
      (isStandardPlan && role === Role.GroupManager)
    ) {
      return true;
    }
    return false;
  };
  return (
    <Dialog
      isOpen
      onClose={closeDialog}
      closeIconName={translate(I18N_KEYS.CLOSE)}
    >
      <DialogTitle
        title={translate(I18N_KEYS.DIALOG_TITLE, { user: member.login })}
      />
      <DialogBody>
        <RadioButtonGroup
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
          }}
          groupName="roles"
        >
          {Object.values(roleOrder).map((value) => (
            <RadioButton
              key={value}
              value={value}
              disabled={shouldOptionBeDisabled(value)}
            >
              {value === "groupManager" && isStandardPlan ? (
                <div
                  sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <div sx={{ display: "flex", gap: "8px" }}>
                    <Paragraph
                      color="ds.text.neutral.standard"
                      textStyle={"ds.body.standard.regular"}
                    >
                      {translate(roleTitles[value])}
                    </Paragraph>
                    <Badge
                      mood="brand"
                      intensity="quiet"
                      label={translate(I18N_KEYS.UPGRADE)}
                      layout="iconLeading"
                      iconName="PremiumOutlined"
                      sx={{
                        color: "ds.text.brand.standard !important",
                        alignSelf: "center",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <Paragraph
                  color="ds.text.neutral.standard"
                  textStyle={"ds.body.standard.regular"}
                >
                  {translate(roleTitles[value])}
                </Paragraph>
              )}
              <Paragraph
                color="ds.text.neutral.quiet"
                textStyle={"ds.body.standard.regular"}
              >
                {translate(roleDescriptions[value])}
              </Paragraph>
            </RadioButton>
          ))}
        </RadioButtonGroup>
        {selectedRole !== Role.Member && !isStandardPlan ? (
          <Infobox mood="brand" title={translate(I18N_KEYS.GROUPS_INFOBOX)} />
        ) : null}
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.UPDATE)}
        primaryButtonOnClick={updateSelectedUserRights}
        primaryButtonProps={{
          type: "button",
          style: {
            padding: "0 20px",
          },
          disabled: selectedRole === startingRole,
        }}
        secondaryButtonTitle={translate(I18N_KEYS.CANCEL)}
        secondaryButtonOnClick={closeDialog}
        secondaryButtonProps={{
          type: "button",
          style: {
            border: "none",
            padding: "0 20px",
            color: "ds.text.neutral.catchy",
            backgroundColor: "ds.container.expressive.neutral.quiet.idle",
          },
        }}
      />
    </Dialog>
  );
};
