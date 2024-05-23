import reducer from './reducer';
import { State } from './types';
export const openPremiumDialog = reducer.registerAction<void>('OPEN_PREMIUM_DIALOG', (state: State) => {
    return {
        ...state,
        isOpenGoPremiumDialog: true,
    };
});
export const closePremiumDialog = reducer.registerAction<void>('CLOSE_PREMIUM_DIALOG', (state: State) => {
    return {
        ...state,
        isOpenGoPremiumDialog: false,
    };
});
