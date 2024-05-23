import { pipe } from 'ramda';
import { CheckDirectorySyncKeyRequest } from '@dashlane/communication';
import createReducer from 'store/reducers/create';
import { State } from './state';
const reducer = createReducer<State>('directory-sync-key', {
    displayDialog: false,
    checkDirectorySyncKeyRequest: null,
    validationPostponed: false,
});
function hideDialog(state: State): State {
    return { ...state, displayDialog: false };
}
function showDialog(state: State): State {
    return { ...state, displayDialog: true };
}
function setValidationPostponed(state: State): State {
    return { ...state, validationPostponed: true };
}
function resetValidationPostponed(state: State): State {
    return { ...state, validationPostponed: false };
}
function setRequest(state: State, checkDirectorySyncKeyRequest: CheckDirectorySyncKeyRequest | null): State {
    return { ...state, checkDirectorySyncKeyRequest };
}
function resetRequest(state: State): State {
    return setRequest(state, null);
}
export const checkDirectorySyncKeyRequestAction = reducer.registerAction<CheckDirectorySyncKeyRequest>('CHECK_DIRECTORY_SYNC_KEY_REQUEST', (state, request) => {
    if (!request) {
        return state;
    }
    const stateWithRequest = setRequest(state, request);
    if (state.validationPostponed) {
        return stateWithRequest;
    }
    return showDialog(stateWithRequest);
});
export const keyValidationPostponedAction = reducer.registerAction<void>('KEY_VALIDATION_POSTPONED', pipe(hideDialog, setValidationPostponed));
export const reopenDialogAction = reducer.registerAction<void>('REOPEN_DIALOG', pipe(showDialog, resetValidationPostponed));
export const closeNotificationAction = reducer.registerAction<void>('CLOSE_NOTIFICATION', resetValidationPostponed);
export const keyValidatedAction = reducer.registerAction<void>('KEY_VALIDATED', pipe(hideDialog, resetValidationPostponed, resetRequest));
export const keyRejectedAction = reducer.registerAction<void>('KEY_REJECTED', pipe(hideDialog, resetValidationPostponed, resetRequest));
export const hideDialogAction = reducer.registerAction<void>('HIDE_DIALOG', hideDialog);
export const terminateRequestAction = reducer.registerAction<void>('TERMINATE_REQUEST', pipe(resetValidationPostponed, resetRequest));
export default reducer;
