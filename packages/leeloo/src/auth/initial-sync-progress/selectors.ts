import { GlobalState } from 'store/types';
export const isInitialSyncAnimationPendingSelector = (state: GlobalState) => state.initialSyncProgress.isPending;
export const isInitialSyncAnimationIntroPhasePendingSelector = (state: GlobalState) => state.initialSyncProgress.isIntroPhasePending;
