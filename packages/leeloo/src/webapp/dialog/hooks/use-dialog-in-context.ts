import React from 'react';
export const useDialogInContext = () => {
    const [isDialogVisible, setDialogVisibility] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState<React.ReactNode>(null);
    const openDialog = (content: React.ReactNode) => {
        setDialogVisibility(!isDialogVisible);
        if (content) {
            setDialogContent(content);
        }
    };
    const closeDialog = () => {
        setDialogVisibility(false);
        setDialogContent(null);
    };
    return { isDialogVisible, dialogContent, openDialog, closeDialog };
};
