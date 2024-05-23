import React from 'react';
import { Button } from '@dashlane/design-system';
interface AddLinkedWebsiteButtonProps {
    disabled?: boolean;
    handleOnClickAddLinkedWebsiteButton: () => void;
    label: string;
}
export const AddLinkedWebsiteButton = ({ disabled = false, handleOnClickAddLinkedWebsiteButton, label, }: AddLinkedWebsiteButtonProps) => {
    return (<Button layout="iconTrailing" icon="ArrowRightOutlined" onClick={handleOnClickAddLinkedWebsiteButton} disabled={disabled} mood="brand" intensity="supershy">
      {label}
    </Button>);
};
