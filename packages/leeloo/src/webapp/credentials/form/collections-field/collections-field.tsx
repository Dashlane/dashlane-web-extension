import { forwardRef, useImperativeHandle } from 'react';
import { jsx } from '@dashlane/design-system';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { CollectionChip, CollectionsList, CollectionsListItem, } from 'webapp/vault/collections-layout';
import { CollectionsFieldProvider, FieldCollection, useCollectionsFieldContext, useCollectionsFieldUpdateContext, } from './collections-field-context';
import { AddCollectionInput } from './add-collection-input';
import { Column, Label, Row } from './layout';
export interface CollectionsFieldRef {
    getVaultItemCollections: () => FieldCollection[];
    clearVaultItemCollections: () => void;
}
interface CollectionsFieldProps {
    hasLabel?: boolean;
}
const collectionsFieldId = 'collectionsFieldId';
const CollectionsFieldComponent = forwardRef<CollectionsFieldRef, CollectionsFieldProps>(({ hasLabel = true }, ref) => {
    const { vaultItemCollections, vaultItemCollectionsToDisplay, vaultItemTitle, isAddCollectionDisabled, setHasOpenedDialogs, } = useCollectionsFieldContext();
    const { onDelete, clearVaultItemCollections } = useCollectionsFieldUpdateContext();
    const hasCollections = vaultItemCollectionsToDisplay?.length > 0;
    useImperativeHandle(ref, () => ({
        getVaultItemCollections: () => vaultItemCollections,
        clearVaultItemCollections,
    }));
    return (<Row sx={{ gap: '24px', alignItems: !hasCollections && 'center' }}>
      {hasLabel ? (<Label hasMultipleCollections={vaultItemCollectionsToDisplay?.length > 1} htmlFor={collectionsFieldId} sx={{ marginTop: hasCollections && '15px' }}/>) : null}
      <Column sx={{
            ...(hasCollections && {
                gap: '8px',
                marginTop: '10px',
            }),
        }}>
        <CollectionsList sx={{ marginLeft: '16px' }} collectionListItems={vaultItemCollectionsToDisplay.map((collection) => (<CollectionsListItem key={`collections_field_li_${collection.name}`}>
                <CollectionChip onDismiss={() => onDelete(collection.name)} isShared={collection.isShared}>
                  {collection.name}
                </CollectionChip>
              </CollectionsListItem>))}/>

        <AddCollectionInput id={collectionsFieldId} hasCollections={hasCollections} vaultItemTitle={vaultItemTitle} setHasOpenedDialogs={setHasOpenedDialogs} isDisabled={isAddCollectionDisabled}/>
      </Column>
    </Row>);
});
interface Props {
    vaultItemId: string;
    vaultItemTitle: string;
    spaceId: string;
    isAddCollectionDisabled?: boolean;
    signalEditedValues?: (hasBeenEdited: boolean) => void;
    setHasOpenedDialogs?: (hasBeenEdited: boolean) => void;
    hasLabel?: boolean;
}
export const CollectionsField = forwardRef<CollectionsFieldRef, Props>(({ vaultItemId, vaultItemTitle, spaceId, isAddCollectionDisabled, signalEditedValues, setHasOpenedDialogs, hasLabel, }: Props, ref) => {
    const { isCollectionsLoading } = useCollectionsContext();
    if (isCollectionsLoading) {
        return null;
    }
    return (<CollectionsFieldProvider vaultItemId={vaultItemId} vaultItemTitle={vaultItemTitle} spaceId={spaceId} signalEditedValues={signalEditedValues} setHasOpenedDialogs={setHasOpenedDialogs} isAddCollectionDisabled={isAddCollectionDisabled}>
        <CollectionsFieldComponent ref={ref} hasLabel={hasLabel}/>
      </CollectionsFieldProvider>);
});
