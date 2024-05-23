import { useContext } from 'react';
import { AlertContext } from 'libs/alert-notifications/alert-provider';
export const useAlert = () => {
    return useContext(AlertContext);
};
