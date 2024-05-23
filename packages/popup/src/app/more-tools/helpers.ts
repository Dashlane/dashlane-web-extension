import { UserLogoutEvent, UserOpenHelpCenterEvent } from '@dashlane/hermes';
import { logEvent } from 'src/libs/logs/logEvent';
import { DASHLANE_SUPPORT_PAGE, openExternalUrl } from 'libs/externalUrls';
import { openWebAppAndClosePopup } from '../helpers';
export const openWebapp = async () => {
    await openWebAppAndClosePopup({ route: '/passwords' });
};
export const openTeamConsole = async () => {
    await openWebAppAndClosePopup({ route: '/console' });
};
export const logoutLogs = async () => {
    await logEvent(new UserLogoutEvent({}));
};
export const openWebAppReferralPage = async () => {
    await openWebAppAndClosePopup({ route: '/referral' });
};
export const openSupportLink = async () => {
    await logEvent(new UserOpenHelpCenterEvent({}));
    await openExternalUrl(DASHLANE_SUPPORT_PAGE);
};
