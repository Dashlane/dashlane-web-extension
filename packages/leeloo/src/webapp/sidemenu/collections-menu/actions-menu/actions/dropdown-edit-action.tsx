import React, { Dispatch, SetStateAction } from 'react';
import { Icon } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { DropdownOption } from './dropdown-option';
interface Props {
    disabled?: boolean;
    setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>;
}
export const DropdownEditAction = ({ disabled, setIsEditDialogOpen, }: Props) => {
    const { translate } = useTranslate();
    return (<DropdownOption disabled={disabled} icon={<Icon name="ActionEditOutlined"/>} dropdownOptionTitle={translate('_common_action_edit')} setIsDialogOpen={setIsEditDialogOpen}/>);
};
