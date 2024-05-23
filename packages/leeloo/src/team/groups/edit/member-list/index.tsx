import React, { useState } from 'react';
import { Maybe } from 'tsmonad';
import classnames from 'classnames';
import { compose, map, slice } from 'ramda';
import { RevokeUserGroupMembersRequest } from '@dashlane/communication';
import { UserDownload, UserGroupDownload, } from '@dashlane/sharing/types/serverResponse';
import { DialogFooter } from '@dashlane/ui-components';
import { Lee } from 'lee';
import { GlobalDispatcher } from 'libs/carbon/triggers';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
import Pagination from 'libs/dashlane-style/pagination/modern';
import { Alert } from 'team/alerts/types';
import { TableHeader } from 'team/page/table-header';
import { MemberRow } from './member-row/member-row';
import sortMemberList from './sort-member-list';
import styles from './styles.css';
const ROWS_PER_PAGE = 24;
const I18N_KEYS = {
    REVOKE_MEMBER_FROM_GROUP_ERROR_TITLE: 'team_groups_edit_revoke_member_from_group_error_title',
    REVOKE_MEMBER_FROM_GROUP_ERROR_MESSAGE: 'team_groups_edit_revoke_member_from_group_error_message',
    MEMBER_LIST_HEADER_EMAIL: 'team_groups_edit_member_list_header_email',
    MEMBER_LIST_HEADER_GROUP_RIGHTS: 'team_groups_edit_member_list_header_group_rights',
    MEMBER_LIST_ACTION_REMOVE_DIALOG_CTA: 'team_groups_edit_member_list_action_remove_dialog_cta',
    MEMBER_LIST_ACTION_REMOVE_DIALOG_CANCEL: 'team_groups_edit_member_list_action_remove_dialog_cancel',
    MEMBER_LIST_ACTION_REMOVE_DIALOG_HEADER: 'team_groups_edit_member_list_action_remove_dialog_header',
    MEMBER_LIST_ACTION_REMOVE_DIALOG_TITLE: 'team_groups_edit_member_list_action_remove_dialog_title',
    MEMBER_LIST_ACTION_REMOVE_DIALOG_SUBTITLE: 'team_groups_edit_member_list_action_remove_dialog_subtitle',
};
interface Props {
    lee: Lee;
    className?: string;
    userGroup: UserGroupDownload;
    revokeMembers: (dispatchGlobal: GlobalDispatcher, params: RevokeUserGroupMembersRequest, alert: Alert) => void;
}
interface RemoveDialogState {
    showRemoveUserDialog: boolean;
    removeMemberCandidate: Maybe<UserDownload>;
}
const emptyUserSharingItemGroup = Maybe.nothing<UserDownload>();
const MemberList = ({ lee, className, userGroup, revokeMembers }: Props) => {
    const { translate } = useTranslate();
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [removeDialogState, setRemoveDialogState] = useState<RemoveDialogState>({
        showRemoveUserDialog: false,
        removeMemberCandidate: Maybe.nothing(),
    });
    const onChangePage = (newCurrentPageIndex: number) => {
        setCurrentPageIndex(newCurrentPageIndex);
    };
    const handleRemoveMember = (m: UserDownload) => {
        setRemoveDialogState({
            showRemoveUserDialog: true,
            removeMemberCandidate: Maybe.just(m),
        });
    };
    const handleRemoveMemberConfirmed = () => {
        Maybe.sequence<UserDownload | UserGroupDownload>({
            removeMemberCandidate: removeDialogState.removeMemberCandidate,
            userGroup: Maybe.just(userGroup),
        }).caseOf({
            just: ({ removeMemberCandidate, userGroup, }: {
                removeMemberCandidate: UserDownload;
                userGroup: UserGroupDownload;
            }) => {
                revokeMembers(lee.dispatchGlobal, {
                    groupId: userGroup.groupId,
                    revision: userGroup.revision,
                    users: [removeMemberCandidate.userId],
                }, {
                    title: translate(I18N_KEYS.REVOKE_MEMBER_FROM_GROUP_ERROR_TITLE),
                    message: translate(I18N_KEYS.REVOKE_MEMBER_FROM_GROUP_ERROR_MESSAGE),
                });
            },
            nothing: () => {
            },
        });
        setRemoveDialogState({
            showRemoveUserDialog: false,
            removeMemberCandidate: emptyUserSharingItemGroup,
        });
    };
    const getActiveMembers = (): UserDownload[] => (userGroup.users || []).filter((m) => m.status === 'accepted' || m.status === 'pending');
    const handleRemoveMemberCancelled = () => {
        setRemoveDialogState({
            showRemoveUserDialog: false,
            removeMemberCandidate: emptyUserSharingItemGroup,
        });
    };
    const mapMemberToRow = (m: UserDownload) => (<MemberRow key={m.alias} member={m} handleRemoveMember={handleRemoveMember}/>);
    const mapMembersToRows = map<UserDownload, JSX.Element>(mapMemberToRow);
    const getMembersList = () => {
        const startIndex = currentPageIndex * ROWS_PER_PAGE;
        return compose(mapMembersToRows, slice(startIndex, startIndex + ROWS_PER_PAGE), sortMemberList)(getActiveMembers());
    };
    const columns = [
        {
            headerLabel: translate(I18N_KEYS.MEMBER_LIST_HEADER_EMAIL),
            headerKey: 'email',
        },
        {
            headerLabel: translate(I18N_KEYS.MEMBER_LIST_HEADER_GROUP_RIGHTS),
            colSpan: 2,
            headerKey: 'group-rights',
        },
    ];
    return (<div>
      <table className={classnames(className, styles.table)}>
        <TableHeader columns={columns}/>
        <tbody>{getMembersList()}</tbody>
      </table>
      <div className={styles.pagination}>
        <Pagination currentPageIndex={currentPageIndex} itemsLength={getActiveMembers().length} itemsPerPage={ROWS_PER_PAGE} onChange={onChangePage}/>
      </div>
      <SimpleDialog isOpen={removeDialogState.showRemoveUserDialog} onRequestClose={handleRemoveMemberCancelled} footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.MEMBER_LIST_ACTION_REMOVE_DIALOG_CTA)} primaryButtonOnClick={handleRemoveMemberConfirmed} secondaryButtonTitle={translate(I18N_KEYS.MEMBER_LIST_ACTION_REMOVE_DIALOG_CANCEL)} secondaryButtonOnClick={handleRemoveMemberCancelled}/>} title={translate(I18N_KEYS.MEMBER_LIST_ACTION_REMOVE_DIALOG_HEADER)}>
        <div>
          <div className={styles.removeDialogTitle}>
            {translate(I18N_KEYS.MEMBER_LIST_ACTION_REMOVE_DIALOG_TITLE, {
            email: removeDialogState.removeMemberCandidate.caseOf({
                just: (m) => m.userId,
                nothing: () => '',
            }),
        })}
          </div>
          <div>
            {translate(I18N_KEYS.MEMBER_LIST_ACTION_REMOVE_DIALOG_SUBTITLE)}
          </div>
        </div>
      </SimpleDialog>
    </div>);
};
export default MemberList;
