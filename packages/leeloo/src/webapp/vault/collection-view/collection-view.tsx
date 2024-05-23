import { Fragment, useEffect } from 'react';
import { jsx } from '@dashlane/design-system';
import { Redirect, useParams } from 'react-router-dom';
import { ClickOrigin, PageView } from '@dashlane/hermes';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Collection } from '@dashlane/vault-contracts';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { logPageView } from 'libs/logs/logEvent';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { CredentialsListView } from 'webapp/credentials/list/credentials-list-view';
import { CredentialsProvider } from 'webapp/credentials/credentials-view/credentials-context';
import { HasCredentialsProvider } from 'webapp/credentials/credentials-view/has-credentials-context';
import { MultiselectProvider } from 'webapp/credentials/list/multi-select';
import { CollectionSharingPaywall, useCollectionSharingStatus, } from 'webapp/paywall/paywall/collection-sharing';
import { useCollectionsContext } from '../collections-context';
import { CollectionViewHeader } from './collection-view-header';
import { CollectionEmptyView } from './collection-empty-view';
interface RouteParams {
    collectionId: string;
}
const collectionIdFilter = (collectionId: string) => (collection: Collection) => collection.id === collectionId;
export const CollectionView = () => {
    const { routes } = useRouterGlobalSettingsContext();
    const collectionId = `{${useParams<RouteParams>().collectionId}}`;
    const { currentSpaceId } = useTeamSpaceContext();
    const { collections, sharedCollections, isCollectionsLoading, updateActiveCollection, } = useCollectionsContext();
    const { canShareCollection, hasSharingCollectionPaywall, isAdmin, isStarterTeam, } = useCollectionSharingStatus();
    const isPersonalSpaceDisabledResult = useIsPersonalSpaceDisabled();
    useEffect(() => {
        logPageView(PageView.CollectionDetails);
        return () => updateActiveCollection(null);
    }, []);
    if (isCollectionsLoading ||
        isPersonalSpaceDisabledResult.status !== DataStatus.Success) {
        return null;
    }
    const filterForId = collectionIdFilter(collectionId);
    const collection = collections.find(filterForId) ?? sharedCollections.find(filterForId);
    if (!collection ||
        (currentSpaceId !== null && collection.spaceId !== currentSpaceId)) {
        return <Redirect to={routes.userCredentials}/>;
    }
    updateActiveCollection(collection);
    const { vaultItems, ...rest } = collection;
    return (<>
      <CollectionViewHeader isPersonalSpaceDisabled={isPersonalSpaceDisabledResult.isDisabled} {...rest}/>

      {hasSharingCollectionPaywall && isAdmin ? (<CollectionSharingPaywall isStarterTeam={isStarterTeam} canShareCollection={canShareCollection} sx={{ margin: '24px' }} clickOrigin={canShareCollection
                ? ClickOrigin.CollectionsSharingStarterLimitCloseToBeReachedMain
                : ClickOrigin.CollectionsSharingStarterLimitReachedMain}/>) : null}

      {vaultItems.length > 0 ? (<CredentialsProvider ids={vaultItems.map((vaultItem) => vaultItem.id)}>
          <HasCredentialsProvider>
            <MultiselectProvider>
              <CredentialsListView />
            </MultiselectProvider>
          </HasCredentialsProvider>
        </CredentialsProvider>) : (<CollectionEmptyView />)}
    </>);
};
