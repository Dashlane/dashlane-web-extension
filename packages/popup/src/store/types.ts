import { Store as ReduxStore } from 'redux';
import { AccountFeatures, LocalAccount } from 'src/eventManager/types';
export interface Website {
    autofillDisabledOnSite: boolean;
    autofillDisabledOnPage: boolean;
    autologinDisabledOnSite: boolean;
    autologinDisabledOnPage: boolean;
    disabledFromSpaces: boolean;
    domain: string;
    fullUrl: string;
}
export interface App {
    accountFeatures: AccountFeatures | null;
    localAccounts: LocalAccount[] | null;
    website: Website | null;
}
export interface Store extends ReduxStore<App> {
    getState: () => App;
}
