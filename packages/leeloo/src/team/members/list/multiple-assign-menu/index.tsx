import * as React from 'react';
import classnames from 'classnames';
import Dropdown from 'libs/dashlane-style/buttons/modern/dropdown';
import useTranslate from 'libs/i18n/useTranslate';
import { OutsideClickHandler } from 'libs/outside-click-handler/outside-click-handler';
import { Role } from 'team/members/member-actions/role-assignment/role-assignment-dialog';
import arrowDown from './arrow-down.svg';
import styles from './styles.css';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
const I18N_KEYS = {
    BULK_ACTIONS_MENU_LABEL: 'team_members_bulk_actions_menu_label',
    BULK_ACTIONS_MENU_ADMIN: 'team_members_bulk_actions_menu_admin',
    BULK_ACTIONS_MENU_MEMBER: 'team_members_bulk_actions_menu_member',
    BULK_ACTIONS_MENU_GROUP_MANAGER: 'team_members_bulk_actions_menu_group_manager',
};
interface MultipleAssignMenuProps extends React.Props<HTMLElement> {
    onMultipleReassignActionSelect: (selectedRole: Role) => void;
}
interface ClickOutside extends React.FunctionComponent<MultipleAssignMenuProps> {
    handleClickOutside?: () => void;
}
export const MultipleAssignMenu: ClickOutside = ({ onMultipleReassignActionSelect, }: MultipleAssignMenuProps) => {
    const { translate } = useTranslate();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const [isOpen, setIsOpen] = React.useState(false);
    const handleClickOnOption = (selectedRole: Role) => {
        if (shouldShowTrialDiscontinuedDialog &&
            selectedRole !== Role.TeamCaptain) {
            openTrialDiscontinuedDialog();
        }
        else {
            onMultipleReassignActionSelect(selectedRole);
        }
        setIsOpen(false);
    };
    const handleClickOutside = () => {
        setIsOpen(false);
    };
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    return (<OutsideClickHandler onOutsideClick={handleClickOutside}>
      <div className={styles.container}>
        <Dropdown label={translate(I18N_KEYS.BULK_ACTIONS_MENU_LABEL)} onClick={toggleDropdown} classNames={[styles.dropdownButton]} icon={<img className={classnames(styles.buttonIcon, {
                [styles.flip]: isOpen,
            })} src={arrowDown}/>} iconClassName={[styles.iconContainer]} iconPosition="right"/>
        {isOpen ? (<ul className={styles.menu}>
            <li key="admin" onClick={() => handleClickOnOption(Role.TeamCaptain)}>
              {translate(I18N_KEYS.BULK_ACTIONS_MENU_ADMIN)}
            </li>
            <li key="groupManager" onClick={() => handleClickOnOption(Role.GroupManager)}>
              {translate(I18N_KEYS.BULK_ACTIONS_MENU_GROUP_MANAGER)}
            </li>
            <li key="member" onClick={() => handleClickOnOption(Role.Member)}>
              {translate(I18N_KEYS.BULK_ACTIONS_MENU_MEMBER)}
            </li>
          </ul>) : null}
      </div>
    </OutsideClickHandler>);
};
