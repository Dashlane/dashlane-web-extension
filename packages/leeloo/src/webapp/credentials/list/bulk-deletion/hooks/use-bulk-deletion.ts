import React, { useCallback } from 'react';
import { Credential } from '@dashlane/vault-contracts';
import { useDialog } from 'webapp/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
export const useBulkDeletion = () => {
    const { openDialog, closeDialog } = useDialog();
    const openBulkDeletionDialog = useCallback((credentialsToBeDeleted: Credential[], clearMultiSelection) => {
        openDialog(React.createElement(ConfirmationDialog, {
            credentialsToBeDeleted,
            onClose: closeDialog,
            clearMultiSelection,
        }));
    }, [openDialog, closeDialog]);
    return {
        openBulkDeletionDialog,
    };
};
