import { tabsCreate } from '@dashlane/webextensions-apis';
import { browser } from '@dashlane/browser-utils';
import { kernel } from 'src/kernel';
const getPaymentUrl = (url: string, safariUrl = 'dashlane:///getpremium') => browser.isSafari() ? safariUrl : url;
export const GET_PREMIUM_URL = getPaymentUrl('*****');
export const GET_ESSENTIALS_URL = getPaymentUrl('*****');
export const FORGOT_PASSWORD_URL = '*****';
export const DASHLANE_SSO_LOGGING_IN_URL = '*****';
export const DASHLANE_UPDATE_NEEDED = '*****';
export const AUTOFILL_CORRECTION_URL = '*****';
export const DASHLANE_SUPPORT_PAGE = '*****';
export const WHATS_NEW_SUPPORT_URL = '*****';
export const PRICING_PAGE_URL = '*****';
export const DASHLANE_SSO_MORE_INFO = '*****';
export const PASSWORD_LESS_HELP_ARTICLE = '*****';
export const DASHLANE_B2B_DIRECT_BUY = '*****';
export const openExternalUrl = async (url: string) => {
    if (!url) {
        return;
    }
    try {
        await tabsCreate({ url });
    }
    catch {
        const newWindow = window.open() || window;
        newWindow.opener = null;
        newWindow.location.replace(url);
    }
    kernel.browser.closePopover();
};
