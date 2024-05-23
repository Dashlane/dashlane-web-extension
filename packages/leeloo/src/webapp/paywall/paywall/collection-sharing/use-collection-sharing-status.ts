import { useFeatureFlip } from '@dashlane/framework-react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { getAdminRights } from 'libs/console';
import { isAccountTeamTrialBusiness, isStarterTier, } from 'libs/account/helpers';
import { useSharedCollectionsCount } from 'libs/carbon/hooks/useSharedCollections';
const REPACKAGE_RELEASE_FF = 'monetization_extension_starterRepackagingCollection';
const DEFAULT_RETURN_VALUE = {
    isAdmin: undefined,
    isStarterTeam: undefined,
    isBusinessTrialTeam: undefined,
    canShareCollection: true,
    hasSharingCollectionPaywall: false,
};
export const useCollectionSharingStatus = () => {
    const premiumStatus = usePremiumStatus();
    const sharedCollectionByUserCount = useSharedCollectionsCount();
    const hasReleaseFF = useFeatureFlip(REPACKAGE_RELEASE_FF);
    if (premiumStatus.status !== DataStatus.Success ||
        sharedCollectionByUserCount.status !== DataStatus.Success ||
        hasReleaseFF === false) {
        return DEFAULT_RETURN_VALUE;
    }
    const isAdmin = getAdminRights(premiumStatus.data) === 'full';
    const isStarterTeam = isStarterTier(premiumStatus.data);
    const isBusinessTrialTeam = isAccountTeamTrialBusiness(premiumStatus.data);
    const collectionSharingCapability = premiumStatus.data.capabilities?.collectionSharing;
    const hasSharingCollectionPaywall = collectionSharingCapability?.enabled
        ? !!collectionSharingCapability.info?.limit
        : true;
    const canShareCollection = hasSharingCollectionPaywall
        ? sharedCollectionByUserCount.data <
            collectionSharingCapability?.info?.limit
        : true;
    return {
        isAdmin,
        isStarterTeam,
        canShareCollection,
        isBusinessTrialTeam,
        hasSharingCollectionPaywall,
    };
};
