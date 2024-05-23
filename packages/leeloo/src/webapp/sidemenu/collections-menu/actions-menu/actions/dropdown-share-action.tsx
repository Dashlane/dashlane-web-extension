import React, { ReactNode } from 'react';
import { Icon } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { DropdownOption } from './dropdown-option';
interface Props {
    disabled?: boolean;
    onClick: (isOpen: boolean) => void;
    badge: ReactNode;
}
export const DropdownShareAction = ({ disabled, onClick, badge }: Props) => {
    const { translate } = useTranslate();
    return (<DropdownOption icon={<Icon name="ActionShareOutlined"/>} dropdownOptionTitle={translate('_common_action_share')} setIsDialogOpen={onClick} disabled={disabled} badge={badge}/>);
};
