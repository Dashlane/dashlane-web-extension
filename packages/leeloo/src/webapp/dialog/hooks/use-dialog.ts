import React from 'react';
import { DialogContext } from '../context/dialog-context-provider';
export const useDialog = () => {
    return React.useContext(DialogContext);
};
