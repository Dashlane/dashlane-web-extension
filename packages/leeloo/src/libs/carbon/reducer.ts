import { ABTestingEvent, AccountFeatures, AccountInfo, CurrentLocationUpdated, LocalAccountInfo, ServerSidePairingStatus, WebOnboardingModeEvent, } from '@dashlane/communication';
import createReducer from 'store/reducers/create';
import { DeviceInfo } from 'webapp/account/device-management/types';
import { SpaceData, State, TeamAdminData } from './types';
export const emptyState: State = {
    abtesting: {
        version: null,
    },
    currentLocation: {
        country: null,
        isEu: null,
    },
    loginStatus: {
        loggedIn: false,
        login: '',
    },
    serverSidePairingStatus: ServerSidePairingStatus.UNPAIRED,
    devices: [],
    accountInfo: {},
    accountFeatures: {
        list: {},
    },
    hasLoadedLocalAccountListAFirstTime: false,
    hasNoSessionToResume: false,
    localAccounts: null,
    spaceData: {
        spaces: [],
    },
    teamAdminData: { teams: {} },
    webOnboardingMode: {
        flowCredentialInApp: false,
        flowLoginCredentialOnWeb: false,
        flowSaveCredentialOnWeb: false,
        flowImportPasswords: false,
        flowTryAutofillOnWeb: false,
        completedSteps: {
            saveCredentialInApp: undefined,
            loginCredentialOnWeb: undefined,
            saveCredentialOnWeb: undefined,
            importPasswordsShown: undefined,
            onboardingHubShown: undefined,
            tryAutofillOnWeb: undefined,
        },
    },
};
const reducer = createReducer<State>('CARBON', Object.assign({}, emptyState));
export const loginStatusUpdated = reducer.registerAction('login-status-updated', (state: State, params?: Partial<State>) => Object.assign({}, state, params));
export const serverSidePairingStatusUpdated = reducer.registerAction('server-side-pairing-status-updated', (state: State, params?: Pick<State, 'serverSidePairingStatus'>) => Object.assign({}, state, params));
export const accountInfoUpdated = reducer.registerAction('account-info-updated', (state?: State, accountInfo?: AccountInfo) => Object.assign({}, state, { accountInfo }));
export const accountFeaturesUpdated = reducer.registerAction('account-features-updated', (state?: State, accountFeatures?: AccountFeatures) => Object.assign({}, state, { accountFeatures }));
export const spaceDataUpdated = reducer.registerAction('space-data-updated', (state?: State, spaceData?: SpaceData) => Object.assign({}, state, { spaceData }));
export const teamAdminDataUpdated = reducer.registerAction('team-admin-data-updated', (state?: State, teamAdminData?: TeamAdminData) => Object.assign({}, state, { teamAdminData }));
export const webOnboardingModeUpdate = reducer.registerAction('web-onboarding-mode-update', (state?: State, webOnboardingMode?: WebOnboardingModeEvent) => Object.assign({}, state, { webOnboardingMode }));
export const abTestingUpdated = reducer.registerAction('ab-testing-updated', (state?: State, abtesting?: ABTestingEvent) => Object.assign({}, state, { abtesting }));
export const currentLocationUpdated = reducer.registerAction('current-location-updated', (state: State, currentLocation: CurrentLocationUpdated) => ({
    ...state,
    currentLocation,
}));
export const devicesListUpdated = reducer.registerAction('devices-list-updated', (state: State, devices: DeviceInfo[] = []) => ({ ...state, devices }));
export const deviceDeactivationConfirmed = reducer.registerAction('device-deactivation-confirmed', (state: State, devices: DeviceInfo[] = []) => {
    const premiumStatus = {
        ...state.accountInfo.premiumStatus,
        devicesCount: devices ? devices.length : 0,
    };
    return Object.assign({}, state, { premiumStatus, devices });
});
export const localAccountsListUpdated = reducer.registerAction('local-accounts-list-updated', (state: State, localAccounts: LocalAccountInfo[] = []) => ({
    ...state,
    localAccounts,
}));
export const loadedLocalAccountListAFirstTime = reducer.registerAction<void>('loaded-local-accounts-list-a-first-time', (state: State) => ({ ...state, hasLoadedLocalAccountListAFirstTime: true }));
export const noSessionToResume = reducer.registerAction<void>('no-session-to-resume', (state: State) => ({ ...state, hasNoSessionToResume: true }));
export default reducer;
