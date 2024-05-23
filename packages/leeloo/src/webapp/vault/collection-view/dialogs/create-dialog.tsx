import React, { useState } from 'react';
import { useModuleCommands } from '@dashlane/framework-react';
import { vaultOrganizationApi } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { useLoadingCommandWithAlert } from '../../use-loading-command-with-alert';
import { BaseDialog, BaseDialogProps } from './base-dialog';
import { CollectionForm } from './collection-form';
const createDialogFormId = 'createDialogFormId';
export const CreateDialog = (props: BaseDialogProps) => {
    const { translate } = useTranslate();
    const { createCollection } = useModuleCommands(vaultOrganizationApi);
    const { commandHandler, isLoading } = useLoadingCommandWithAlert();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const { onClose } = props;
    const handleSubmit = async (collectionName: string, spaceId: string) => {
        await commandHandler(() => createCollection({
            content: {
                name: collectionName,
                spaceId: spaceId,
            },
        }), translate('collections_dialog_create_success_toast_message', {
            name: collectionName,
        }), translate('collections_dialog_create_error_toast_message'));
        onClose();
    };
    return (<BaseDialog title={translate('collections_dialog_create_header_title')} content={<CollectionForm formId={createDialogFormId} onSubmit={handleSubmit} setIsSubmitDisabled={setIsSubmitDisabled}/>} confirmAction={{
            type: 'submit',
            form: createDialogFormId,
            disabled: isSubmitDisabled,
            isLoading,
            children: translate('collections_dialog_create_button_text'),
        }} {...props}/>);
};
