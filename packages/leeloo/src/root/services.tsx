import * as React from 'react';
const ReactDOM = require('react-dom');
import { Store as ReduxStore } from 'redux';
import { AnyModuleApis, ClientsOf as ApplicationClient, } from '@dashlane/framework-contracts';
import App from 'app';
import registerLogSending from 'libs/logs/register';
import { loadAndPersistDevice as loadAndPersistUserDevice } from 'user/device';
import { initializeTranslator } from 'libs/i18n';
import { TranslatorInterface } from 'libs/i18n/types';
import { NamedRoutes } from 'app/routes/types';
import { listenToCarbonEvents } from 'libs/carbon';
import { setApplicationClient } from 'libs/application-client';
import { attemptToOpenExtensionSession } from 'libs/carbon/extension/extensionCarbon';
import { initEmbeddedCarbon, loadEmbeddedCarbon, } from 'libs/carbon/embed/embeddedCarbon';
import createHistory from './history';
import initErrorHandling from './init/errorHandling';
import loadStateFromUrl from './stateInUrl';
import { getUrlSearch, setHistory } from 'libs/router';
import { AcknowledgedChannel, createApplicationClient, LowLevelChannel, NoDynamicChannels, } from '@dashlane/framework-application';
import { appDefinition } from '@dashlane/application-extension-definition';
import { BrowserPortConnector, PageToWorkerChannel, } from '@dashlane/framework-infra';
import { initStore } from './init/init-store';
import { carbonLegacyApi } from '@dashlane/communication';
import { firstValueFrom } from 'rxjs';
const container = document.getElementById('app');
const host = window.location.host;
const basePath = container?.getAttribute('data-base') ?? '';
const appBuildType = container?.getAttribute('data-build-type') ?? '';
const history = createHistory();
setHistory(history);
let appClient: undefined | ApplicationClient<AnyModuleApis> = undefined;
async function initProcess(store: ReduxStore) {
    await loadAndPersistUserDevice(store);
    registerLogSending(store);
    listenToCarbonEvents(store);
    loadStateFromUrl(DEFAULT_URL_STATE_PARAMS, getUrlSearch(), store, {
        login: (val) => val === 'dummy'
            ? {
                'user.session.login': 'dummy-login@example.com',
                'user.session.uki': 'dummy-uki',
                'user.password': null,
            }
            : { 'user.session.login': val },
        password: 'user.session.password',
        showBillingAdmin: 'cursor.app.team.account.billing.admin._.showConfirm',
        uki: 'user.session.uki',
    });
}
const FOREGROUND_TO_BACKGROUND_CHANNEL_NAME = 'graphene-background-port';
async function startExtensionCarbon(store: ReduxStore): Promise<LowLevelChannel> {
    await initProcess(store);
    await attemptToOpenExtensionSession(store);
    return new BrowserPortConnector(FOREGROUND_TO_BACKGROUND_CHANNEL_NAME);
}
async function startEmbeddedCarbon(store: ReduxStore, translate: TranslatorInterface): Promise<LowLevelChannel> {
    const worker = await loadEmbeddedCarbon();
    await initProcess(store);
    const locale = translate.getLocale();
    await initEmbeddedCarbon(locale, appBuildType);
    return new PageToWorkerChannel(worker, FOREGROUND_TO_BACKGROUND_CHANNEL_NAME);
}
async function createAppClient(store: ReduxStore, translate: TranslatorInterface): Promise<ApplicationClient<AnyModuleApis>> {
    const channel = CARBON_EMBEDDED
        ? await startEmbeddedCarbon(store, translate)
        : await startExtensionCarbon(store);
    const { client } = createApplicationClient({
        appDefinition,
        channels: {
            background: new AcknowledgedChannel(channel),
        },
        channelsListener: NoDynamicChannels,
    });
    const userSessionSyncStatus$ = (client as ApplicationClient<{
        [k in (typeof carbonLegacyApi)['name']]: typeof carbonLegacyApi;
    }>)['carbon-legacy'].queries.carbonState({ path: 'userSession.sync.status' });
    await firstValueFrom(userSessionSyncStatus$);
    return client;
}
export const initApp = async (routes: any, namedRoutes: NamedRoutes) => {
    const store = initStore();
    initErrorHandling(window, store);
    const translate = await initializeTranslator(store);
    if (!appClient) {
        appClient = await createAppClient(store, translate);
        setApplicationClient(appClient);
    }
    if (!appClient) {
        throw new Error();
    }
    ReactDOM.render(<App host={host} basePath={basePath} history={history} store={store} translate={translate} namedRoutes={namedRoutes} routes={routes} coreClient={appClient}/>, container);
};
