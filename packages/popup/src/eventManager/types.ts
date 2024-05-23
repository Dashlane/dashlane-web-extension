import { Credential, CredentialCategory, RememberMeType, } from '@dashlane/communication';
export interface PopupSpaceData {
    color: string;
    letter: string;
    displayName: string;
    identifier: string;
    isSSOUser: boolean;
    status: string;
}
export interface Website {
    Domain: string;
    Icon: string;
    IconContent: string;
    IconRemoteVersion: string;
    IconVersion: string;
    Id: string;
    Title: string;
    Url: string;
    CrawlerIcon: {
        icon: string;
        color: string;
    };
}
interface UserData {
    authCategories: CredentialCategory[];
    authentifiants: {
        Authentifiants: Credential[];
        Domain: string;
    }[];
    accountFeatures: {
        [key: string]: boolean;
    };
    spaces: PopupSpaceData[];
    generatePassword: boolean;
    isStandalone: boolean;
    websites: Website[];
    generator: {
        length: number;
        digits: boolean;
        letters: boolean;
        symbols: boolean;
        avoidAmbiguous: boolean;
    };
}
export interface InitialData extends UserData {
    gettingStarted: boolean;
    server: string;
    settings: Record<never, never>;
    sorting: string;
}
export interface AccountFeatures {
    [key: string]: boolean;
}
export interface Message {
    action: string;
    type?: string;
    [k: string]: any;
}
export interface LocalAccount {
    hasLoginOtp: boolean;
    isLastSuccessfulLogin: boolean;
    login: string;
    rememberMeType?: RememberMeType;
    shouldAskMasterPassword?: boolean;
}
export enum ChangeDashlaneSettingsType {
    Domain = 'domain',
    Page = 'page'
}
export interface DashlaneSettings {
    autoFill: boolean;
    autoLogin: boolean;
}
export interface WebsiteInfo {
    disabledAutofillOnDomain: boolean;
    disabledAutofillOnPage: boolean;
    disabledAutologinOnDomain: boolean;
    disabledAutologinOnPage: boolean;
    disabledFromSpaces: boolean;
    domain: string;
    fullUrl: string;
}
