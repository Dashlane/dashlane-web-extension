import React from 'react';
import { Icon } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { DropdownOption } from './dropdown-option';
interface Props {
    disabled?: boolean;
    onClick: (isOpen: boolean) => void;
}
export const DropdownSharedAccessAction = ({ disabled, onClick }: Props) => {
    const { translate } = useTranslate();
    return (<DropdownOption disabled={disabled} icon={<Icon name="SharedOutlined"/>} dropdownOptionTitle={translate('webapp_sharing_collection_access_dialog_title')} setIsDialogOpen={onClick}/>);
};
