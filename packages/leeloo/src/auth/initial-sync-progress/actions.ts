import reducer from "./reducer";
import { State } from "./types";
export const setIsInitialSyncAnimationPending = reducer.registerAction(
  "IS_INITIAL_SYNC_ANIMATION_PENDING",
  (state: State, isPending: boolean) => {
    return {
      ...state,
      isPending,
    };
  }
);
export const setIsInitialSyncAnimationIntroPending = reducer.registerAction(
  "IS_INITIAL_SYNC_ANIMATION_INTRO_PENDING",
  (state: State, isIntroPhasePending: boolean) => {
    return {
      ...state,
      isIntroPhasePending,
    };
  }
);
