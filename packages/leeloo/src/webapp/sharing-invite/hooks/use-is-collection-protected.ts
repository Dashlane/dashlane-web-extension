import { useEffect, useState } from 'react';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { checkForProtectedItems } from '../helpers';
import { ShareableCollection } from '@dashlane/sharing-contracts';
export enum IsCollectionProtectedStatus {
    Unknown,
    Loading,
    Complete
}
export const useIsCollectionProtected = (collectionId: string): [
    boolean | undefined,
    IsCollectionProtectedStatus
] => {
    const [isProtected, setIsProtected] = useState<boolean | undefined>(undefined);
    const [status, setStatus] = useState<IsCollectionProtectedStatus>(IsCollectionProtectedStatus.Unknown);
    const { collections } = useCollectionsContext();
    const collection = collections.find(({ id }) => id === collectionId);
    useEffect(() => {
        async function getCollectionItems(collectionView: ShareableCollection) {
            setStatus(IsCollectionProtectedStatus.Loading);
            const collectionCredentialIds = collectionView.vaultItems
                .filter(({ type }) => type === 'KWAuthentifiant')
                .map(({ id }) => id);
            const hasProtectedItems = await checkForProtectedItems(collectionCredentialIds, []);
            setIsProtected(hasProtectedItems);
            setStatus(IsCollectionProtectedStatus.Complete);
        }
        if (collectionId && collection) {
            getCollectionItems(collection);
        }
        else {
            setStatus(IsCollectionProtectedStatus.Complete);
            setIsProtected(false);
        }
    }, [collectionId, collection]);
    return [isProtected, status];
};
