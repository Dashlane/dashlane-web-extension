import * as React from 'react';
import { Icon, jsx, Tooltip } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { OutsideClickHandler } from 'libs/outside-click-handler/outside-click-handler';
import { MemberAction, MemberData } from 'team/members/types';
import styles from './styles.css';
const I18N_KEYS = {
    REACTIVATE_SINGLE_LABEL: 'team_members_reactivate_single_label',
    RESEND_INVITE_LABEL: 'team_members_resend_invite_label',
    PROMOTE_CAPTAIN: 'team_members_promote_captain_label',
    DEMOTE_CAPTAIN: 'team_members_captain_demote_label',
    REASSIGN_ROLE: 'team_members_change_role_label',
    REVOKE_SINGLE: 'team_members_revoke_single_label',
    RECOVERY_CODE: 'team_members_generate_recovery_codes_label',
    REMOVE_BILLING_CONTACT_TOOLTIP: 'team_members_assignment_dialog_remove_billing_contact_tooltip',
};
interface QuickActionMenuProps extends React.Props<HTMLElement> {
    member: MemberData;
    onDismiss: () => void;
    onMemberActionSelect: (actionName: MemberAction, member: MemberData) => void;
}
interface ClickOutside extends React.FunctionComponent<QuickActionMenuProps> {
    handleClickOutside?: () => void;
}
const QuickActionMenu: ClickOutside = ({ member, onDismiss, onMemberActionSelect, }: QuickActionMenuProps) => {
    const { translate } = useTranslate();
    const memberHas2faEnabled = member.twoFAInformation
        ? member.twoFAInformation.type === 'totp_device_registration' ||
            member.twoFAInformation.type === 'totp_login'
        : false;
    const getActionItems = (): JSX.Element[] | JSX.Element => {
        if (member.status === 'removed') {
            return (<li key="reactivate" id="reactivate-quick-action" onClick={() => onMemberActionSelect('reactivate', member)}>
          <Icon name="ItemEmailOutlined" color="ds.text.neutral.quiet" sx={{
                    marginRight: '16px',
                }}/>
          {translate(I18N_KEYS.REACTIVATE_SINGLE_LABEL)}
        </li>);
        }
        const actionItems = [];
        if (member.status === 'pending' || member.status === 'proposed') {
            actionItems.push(<li key="resendInvite" id="reinvite-quick-action" onClick={() => onMemberActionSelect('reinvite', member)}>
          <Icon name="ItemEmailOutlined" color="ds.text.neutral.quiet" sx={{
                    marginRight: '16px',
                }}/>
          {translate(I18N_KEYS.RESEND_INVITE_LABEL)}
        </li>);
        }
        if (member.status !== 'pending' && member.status !== 'proposed') {
            actionItems.push(<li key="reassign" id="reassign-quick-action" onClick={() => onMemberActionSelect('reassign', member)}>
          <Icon name="ItemPersonalInfoOutlined" color="ds.text.neutral.quiet" sx={{
                    marginRight: '16px',
                }}/>
          {translate(I18N_KEYS.REASSIGN_ROLE)}
        </li>);
        }
        actionItems.push(<Tooltip key="revoke" content={translate(I18N_KEYS.REMOVE_BILLING_CONTACT_TOOLTIP)} location="top" passThrough={!member.isBillingAdmin} sx={{ whiteSpace: 'normal' }}>
        <li key="revoke" id="revoke-quick-action" onClick={!member.isBillingAdmin
                ? () => onMemberActionSelect('revoke', member)
                : undefined} sx={member.isBillingAdmin
                ? { cursor: 'not-allowed !important', opacity: '0.5' }
                : undefined}>
          <Icon name="ActionDeleteOutlined" color="ds.text.neutral.quiet" sx={{
                marginRight: '16px',
            }}/>
          {translate(I18N_KEYS.REVOKE_SINGLE)}
        </li>
      </Tooltip>);
        if (memberHas2faEnabled &&
            member.status !== 'pending' &&
            member.status !== 'proposed') {
            actionItems.push(<li key="generate2FABackupCodes" id="generate-2fa-recovery-code-quick-action" onClick={() => onMemberActionSelect('generateBackupCode', member)}>
          <Icon name="RecoveryKeyOutlined" color="ds.text.neutral.quiet" sx={{
                    marginRight: '16px',
                }}/>
          {translate(I18N_KEYS.RECOVERY_CODE)}
        </li>);
        }
        return actionItems;
    };
    return (<OutsideClickHandler onOutsideClick={onDismiss}>
      <ul className={styles.menu}>{getActionItems()}</ul>
    </OutsideClickHandler>);
};
export default QuickActionMenu;
