import React, { createContext, ReactNode, useContext, useMemo, useRef, } from 'react';
import { DataStatus, useFeatureFlips, useModuleQuery, } from '@dashlane/framework-react';
import { Collection, vaultOrganizationApi } from '@dashlane/vault-contracts';
import { ShareableCollection } from '@dashlane/sharing-contracts';
import { sortCollections } from 'webapp/vault/utility';
import { useSharedCollectionsView } from 'libs/hooks/use-shared-collections-view';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
export interface Context {
    activeCollection: ShareableCollection | null;
    updateActiveCollection: (collection: Collection | null) => void;
    collections: ShareableCollection[];
    sharedCollections: ShareableCollection[];
    allCollections: ShareableCollection[];
    isCollectionsSharingEnabled: boolean;
    isCollectionsLoading: boolean;
}
interface Provider {
    children: ReactNode;
}
const CollectionsContext = createContext<Context>({} as Context);
const COLLECTION_SHARING_PROD_FF = 'sharing_web_collectionsSharing';
const CollectionsProvider = ({ children }: Provider) => {
    const activeCollectionRef = useRef<Collection | null>(null);
    const { data: privateCollectionsData, status: privateCollectionsStatus } = useModuleQuery(vaultOrganizationApi, 'queryCollections', {});
    const { data: sharedCollections, status: sharedCollectionsStatus } = useSharedCollectionsView();
    const { currentSpaceId } = useTeamSpaceContext();
    const isCollectionsLoading = privateCollectionsStatus !== DataStatus.Success ||
        sharedCollectionsStatus !== DataStatus.Success;
    const retrievedFeatureFlips = useFeatureFlips();
    const isCollectionsSharingEnabled = Boolean(retrievedFeatureFlips.data?.[COLLECTION_SHARING_PROD_FF]);
    const privateCollections = (privateCollectionsData?.collections ??
        []) as ShareableCollection[];
    const spaceFilteredCollections = currentSpaceId !== null
        ? privateCollections.filter((coll) => coll.spaceId === currentSpaceId)
        : privateCollections;
    const allCollections = useMemo(() => {
        if (isCollectionsLoading) {
            return [];
        }
        const allCollectionsUnsorted = isCollectionsSharingEnabled && sharedCollections && currentSpaceId !== ''
            ? spaceFilteredCollections.concat(sharedCollections)
            : spaceFilteredCollections;
        return sortCollections(allCollectionsUnsorted);
    }, [
        currentSpaceId,
        isCollectionsLoading,
        isCollectionsSharingEnabled,
        sharedCollections,
        spaceFilteredCollections,
    ]);
    const contextValue = {
        activeCollection: activeCollectionRef.current,
        updateActiveCollection: (collection: Collection | null) => (activeCollectionRef.current = collection),
        collections: privateCollectionsData?.collections
            ? sortCollections(privateCollectionsData.collections)
            : [],
        sharedCollections: sharedCollections ?? [],
        allCollections,
        isCollectionsSharingEnabled,
        isCollectionsLoading,
    };
    return (<CollectionsContext.Provider value={contextValue}>
      {children}
    </CollectionsContext.Provider>);
};
const useCollectionsContext = () => useContext(CollectionsContext);
export { CollectionsProvider, useCollectionsContext };
