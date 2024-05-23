import * as React from 'react';
import { UserDownload } from '@dashlane/sharing/types/serverResponse';
import { Avatar } from 'libs/dashlane-style/avatar/avatar';
import DeleteIcon from './delete-icon';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    MANAGER: 'team_groups_edit_member_list_rights_manager',
    MEMBER: 'team_groups_edit_member_list_rights_member',
    PENDING: 'team_groups_edit_member_list_rights_pending',
};
const getGroupRightsLabel = (permission: string, status: string) => {
    if (permission === 'admin' && status === 'accepted') {
        return I18N_KEYS.MANAGER;
    }
    if (permission === 'limited' && status === 'accepted') {
        return I18N_KEYS.MEMBER;
    }
    if (status === 'pending') {
        return I18N_KEYS.PENDING;
    }
    return '';
};
export interface Props {
    member: UserDownload;
    handleRemoveMember: (member: UserDownload) => void;
}
const MemberRowComponent = ({ member, handleRemoveMember }: Props) => {
    const { translate } = useTranslate();
    return (<tr>
      <td className={styles.emailCell}>
        <div className={styles.emailCellContainer}>
          <Avatar className={styles.avatar} email={member.alias} size={32}/>
          {member.alias}
        </div>
      </td>
      <td className={styles.rightsCell}>
        {translate(getGroupRightsLabel(member.permission, member.status))}
      </td>
      <td className={styles.plusCell}>
        
        <div style={{ cursor: 'pointer' }} onClick={() => handleRemoveMember(member)}>
          <DeleteIcon />
        </div>
      </td>
    </tr>);
};
export const MemberRow = React.memo(MemberRowComponent);
