import React, { ReactNode } from 'react';
import { DropdownElement } from '@dashlane/ui-components';
interface Props {
    disabled?: boolean;
    dropdownOptionTitle: string;
    icon: ReactNode;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    badge?: ReactNode;
}
export const DropdownOption = ({ disabled, dropdownOptionTitle, icon, setIsDialogOpen, badge, }: Props) => {
    return (<DropdownElement fullWidth={true} onClick={(event) => {
            event.stopPropagation();
            setIsDialogOpen(true);
        }} css={{ '&:focus-within': { backgroundColor: '#cfe0e4' } }} disabled={disabled}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {icon}
        <span>{dropdownOptionTitle}</span>
        {badge}
      </div>
    </DropdownElement>);
};
