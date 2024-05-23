import * as React from 'react';
import { AlertQueueContext } from './alert-queue-provider';
export const useAlertQueue = () => {
    const context = React.useContext(AlertQueueContext);
    if (!context) {
        throw new Error(`useAlertQueue must be called from within an AlertQueueProvider`);
    }
    return context;
};
