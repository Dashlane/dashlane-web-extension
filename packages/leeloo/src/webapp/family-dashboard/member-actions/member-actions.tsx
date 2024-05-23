import * as React from 'react';
import { Button, CloseIcon, colors } from '@dashlane/ui-components';
import { FamilyMemberRole } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    REMOVE_MEMBER_BUTTON_ALT: 'webapp_family_dashboard_button_remove_member_alt',
};
export interface MemberActionsProps {
    role: FamilyMemberRole;
    onRemoveAction: () => void;
}
export const MemberActions = ({ role, onRemoveAction }: MemberActionsProps) => {
    const { translate } = useTranslate();
    if (role === FamilyMemberRole.ADMIN) {
        return null;
    }
    return (<div className={styles.memberColumn}>
      <Button type="button" nature="ghost" className={styles.removeMemberButton} title={translate(I18N_KEYS.REMOVE_MEMBER_BUTTON_ALT)} onClick={onRemoveAction}>
        <CloseIcon size={20} color={colors.dashGreen03} hoverColor={colors.dashGreen00}/>
      </Button>
    </div>);
};
export default MemberActions;
