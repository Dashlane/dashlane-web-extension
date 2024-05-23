import React from 'react';
import { LoadingIcon } from '@dashlane/ui-components';
import { useOpenPaymentPage } from './hooks/useOpenPaymentPage';
export enum Mode {
    ADD = 'add',
    UPDATE = 'update',
    REPLACE = 'replace'
}
export interface Props {
    b2c: boolean;
    setPaymentLoading: React.Dispatch<React.SetStateAction<boolean>>;
    mode?: Mode;
}
export const PaymentLoading = ({ b2c, setPaymentLoading, mode }: Props) => {
    useOpenPaymentPage(b2c, setPaymentLoading, mode);
    return <LoadingIcon color="primaries.5" strokeWidth={1}/>;
};
