import React, { useState } from 'react';
import { useModuleCommands } from '@dashlane/framework-react';
import { sharingCollectionsApi } from '@dashlane/sharing-contracts';
import { Collection, vaultOrganizationApi } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { useLoadingCommandWithAlert } from '../../use-loading-command-with-alert';
import { BaseDialog, BaseDialogProps } from './base-dialog';
import { CollectionForm } from './collection-form';
export type EditDialogCollectionProps = Omit<Collection, 'vaultItems'> & {
    isShared?: boolean;
};
type Props = EditDialogCollectionProps & BaseDialogProps;
const editDialogFormId = 'editDialogFormId';
export const EditDialog = ({ id, isShared, name, spaceId, onClose, ...rest }: Props) => {
    const { translate } = useTranslate();
    const { updateCollection } = useModuleCommands(vaultOrganizationApi);
    const { renameCollection } = useModuleCommands(sharingCollectionsApi);
    const { commandHandler, isLoading } = useLoadingCommandWithAlert();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const handleSubmit = async (collectionName: string) => {
        if (isShared) {
            const renameParams = { collectionId: id, newName: collectionName };
            await commandHandler(() => renameCollection(renameParams), translate('_common_toast_changes_saved'), translate('_common_generic_error'));
        }
        else {
            await commandHandler(() => updateCollection({
                id,
                collection: {
                    name: collectionName,
                },
            }), translate('_common_toast_changes_saved'), translate('_common_generic_error'));
        }
        onClose();
    };
    return (<BaseDialog title={translate('collections_dialog_edit_header_title')} content={<CollectionForm formId={editDialogFormId} onSubmit={handleSubmit} setIsSubmitDisabled={setIsSubmitDisabled} name={name} lockedSpaceId={spaceId}/>} confirmAction={{
            children: translate('_common_action_save'),
            type: 'submit',
            form: editDialogFormId,
            disabled: isSubmitDisabled,
            isLoading,
        }} onClose={onClose} {...rest}/>);
};
