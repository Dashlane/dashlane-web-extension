import { jsx } from '@dashlane/design-system';
import { ClickOrigin } from '@dashlane/hermes';
import { CollectionSharingPaywall, useCollectionSharingStatus, } from 'webapp/paywall/paywall/collection-sharing';
export const CollectionsOverviewPaywall = () => {
    const { canShareCollection, hasSharingCollectionPaywall, isAdmin, isStarterTeam, } = useCollectionSharingStatus();
    if (!hasSharingCollectionPaywall || !isAdmin) {
        return null;
    }
    return (<CollectionSharingPaywall canShareCollection={canShareCollection} isStarterTeam={isStarterTeam} sx={{
            margin: '16px 32px',
        }} clickOrigin={canShareCollection
            ? ClickOrigin.CollectionsSharingStarterLimitCloseToBeReachedMain
            : ClickOrigin.CollectionsSharingStarterLimitReachedMain}/>);
};
