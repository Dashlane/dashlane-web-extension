import { useRef } from 'react';
import { Button, Icon, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { useDialog } from 'webapp/dialog';
import { CollectionInputWithSelection } from 'webapp/vault/collections-layout';
import { useCollectionsFieldContext, useCollectionsFieldUpdateContext, } from './collections-field-context';
import { AddSharedCollectionDialog } from './add-shared-collection-dialog';
interface Props {
    id: string;
    hasCollections: boolean;
    vaultItemTitle: string;
    setHasOpenedDialogs?: (value: boolean) => void;
    isDisabled?: boolean;
}
export const AddCollectionInput = ({ id, hasCollections, vaultItemTitle, setHasOpenedDialogs, isDisabled = false, }: Props) => {
    const { translate } = useTranslate();
    const inputRef = useRef<HTMLInputElement>(null);
    const { isInputVisible, filteredCollections, input, spaceId } = useCollectionsFieldContext();
    const { openDialog, closeDialog } = useDialog();
    const { setInput, setIsInputVisible, onSubmit } = useCollectionsFieldUpdateContext();
    const handleSubmit = (collectionName?: string) => {
        onSubmit(collectionName);
        closeDialog();
        setHasOpenedDialogs?.(false);
        inputRef.current?.focus();
    };
    const handleCancel = () => {
        closeDialog();
        setHasOpenedDialogs?.(false);
    };
    const handleSubmitWithConfirmation = (collectionName?: string) => {
        const collection = filteredCollections.find((c) => c.name === collectionName && c.spaceId === spaceId);
        if (collection?.isShared) {
            openDialog(<AddSharedCollectionDialog onSubmit={handleSubmit} onClose={handleCancel} itemTitle={vaultItemTitle} collectionName={collection.name}/>);
            setHasOpenedDialogs?.(true);
        }
        else {
            handleSubmit(collectionName);
        }
    };
    return isInputVisible ? (<CollectionInputWithSelection collections={filteredCollections} id={id} input={input} inputRef={inputRef} spaceId={spaceId} selectionAsDropdown onSubmit={handleSubmitWithConfirmation} setInput={setInput} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
                window.setTimeout(() => {
                    setIsInputVisible(false);
                }, 100);
            }
        }}/>) : (<Button onClick={() => setIsInputVisible(true)} layout="iconLeading" intensity="supershy" disabled={isDisabled} mood="neutral" icon={<Icon name="ActionAddOutlined"/>}>
      {hasCollections
            ? translate('webapp_collections_input_placeholder_add_another')
            : translate('webapp_collections_input_placeholder_add_new')}
    </Button>);
};
