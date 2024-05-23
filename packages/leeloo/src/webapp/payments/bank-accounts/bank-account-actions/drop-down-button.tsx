import React from 'react';
import { Button, Icon, jsx } from '@dashlane/design-system';
import { BankAccountValue } from './types';
import useTranslate from 'libs/i18n/useTranslate';
interface DropDownButtonProps {
    isEnabled: boolean;
    onClick: (value: string) => void;
    translationKey: string;
    value: BankAccountValue;
}
export const DropDownButton = ({ isEnabled, onClick, translationKey, value, }: DropDownButtonProps) => {
    const { translate } = useTranslate();
    return (<Button layout="iconLeading" mood="neutral" intensity="supershy" icon={<Icon name="ActionCopyOutlined" color="ds.text.neutral.standard"/>} onClick={() => onClick(value)} disabled={!isEnabled} sx={{
            margin: '0px 8px',
        }}>
      {translate(translationKey)}
    </Button>);
};
