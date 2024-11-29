import { useRef, useState } from "react";
import { UserInvite } from "@dashlane/communication";
import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { AlertSeverity } from "@dashlane/ui-components";
import { Lee, LEE_INCORRECT_AUTHENTICATION } from "../../../../../lee";
import { Avatar } from "../../../../../libs/dashlane-style/avatar/avatar";
import { inviteMembers } from "../../../../../libs/carbon/triggers";
import {
  ButtonWithPopup,
  ButtonWithPopupRef,
} from "../../../../../libs/dashlane-style/action-with-popup/button";
import {
  Multiselect,
  MultiselectError,
} from "../../../../../libs/dashlane-style/multiselect";
import { getCurrentTeamId } from "../../../../../libs/carbon/spaces";
import { isValidEmail } from "../../../../../libs/validators";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useAlert } from "../../../../../libs/alert-notifications/use-alert";
import InviteResultDialog, {
  useInviteResultPartialSuccess,
} from "../../../../invite-result-dialog";
import { useTeamSpaceContext } from "../../../../settings/components/TeamSpaceContext";
import { useTeamMembers } from "../../../../helpers/useTeamMembers";
import styles from "./styles.css";
interface AddMembersProps {
  lee: Lee;
  userGroup: UserGroupDownload;
}
const I18N_KEYS = {
  INVITE_TO_GROUP_TITLE: "team_groups_edit_invite_member_to_group_error_title",
  MISSING_PUB_KEY_ERROR:
    "team_groups_edit_invite_member_to_group_missing_public_key_error_message_markup",
  INVITE_GENERIC_ERROR:
    "team_groups_edit_invite_member_to_group_error_message_markup",
  ADD_MEMBER_HEADER: "team_groups_edit_add_member_header",
  ADD_MEMBERS_BUTTON: "team_groups_edit_add_members",
  ADD_MEMBERS_CONFIRM_BUTTON: "team_groups_edit_add_member_confirm",
  ADD_MEMBERS_CANCEL_BUTTON: "team_groups_edit_add_member_cancel",
  ADD_MEMBER_INPUT_PLACEHOLDER: "team_groups_edit_add_member_input_placeholder",
  ADD_MEMBER_NOT_ENOUGH_SLOTS_ERROR:
    "team_group_edit_add_member_not_enough_slots_error",
};
export const AddMembers = ({ lee, userGroup }: AddMembersProps) => {
  const newGroupButtonWithPopupRef = useRef<ButtonWithPopupRef>(null);
  const { translate } = useTranslate();
  const { teamId } = useTeamSpaceContext();
  const { teamMembers } = useTeamMembers(teamId);
  const [error, setError] = useState<string | null>(null);
  const [addMemberEmails, setAddMemberEmails] = useState<string[]>([]);
  const {
    invitePartialSuccessState,
    setInvitePartialSuccessState,
    handleInvitationResultClosed,
  } = useInviteResultPartialSuccess();
  const alert = useAlert();
  const getActiveUserGroupMembersAliases = () =>
    userGroup.users
      .filter(({ status }) => ["accepted", "pending"].includes(status))
      .map(({ alias }) => alias);
  const getCurrentSelectionAvatar = (alias: string) => {
    return <Avatar className={styles.avatar} email={alias} size={32} />;
  };
  const getAutocompleteData = (): {
    text: string;
    icon: JSX.Element;
  }[] => {
    const userGroupMembersAliasSet = new Set(
      getActiveUserGroupMembersAliases()
    );
    return teamMembers
      .filter(
        ({ login, status }) =>
          status !== "removed" && !userGroupMembersAliasSet.has(login)
      )
      .map(({ login }) => ({
        text: login,
        icon: getCurrentSelectionAvatar(login),
      }));
  };
  const isInputValid = () => {
    return Boolean(addMemberEmails.length);
  };
  const handleAddMemberEmailsChanged = (emails: string[]) => {
    setAddMemberEmails(emails);
  };
  const handleAddMemberCancelled = () => {
    setAddMemberEmails([]);
    setError(null);
  };
  const handleAddMemberConfirmed = async () => {
    if (!isInputValid()) {
      return;
    }
    const emails = addMemberEmails;
    const { groupId, revision, name: groupName } = userGroup;
    const users: UserInvite[] = emails.map((email) => ({
      alias: email.toLowerCase(),
      permission: "limited",
    }));
    if (teamId === null) {
      lee.reportError(new Error(LEE_INCORRECT_AUTHENTICATION));
      return;
    }
    const inviteMembersResult = await inviteMembers({
      teamId,
      groupId,
      revision,
      users,
    });
    if (inviteMembersResult.error) {
      if (
        inviteMembersResult.error.message === "no_free_slot" ||
        inviteMembersResult.error.message === "not_enough_free_slots"
      ) {
        alert.showAlert(
          translate(I18N_KEYS.ADD_MEMBER_NOT_ENOUGH_SLOTS_ERROR, {
            count: users.length,
            groupName,
          }),
          AlertSeverity.ERROR
        );
        return;
      } else {
        alert.showAlert(
          translate(I18N_KEYS.INVITE_GENERIC_ERROR),
          AlertSeverity.ERROR
        );
        return;
      }
    }
    if (Object.keys(inviteMembersResult.refusedMembers).length) {
      setInvitePartialSuccessState({
        invitedMembers: {},
        refusedMembers: inviteMembersResult.refusedMembers,
        show: true,
      });
    }
    if (newGroupButtonWithPopupRef.current) {
      newGroupButtonWithPopupRef.current.hidePopup();
    }
    setAddMemberEmails([]);
    setError(null);
  };
  return (
    <div>
      <ButtonWithPopup
        ref={newGroupButtonWithPopupRef}
        buttonLabel={translate(I18N_KEYS.ADD_MEMBERS_BUTTON)}
        confirmButtonLabel={translate(I18N_KEYS.ADD_MEMBERS_CONFIRM_BUTTON)}
        cancelButtonLabel={translate(I18N_KEYS.ADD_MEMBERS_CANCEL_BUTTON)}
        confirmButtonDisabled={!isInputValid()}
        onCancelButtonClick={handleAddMemberCancelled}
        onConfirmButtonClick={handleAddMemberConfirmed}
        popupClassName={styles.addMemberPopup}
      >
        <span className={styles.addMemberLabel}>
          {translate(I18N_KEYS.ADD_MEMBER_HEADER)}
        </span>
        {error && <div className={styles.error}>{error}</div>}

        <Multiselect
          autoFocus={true}
          className={styles.addMemberMultiselect}
          dataSource={getAutocompleteData()}
          getCurrentSelectionAvatar={getCurrentSelectionAvatar}
          defaultValue={addMemberEmails}
          isItemValid={(item: string) => isValidEmail(item)}
          onChange={handleAddMemberEmailsChanged}
          onError={(err: MultiselectError) =>
            setError(
              err ? translate(`team_groups_edit_error_${err.message}`) : null
            )
          }
          placeholder={translate(I18N_KEYS.ADD_MEMBER_INPUT_PLACEHOLDER)}
        />
      </ButtonWithPopup>

      <InviteResultDialog
        teamId={getCurrentTeamId(lee.globalState)}
        isOpen={invitePartialSuccessState.show}
        onClose={handleInvitationResultClosed}
        invitedMembers={invitePartialSuccessState.invitedMembers}
        refusedMembers={invitePartialSuccessState.refusedMembers}
      />
    </div>
  );
};
