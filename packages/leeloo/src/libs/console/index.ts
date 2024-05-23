import { PremiumStatus } from '@dashlane/communication';
import { TAC_URL } from 'app/routes/constants';
import { isAccountBusiness } from 'libs/account/helpers';
import { carbonConnector } from 'libs/carbon/connector';
import { openDashlaneUrl } from 'libs/external-urls';
export const getAdminRights = (premiumStatus: PremiumStatus) => {
    if (!isAccountBusiness(premiumStatus)) {
        return null;
    }
    const isTeamAdmin = premiumStatus.spaces?.some((space) => space.isTeamAdmin) ?? false;
    if (isTeamAdmin) {
        return 'full';
    }
    const isBillingAdmin = premiumStatus.spaces?.some((space) => space.isBillingAdmin) ?? false;
    if (isBillingAdmin) {
        return 'billing';
    }
    return null;
};
export const goToConsole = (userLogin: string, premiumStatus: PremiumStatus, onClickTeamConsole: () => void) => {
    if (APP_PACKAGED_IN_EXTENSION) {
        return onClickTeamConsole();
    }
    carbonConnector.getTemporaryToken(null).then((result) => {
        const token = result.temporaryToken;
        const rights = getAdminRights(premiumStatus);
        const tracking = { type: 'account', action: 'manageTeamPlan' };
        const redirect = rights === 'billing' ? 'account' : 'members';
        if (!token || !rights) {
            return openDashlaneUrl(TAC_URL, tracking);
        }
        return openDashlaneUrl(`${TAC_URL}#/directlogin?login=${encodeURIComponent(userLogin)}&token=${encodeURIComponent(token)}&rights=${encodeURIComponent(rights)}&redirect=${encodeURIComponent(redirect)}`, tracking);
    });
};
