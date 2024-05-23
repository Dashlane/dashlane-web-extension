import * as React from 'react';
import { DialogCallBack } from '../documents/types';
import { WithDeleteModalProps } from '../edit-panel-types';
export function useIdDeleteModal(setDialogActive: DialogCallBack): WithDeleteModalProps {
    const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
    const openConfirmDeleteDialog = () => {
        setShowConfirmDelete(true);
        setDialogActive(true);
    };
    const closeConfirmDeleteDialog = () => {
        setShowConfirmDelete(false);
        setDialogActive(false);
    };
    return {
        showConfirmDelete,
        openConfirmDeleteDialog,
        closeConfirmDeleteDialog,
    };
}
