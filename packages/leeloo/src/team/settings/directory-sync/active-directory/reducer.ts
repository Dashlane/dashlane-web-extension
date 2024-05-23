import { makeLocalReducer } from 'redux-cursor';
import generateActiveDirectoryScript from './script';
import { State } from './active-directory';
import { TeamPlansActiveDirectorySyncStatus } from './types';
const reducer = makeLocalReducer<State>('active-directory-settings', {
    activeDirectoryScript: '',
    activeDirectorySyncStatus: {
        failedSyncCount: 0,
        lastFailedSync: null,
        lastSuccessfulSync: null,
    },
    activeDirectorySyncType: null,
    isCopied: false,
});
export interface ActiveDirectorySettingsLoadedParams {
    activeDirectorySyncStatus: TeamPlansActiveDirectorySyncStatus;
    activeDirectorySyncType: string | null;
    activeDirectoryToken: string;
    teamId: number;
}
export const activeDirectorySettingsLoaded = reducer.action<ActiveDirectorySettingsLoadedParams>('active-directory-settings-loaded', ({ param }) => ({
    activeDirectoryScript: generateActiveDirectoryScript(param.activeDirectoryToken, param.teamId),
    activeDirectorySyncStatus: param.activeDirectorySyncStatus || null,
    activeDirectorySyncType: param.activeDirectorySyncType ?? null,
}));
export const toggleScriptCopyFeedback = reducer.action('script-copy-feedback-toggled', ({ param }: any) => ({ isCopied: param }));
export const setActiveDirectorySyncType = reducer.action('active-directory-sync-type-set', ({ param }: any) => ({ activeDirectorySyncType: param }));
export default reducer;
