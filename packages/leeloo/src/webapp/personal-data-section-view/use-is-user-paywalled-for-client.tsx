import { PremiumStatusCode, ServerSidePairingStatus, } from '@dashlane/communication';
import { isNil } from 'ramda';
import { useRouterGlobalSettingsContext } from 'libs/router';
export const useIsUserPaywalledForClient = (): boolean => {
    const { store } = useRouterGlobalSettingsContext();
    if (APP_PACKAGED_IN_EXTENSION) {
        return false;
    }
    const { accountFeatures: { list: features }, accountInfo, serverSidePairingStatus, } = store.getState().carbon;
    const isDeviceSyncedWithLocalClients = features['pairing-group-bucket'] &&
        serverSidePairingStatus === ServerSidePairingStatus.PAIRED;
    if (isDeviceSyncedWithLocalClients) {
        return false;
    }
    const hasMonobucketEnabled = features['MonoBucket_test'] && features['MonoBucket_variant'];
    if (hasMonobucketEnabled) {
        return false;
    }
    const { premiumStatus } = accountInfo;
    if (!premiumStatus ||
        !premiumStatus.endDate ||
        isNil(premiumStatus.statusCode)) {
        return false;
    }
    switch (premiumStatus.statusCode) {
        case PremiumStatusCode.PREMIUM:
        case PremiumStatusCode.OLD_ACCOUNT:
        case PremiumStatusCode.NEW_USER:
        case PremiumStatusCode.GRACE_PERIOD:
            return false;
        case PremiumStatusCode.PREMIUM_CANCELLED: {
            const endDateUnix = premiumStatus.endDate;
            const timeLeftMs = endDateUnix * 1000 - Date.now();
            return timeLeftMs < 0;
        }
        case PremiumStatusCode.NO_PREMIUM:
        default:
            return true;
    }
};
