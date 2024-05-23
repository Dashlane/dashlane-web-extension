import { browser, os } from '@dashlane/browser-utils';
export const isSupportedBrowser = () => {
    return browser.isFirefox() || browser.isChrome() || browser.isChromiumEdge();
};
export enum SupportedBrowser {
    FIREFOX = 'Firefox',
    CHROME = 'Google Chrome',
    CHROMIUM_EDGE = 'Microsoft Edge'
}
export const getCurrentBrowserName = (): SupportedBrowser => {
    return browser.isFirefox()
        ? SupportedBrowser.FIREFOX
        : browser.isChrome()
            ? SupportedBrowser.CHROME
            : SupportedBrowser.CHROMIUM_EDGE;
};
export const isSupportedMobile = (): boolean => {
    return os.isAndroid() || os.isIOS();
};
