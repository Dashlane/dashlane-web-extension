import React, { Dispatch, SetStateAction } from 'react';
import { Icon } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { DropdownOption } from './dropdown-option';
interface Props {
    disabled?: boolean;
    setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
}
export const DropdownDeleteAction = ({ disabled, setIsDeleteDialogOpen, }: Props) => {
    const { translate } = useTranslate();
    return (<DropdownOption disabled={disabled} icon={<Icon name="ActionDeleteOutlined"/>} dropdownOptionTitle={translate('collections_delete_button_text')} setIsDialogOpen={setIsDeleteDialogOpen}/>);
};
