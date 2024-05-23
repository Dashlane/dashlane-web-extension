import { ChangeEvent, MouseEvent, MouseEventHandler, useState } from 'react';
import { Maybe } from 'tsmonad';
import { Paragraph, TextInput } from '@dashlane/ui-components';
import { UserGroupDownload } from '@dashlane/communication';
import { Button, Icon, jsx } from '@dashlane/design-system';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
import { ButtonWithPopup } from 'libs/dashlane-style/action-with-popup/button';
import { GroupHeader } from 'team/groups/header';
import { GROUP_NAME_ALREADY_IN_USE } from 'team/groups/edit/types';
import { NameInput } from './name-input';
import { AddMembers } from './add-members/add-members';
import styles from './styles.css';
const I18N_KEYS = {
    NAME_ALREADY_EXISTS: 'team_groups_edit_header_name_already_exists',
    DELETE_GROUP: 'team_groups_edit_header_delete_group',
    DELETE_GROUP_CANCEL_BUTTON: 'team_groups_edit_header_delete_group_cancel_button',
    DELETE_GROUP_CONFIRM_BUTTON: 'team_groups_edit_header_delete_group_confirm_button',
    DELETE_GROUP_CONFIRM_TITLE_MARKUP: 'team_groups_edit_header_delete_group_confirm_title_markup',
    DELETE_GROUP_CONFIRM_SUBTITLE: 'team_groups_edit_header_delete_group_confirm_subtitle',
    BACK: 'team_groups_edit_header_back',
};
interface Props {
    onBackLinkClick: MouseEventHandler<HTMLElement>;
    onDeleteClick: () => void;
    onRenameGroup: (newName: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    groupName: string;
    lee: Lee;
    userGroup: UserGroupDownload;
}
const emptyGroupName = Maybe.nothing<string>();
const Header = ({ onBackLinkClick, onDeleteClick, onRenameGroup, groupName, lee, userGroup, }: Props) => {
    const { translate } = useTranslate();
    const [confirmDeleteGroupName, setConfirmDeleteGroupName] = useState<Maybe<string>>(Maybe.nothing());
    const [savingGroupName, setSavingGroupName] = useState<boolean>(false);
    const handleDeleteGroupCancelled = () => {
        setConfirmDeleteGroupName(emptyGroupName);
    };
    const handleConfirmButtonClicked = () => {
        setConfirmDeleteGroupName(emptyGroupName);
        onDeleteClick();
    };
    const handleBackClick = (e: MouseEvent<HTMLElement>) => {
        onBackLinkClick(e);
    };
    const handleConfirmDeleteGroupNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = event.target['value'] && event.target['value'].trim();
        setConfirmDeleteGroupName(Maybe.maybe<string>(trimmedValue));
    };
    const isConfirmDeleteGroupNameValid = () => confirmDeleteGroupName.caseOf({
        just: (name) => name === groupName,
        nothing: () => false,
    });
    const handleGroupNameChanged = async (newName: string) => {
        setSavingGroupName(true);
        const { error } = await onRenameGroup(newName);
        setSavingGroupName(false);
        if (error === GROUP_NAME_ALREADY_IN_USE) {
            return {
                success: false,
                error: translate(I18N_KEYS.NAME_ALREADY_EXISTS),
            };
        }
        return { success: true };
    };
    return (<GroupHeader>
      <Button mood="brand" intensity="supershy" layout="iconLeading" icon={<Icon name="ArrowLeftOutlined"/>} onClick={handleBackClick}>
        {translate(I18N_KEYS.BACK)}
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <NameInput defaultValue={groupName} editable={true} saving={savingGroupName} onNameChanged={handleGroupNameChanged}/>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <span style={{ marginRight: '8px' }}>
            <AddMembers lee={lee} userGroup={userGroup}/>
          </span>
          <ButtonWithPopup buttonLabel={translate(I18N_KEYS.DELETE_GROUP)} cancelButtonLabel={translate(I18N_KEYS.DELETE_GROUP_CANCEL_BUTTON)} confirmButtonLabel={translate(I18N_KEYS.DELETE_GROUP_CONFIRM_BUTTON)} onCancelButtonClick={handleDeleteGroupCancelled} onConfirmButtonClick={handleConfirmButtonClicked} confirmButtonDisabled={!isConfirmDeleteGroupNameValid()} popupClassName={styles.confirmPopup} buttonMood="neutral" buttonIntensity="quiet" buttonIconName="ActionDeleteOutlined">
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 12,
        }}>
              <Paragraph size="large">
                {translate.markup(I18N_KEYS.DELETE_GROUP_CONFIRM_TITLE_MARKUP, {
            group: groupName,
        })}
              </Paragraph>
              <Paragraph color="neutrals.8">
                {translate(I18N_KEYS.DELETE_GROUP_CONFIRM_SUBTITLE)}
              </Paragraph>
              <TextInput fullWidth onChange={handleConfirmDeleteGroupNameChange} type="text" defaultValue={confirmDeleteGroupName.caseOf({
            just: (name) => name,
            nothing: () => undefined,
        })} autoFocus={true}/>
            </div>
          </ButtonWithPopup>
        </div>
      </div>
    </GroupHeader>);
};
export default Header;
