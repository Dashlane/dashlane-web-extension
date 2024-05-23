import { useState } from 'react';
import { Maybe } from 'tsmonad';
import { fromUnixTime } from 'date-fns';
import { FlexContainer } from '@dashlane/ui-components';
import { Button, Checkbox, Icon, jsx, mergeSx, Paragraph, ThemeUIStyleObject, Tooltip, } from '@dashlane/design-system';
import { useLocation } from 'libs/router';
import { Avatar } from 'libs/dashlane-style/avatar/avatar';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
import LocalizedTimeAgo from 'libs/i18n/localizedTimeAgo';
import useTranslate from 'libs/i18n/useTranslate';
import { DISPLAY_HEALTH_SCORE_MIN_PASSWORDS } from 'team/constants';
import { MemberAction, MemberData } from 'team/members/types';
import QuickActionMenu from 'team/members/list/quick-action-menu';
import SecurityScoreBadge from 'team/members/security-score-badge';
import { roundToFirstDecimalOrInt } from 'team/utils';
import { AssignAdminTip } from './assign-admin-tip';
import { showAssignAdminTipState } from 'team/get-started/tasks/assign-admin-task';
import styles from './styles.css';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    LOGIN_TEXT: {
        variant: 'text.ds.body.reduced.regular',
        wordBreak: 'break-word',
        color: 'ds.text.neutral.catchy',
        marginLeft: '16px',
        maxWidth: '280px',
        minWidth: '140px',
    },
    ROW: {
        boxShadow: 'inset 0 -1px 0 0 ds.border.neutral.quiet.idle',
        height: '60px',
        variant: 'text.ds.body.reduced.regular',
        td: {
            padding: '16px',
            verticalAlign: 'middle',
        },
    },
    ACTIVE: {
        color: 'ds.text.neutral.standard',
    },
    REVOKED: {
        color: 'ds.text.neutral.quiet',
    },
};
const I18N_KEYS = {
    SECURITY_SCORE_BREAKDOWN_LT_FIVE: 'team_members_row_security_score_breakdown_less_than_five',
    SECURITY_SCORE_BREAKDOWN_UNAVAILABLE: 'team_members_row_security_score_unavailable',
    INVITATION_PENDING: 'team_members_row_invitation_pending',
    NEVER_LOGGED_IN: 'team_members_row_never_logged_in',
    ROW_REVOKED: 'team_members_row_revoked',
    ROW_CAPTAIN: 'team_members_row_captain',
    ROW_GROUP_MANAGER: 'team_members_row_group_manager',
    ROW_MEMBER: 'team_members_row_member',
    BILLING_ADMIN: 'team_account_heading_billing_admin',
    BILLING_ADMIN_TOOLTIP: 'team_account_heading_billing_admin_tooltip',
};
const LABEL_UNDER_FIVE = '<5';
const LABEL_EMPTY_VALUE = '-';
export interface Props {
    checkedMembers: Set<MemberData>;
    currentLoggedLogin: string;
    members: MemberData[];
    onMemberActionSelect: (actionName: MemberAction, member: MemberData) => void;
    onMemberToggleCheck: (member: MemberData) => void;
}
export const Rows = ({ checkedMembers, currentLoggedLogin, members, onMemberActionSelect, onMemberToggleCheck, }: Props) => {
    const { translate } = useTranslate();
    const location = useLocation();
    const shouldShowAssignAdminTooltip = location.state?.[showAssignAdminTipState] ?? false;
    const [quickActionMenuOpenFor, setQuickActionMenuOpenFor] = useState<string | null>(null);
    const [tooltipDismissed, setTooltipDismissed] = useState(false);
    const toggleActionMenuFor = (memberLogin: string | null): void => {
        setQuickActionMenuOpenFor(memberLogin === quickActionMenuOpenFor ? null : memberLogin);
    };
    const handleMemberActionSelect = (memberAction: MemberAction, member: MemberData) => {
        toggleActionMenuFor(quickActionMenuOpenFor);
        onMemberActionSelect(memberAction, member);
    };
    const UnavailableOrLessThanFive = () => (<FlexContainer gap="4px">
      <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.SECURITY_SCORE_BREAKDOWN_UNAVAILABLE)}
      </Paragraph>
      <Tooltip wrapTrigger location="bottom" content={translate(I18N_KEYS.SECURITY_SCORE_BREAKDOWN_LT_FIVE)}>
        <div sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
          <Icon name="FeedbackInfoOutlined" color="ds.text.neutral.quiet" size="xsmall"/>
        </div>
      </Tooltip>
    </FlexContainer>);
    const getSecurityScore = (member: MemberData): JSX.Element => {
        const securityIndex = Maybe.maybe(member.nbrPasswords >= DISPLAY_HEALTH_SCORE_MIN_PASSWORDS ||
            (!member.nbrPasswords &&
                member.securityIndex &&
                member.securityIndex > 0)
            ? member.securityIndex
            : null);
        return securityIndex.caseOf({
            just: (value) => value === 0 ? (<UnavailableOrLessThanFive />) : (<SecurityScoreBadge score={securityIndex} size="small">
            <div className={styles.securityScoreCellText}>
              {`${roundToFirstDecimalOrInt(value)}%`}
            </div>
          </SecurityScoreBadge>),
            nothing: () => <UnavailableOrLessThanFive />,
        });
    };
    const getLastLogin = (member: MemberData): string | JSX.Element => {
        switch (true) {
            case ['pending', 'proposed'].includes(member.status):
                return translate(I18N_KEYS.INVITATION_PENDING);
            case Boolean(member.lastUpdateDateUnix || member.revokedDateUnix):
                return (<LocalizedTimeAgo date={fromUnixTime(member.lastUpdateDateUnix || member.revokedDateUnix)}/>);
            case member.status === 'pending':
                return translate(I18N_KEYS.INVITATION_PENDING);
            default:
                return translate(I18N_KEYS.NEVER_LOGGED_IN);
        }
    };
    const getRightsLabel = (member: MemberData): string | JSX.Element => {
        if (member.status === 'removed') {
            return translate(I18N_KEYS.ROW_REVOKED);
        }
        if (member.isTeamCaptain) {
            return translate(I18N_KEYS.ROW_CAPTAIN);
        }
        if (member.isGroupManager) {
            return translate(I18N_KEYS.ROW_GROUP_MANAGER);
        }
        return translate(I18N_KEYS.ROW_MEMBER);
    };
    const getQuickActionMenu = (member: MemberData): JSX.Element => {
        return (<QuickActionMenu member={member} onDismiss={() => toggleActionMenuFor(member.login)} onMemberActionSelect={handleMemberActionSelect}/>);
    };
    const getRows = (): JSX.Element[] => {
        const getPasswordLabel = (status: string, value?: number) => value ?? (status !== 'accepted' ? '-' : 0);
        const getPasswordLabelForLoginCell = (status: string, value?: number) => {
            if (status !== 'accepted') {
                return LABEL_EMPTY_VALUE;
            }
            if (!value || value < 5) {
                return LABEL_UNDER_FIVE;
            }
            return value;
        };
        return members.map((member: MemberData, index) => (<tr id={member.status === 'removed' ? 'revoked' : 'active'} key={member.login} sx={mergeSx([
                SX_STYLES.ROW,
                member.status === 'removed' ? SX_STYLES.REVOKED : SX_STYLES.ACTIVE,
            ])}>
        <td>
          {member.login !== currentLoggedLogin &&
                member.status !== 'removed' && (<Checkbox checked={!!Array.from(checkedMembers).find((checkedMember) => checkedMember.login === member.login)} aria-label="Select user" onChange={() => onMemberToggleCheck(member)}/>)}
        </td>
        <td className={styles.loginCell}>
          <Avatar email={member.login} size={30}/>
          
          <div sx={SX_STYLES.LOGIN_TEXT} className={'automation-tests-member-login'}>
            <IntelligentTooltipOnOverflow tooltipText={member.login}>
              {member.login}
            </IntelligentTooltipOnOverflow>
          </div>
        </td>
        <td className={styles.securityScoreCell}>{getSecurityScore(member)}</td>
        <td className={styles.passwordsCell}>
          <span className={styles.passwordsCellIcon}/>
          {getPasswordLabelForLoginCell(member.status, member.nbrPasswords)}
        </td>
        <td>{getPasswordLabel(member.status, member.safePasswords)}</td>
        <td>{getPasswordLabel(member.status, member.weakPasswords)}</td>
        <td>{getPasswordLabel(member.status, member.reused)}</td>
        <td>{getPasswordLabel(member.status, member.compromisedPasswords)}</td>
        <td>{getLastLogin(member)}</td>
        <td>
          {member.isBillingAdmin ? (<Tooltip location="top" content={translate(I18N_KEYS.BILLING_ADMIN_TOOLTIP)} sx={{ textAlign: 'start' }}>
              <div sx={{ display: 'flex', alignItems: 'center' }}>
                <Paragraph textStyle="ds.body.standard.strong" sx={{ display: 'inline-block' }}>
                  {translate(I18N_KEYS.BILLING_ADMIN)}
                </Paragraph>
                <Icon color="ds.text.neutral.standard" name="FeedbackInfoOutlined" sx={{ display: 'inline-block', marginLeft: '4px' }} size="small"/>
              </div>
            </Tooltip>) : null}
          {getRightsLabel(member)}
        </td>
        <td className={styles.actionsCell} style={{ position: 'relative' }}>
          {member.login === quickActionMenuOpenFor
                ? getQuickActionMenu(member)
                : null}
          {member.login !== currentLoggedLogin ? (index === 1 && shouldShowAssignAdminTooltip ? (<AssignAdminTip tooltipDismissed={tooltipDismissed} setTooltipDismissed={setTooltipDismissed}>
                <Button id="users-action-menu-button" onClick={() => toggleActionMenuFor(member.login)} layout="iconOnly" intensity="supershy" icon={<Icon name="SettingsOutlined" color="ds.text.neutral.standard"/>}/>
              </AssignAdminTip>) : (<Button id="users-action-menu-button" onClick={() => toggleActionMenuFor(member.login)} layout="iconOnly" intensity="supershy" icon={<Icon name="SettingsOutlined" color="ds.text.neutral.standard"/>}/>)) : null}
        </td>
      </tr>));
    };
    return <tbody className={styles.tableBody}>{getRows()}</tbody>;
};
