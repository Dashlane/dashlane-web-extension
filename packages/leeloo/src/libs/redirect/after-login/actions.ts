import reducer from "./reducer";
import { State } from "./state";
export const registerRedirectPath = reducer.registerAction(
  "REGISTER_REDIRECT_PATH",
  (state: State, redirectPath: string) => {
    return {
      ...state,
      redirectPath,
    };
  }
);
export const redirectPathUsed = reducer.registerAction<void>(
  "REDIRECT_PATH_USED",
  (state: State) => {
    return {
      ...state,
      redirectPath: undefined,
      hasBeenRedirected: true,
    };
  }
);
export const clearRedirectPath = reducer.registerAction<void>(
  "CLEAR_REDIRECT_PATH",
  (state: State) => {
    return {
      ...state,
      redirectPath: undefined,
      hasBeenRedirected: false,
    };
  }
);
