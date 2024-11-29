import * as React from "react";
import { AccountManagementFeatureFlips } from "@dashlane/account-contracts";
import { Icon, Tooltip } from "@dashlane/design-system";
import { useFeatureFlip } from "@dashlane/framework-react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { OutsideClickHandler } from "../../../../libs/outside-click-handler/outside-click-handler";
import { MemberAction, MemberData } from "../../types";
import styles from "./styles.css";
export const I18N_KEYS = {
  REACTIVATE_SINGLE_LABEL: "team_members_reactivate_single_label",
  RESEND_INVITE_LABEL: "team_members_resend_invite_label",
  PROMOTE_CAPTAIN: "team_members_promote_captain_label",
  DEMOTE_CAPTAIN: "team_members_captain_demote_label",
  REASSIGN_ROLE: "team_members_change_role_label",
  REVOKE_SINGLE: "team_members_revoke_single_label",
  CHANGE_EMAIL: "team_members_change_login_email",
  CANCEL_CHANGE_EMAIL: "team_members_cancel_change_email",
  RECOVERY_CODE: "team_members_generate_recovery_codes_label",
  REMOVE_BILLING_CONTACT_TOOLTIP:
    "team_members_assignment_dialog_remove_billing_contact_tooltip",
};
interface QuickActionMenuProps extends React.Props<HTMLElement> {
  member: MemberData;
  onDismiss: () => void;
  onMemberActionSelect: (actionName: MemberAction, member: MemberData) => void;
}
interface ClickOutside extends React.FunctionComponent<QuickActionMenuProps> {
  handleClickOutside?: () => void;
}
export const QuickActionMenu: ClickOutside = ({
  member,
  onDismiss,
  onMemberActionSelect,
}: QuickActionMenuProps) => {
  const { translate } = useTranslate();
  const isActiveMember =
    member.status !== "pending" && member.status !== "proposed";
  const memberHas2faEnabled = member.twoFAInformation
    ? member.twoFAInformation.type === "totp_device_registration" ||
      member.twoFAInformation.type === "totp_login"
    : false;
  const hasChangeLoginEmailFeatureFlip = useFeatureFlip(
    AccountManagementFeatureFlips.ChangeLoginEmailWebDev
  );
  const hasCancellableChangeLoginRequest =
    member.changeLoginEmailPending &&
    ["pending_activation", null, undefined].includes(member.ssoStatus);
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    action: MemberAction
  ) => {
    event.preventDefault();
    if (event.key === "Enter") {
      onMemberActionSelect(action, member);
    }
  };
  const getActionItems = (): JSX.Element[] | JSX.Element => {
    if (member.status === "removed") {
      return (
        <li
          key="reactivate"
          id="reactivate-quick-action"
          onClick={() => onMemberActionSelect("reactivate", member)}
          onKeyDown={(event) => handleKeyDown(event, "reactivate")}
          role="menuitem"
        >
          <Icon
            name="ItemEmailOutlined"
            color="ds.text.neutral.quiet"
            sx={{
              marginRight: "16px",
            }}
          />
          {translate(I18N_KEYS.REACTIVATE_SINGLE_LABEL)}
        </li>
      );
    }
    const actionItems = [];
    if (member.status === "pending" || member.status === "proposed") {
      actionItems.push(
        <li
          key="resendInvite"
          id="reinvite-quick-action"
          onClick={() => onMemberActionSelect("reinvite", member)}
          onKeyDown={(event) => handleKeyDown(event, "reinvite")}
          role="menuitem"
        >
          <Icon
            name="ItemEmailOutlined"
            color="ds.text.neutral.quiet"
            sx={{
              marginRight: "16px",
            }}
          />
          {translate(I18N_KEYS.RESEND_INVITE_LABEL)}
        </li>
      );
    }
    if (isActiveMember) {
      actionItems.push(
        <li
          key="reassign"
          id="reassign-quick-action"
          onClick={() => onMemberActionSelect("reassign", member)}
          onKeyDown={(event) => handleKeyDown(event, "reassign")}
          role="menuitem"
        >
          <Icon
            name="ItemPersonalInfoOutlined"
            color="ds.text.neutral.quiet"
            sx={{
              marginRight: "16px",
            }}
          />
          {translate(I18N_KEYS.REASSIGN_ROLE)}
        </li>
      );
    }
    if (hasChangeLoginEmailFeatureFlip) {
      if (isActiveMember && !hasCancellableChangeLoginRequest) {
        actionItems.push(
          <li
            key="change-login-email"
            id="change-login-email"
            onClick={() => onMemberActionSelect("changeLoginEmail", member)}
            onKeyDown={(event) => handleKeyDown(event, "changeLoginEmail")}
            role="menuitem"
          >
            <Icon
              name="ItemLoginOutlined"
              color="ds.text.neutral.quiet"
              sx={{
                marginRight: "16px",
              }}
            />
            {translate(I18N_KEYS.CHANGE_EMAIL)}
          </li>
        );
      }
      if (isActiveMember && hasCancellableChangeLoginRequest) {
        actionItems.push(
          <li
            key="pending-change-email"
            id="pending-change-email"
            onClick={() =>
              onMemberActionSelect("cancelChangeLoginEmail", member)
            }
            onKeyDown={(event) =>
              handleKeyDown(event, "cancelChangeLoginEmail")
            }
            role="menuitem"
          >
            <Icon
              name="ItemLoginOutlined"
              color="ds.text.neutral.quiet"
              sx={{
                marginRight: "16px",
              }}
            />
            {translate(I18N_KEYS.CANCEL_CHANGE_EMAIL)}
          </li>
        );
      }
    }
    actionItems.push(
      <Tooltip
        key="revoke"
        content={translate(I18N_KEYS.REMOVE_BILLING_CONTACT_TOOLTIP)}
        location="top"
        passThrough={!member.isBillingAdmin}
        sx={{ whiteSpace: "normal" }}
      >
        <li
          key="revoke"
          id="revoke-quick-action"
          onClick={
            !member.isBillingAdmin
              ? () => onMemberActionSelect("revoke", member)
              : undefined
          }
          onKeyDown={(event) =>
            !member.isBillingAdmin && handleKeyDown(event, "revoke")
          }
          role="menuitem"
          sx={
            member.isBillingAdmin
              ? { cursor: "not-allowed !important", opacity: "0.5" }
              : undefined
          }
        >
          <Icon
            name="ActionDeleteOutlined"
            color="ds.text.neutral.quiet"
            sx={{
              marginRight: "16px",
            }}
          />
          {translate(I18N_KEYS.REVOKE_SINGLE)}
        </li>
      </Tooltip>
    );
    if (memberHas2faEnabled && isActiveMember) {
      actionItems.push(
        <li
          key="generate2FABackupCodes"
          id="generate-2fa-recovery-code-quick-action"
          onClick={() => onMemberActionSelect("generateBackupCode", member)}
          onKeyDown={(event) => handleKeyDown(event, "generateBackupCode")}
          role="menuitem"
        >
          <Icon
            name="RecoveryKeyOutlined"
            color="ds.text.neutral.quiet"
            sx={{
              marginRight: "16px",
            }}
          />
          {translate(I18N_KEYS.RECOVERY_CODE)}
        </li>
      );
    }
    return actionItems;
  };
  return (
    <OutsideClickHandler onOutsideClick={onDismiss}>
      <ul className={styles.menu}>{getActionItems()}</ul>
    </OutsideClickHandler>
  );
};
export default QuickActionMenu;
