import * as React from 'react';
import { CarbonLiveResult } from '@dashlane/carbon-api-consumers';
import type { ChangeMasterPasswordProgress } from '@dashlane/communication';
import { useLiveChangeMasterPasswordStatus, usePaymentFailureNotificationData, } from 'libs/api';
import { PaymentFailureNotificationStatus } from 'libs/api/types';
export interface InjectedAppProps {
    paymentFailureNotification: PaymentFailureNotificationStatus;
    changeMPProgress: CarbonLiveResult<ChangeMasterPasswordProgress>;
}
export const withAppData = <P extends object>(Component: React.ComponentType<P & InjectedAppProps>): React.FunctionComponent<P> => (props) => {
    const paymentFailureNotification = usePaymentFailureNotificationData();
    const changeMPProgress = useLiveChangeMasterPasswordStatus();
    return (<Component {...props} paymentFailureNotification={paymentFailureNotification} changeMPProgress={changeMPProgress}/>);
};
