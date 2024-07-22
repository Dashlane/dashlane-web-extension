import { connectToAutofillEngine } from '@dashlane/autofill-engine/dist/autofill-engine/src/client';
import { connectToDispatcher } from '@dashlane/autofill-engine/dist/autofill-engine/src/dispatcher';
import { parse, stringify } from 'query-string';
export const LANGUAGES = [
    'de',
    'en',
    'es',
    'fr',
    'it',
    'ja',
    'ko',
    'nl',
    'pt',
    'sv',
    'zh',
];
export const TEST_LANGUAGES = ['en'];
const parseObjectFromUrl = <T>(search: string, property: string): T | undefined => {
    const queryStringObject = parse(search);
    if (queryStringObject && queryStringObject[property]) {
        return queryStringObject[property] as any as T;
    }
    return undefined;
};
export const getEnvVariables = () => ({
    *****: process.env.NODE_ENV === '*****',
    isDevBuild: process.env.REACT_APP_DEV_BUILD === 'true',
    eventBusTimeout: parseInt(process.env.REACT_APP_TS_EVENT_BUS_TIMEOUT ?? '', 10),
});
export class UtilsInterface {
    public env = getEnvVariables();
    public getFromUrl() {
        const { features: parsedFeatures } = parse(window.location.search, {
            arrayFormat: 'comma',
        });
        const features = (typeof parsedFeatures === 'string'
            ? [parsedFeatures]
            : parsedFeatures || []).reduce((prev: object, feature: string) => ({
            ...prev,
            [feature]: true,
        }), {});
        return {
            token: parseObjectFromUrl<string>(window.location.search, 'token'),
            type: parseObjectFromUrl<string>(window.location.search, 'type'),
            langCode: parseObjectFromUrl<string>(window.location.search, 'lang'),
            mockData: parseObjectFromUrl<string>(window.location.search, 'mockData'),
            noPlayground: parse(window.location.search).noPlayground === 'true',
            features,
        };
    }
    public log(...args: any[]) {
        if (!this.env.*****) {
            console.log(...args);
        }
    }
    public warn(...args: any[]) {
        if (!this.env.*****) {
            console.warn(...args);
        }
    }
    public error(...args: any[]) {
        if (!this.env.*****) {
            console.error(...args);
        }
    }
    public loadUrl(webcardType: string, mockData?: string, langCode?: string) {
        mockData = mockData ? mockData : 'default';
        langCode = langCode ? langCode : 'en';
        const { token: rawToken, noPlayground, features } = this.getFromUrl();
        const parsedToken = parseInt(rawToken ?? '');
        const token = isNaN(parsedToken) ? 1 : parsedToken + 1;
        const queryString = stringify({
            type: webcardType,
            mockData,
            lang: langCode,
            token,
            noPlayground,
            features: Object.keys(features),
        }, { arrayFormat: 'comma' });
        window.history.pushState({
            type: webcardType,
            mockData,
            lang: langCode,
        }, webcardType, `*****${window.location?.host}/?${queryString}`);
    }
    public connectToAutofillEngine = connectToAutofillEngine;
    public connectToDispatcher = connectToDispatcher;
    public clearPlaygroundLogs = () => {
    };
}
export default (): UtilsInterface => new UtilsInterface();
