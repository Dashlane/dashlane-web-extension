import { combineReducers } from "redux";
import settings, {
  ApplicationSettings,
} from "Application/Store/applicationSettings";
import {
  APP_SESSION_ID_INITIALIZED,
  ApplicationSessionAction,
} from "Application/Store/application/actions";
export interface ApplicationSessionState {
  appSessionId: number | undefined;
}
export interface Application {
  appSession: ApplicationSessionState;
  settings: ApplicationSettings;
}
export const getEmptyApplicationSessionState = (): ApplicationSessionState => {
  return {
    appSessionId: undefined,
  };
};
const appSession = (
  state: ApplicationSessionState = getEmptyApplicationSessionState(),
  action: ApplicationSessionAction
): ApplicationSessionState => {
  switch (action.type) {
    case APP_SESSION_ID_INITIALIZED: {
      return {
        ...state,
        appSessionId: action.appSessionId,
      };
    }
    default:
      return state;
  }
};
export const applicationReducer = combineReducers<Application>({
  appSession,
  settings,
});
