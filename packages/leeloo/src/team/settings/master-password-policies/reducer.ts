import { makeLocalReducer } from 'redux-cursor';
import { State } from '.';
const reducer = makeLocalReducer<State>('master-password-policies-settings', {
    recoveryEnabled: false,
});
export const masterPasswordPoliciesSettingsLoaded = reducer.action<{}>('master-password-policies-settings-loaded', ({ param }: any) => ({
    recoveryEnabled: Boolean(param.recoveryEnabled),
}));
export const setRecoveryEnabled = reducer.action<{}>('set-recovery-enabled', ({ param }: any) => ({ recoveryEnabled: param }));
export default reducer;
