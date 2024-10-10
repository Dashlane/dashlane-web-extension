import { omit } from "ramda";
import {
  isLocalUserAuthenticationAction,
  LOAD_LOCAL_USERS_AUTH_DATA_FROM_STORAGE,
  LocalUserAuthenticationActionTypes,
  LocalUsersAuthenticationActionTypes,
  UPDATE_LOCAL_USER_INFO,
} from "Authentication/Store/localUsers/actions";
import {
  LocalUserAuthenticationState,
  LocalUsersAuthenticationState,
} from "Authentication/Store/localUsers/types";
import { DEVICE_REGISTERED } from "Authentication/Store/actions";
import { assertUnreachable } from "Helpers/assert-unreachable";
export const localUsersAuthenticationReducer = (
  state = getEmptyLocalUsersAuthentication(),
  action: LocalUsersAuthenticationActionTypes
) => {
  if (isLocalUserAuthenticationAction(action)) {
    const newUserState = localUserAuthenticationReducer(
      state[action.login],
      action
    );
    if (!newUserState) {
      return omit([action.login], state);
    }
    return {
      ...state,
      [action.login]: newUserState,
    };
  }
  switch (action.type) {
    case LOAD_LOCAL_USERS_AUTH_DATA_FROM_STORAGE:
      return {
        ...state,
        ...action.data,
      };
    case UPDATE_LOCAL_USER_INFO:
      const emptyState = getEmptyLocalUserAuthentication();
      return {
        ...state,
        [action.login]: {
          ...emptyState,
          ...state[action.login],
          ...action.data,
        },
      };
    default:
      return state;
  }
};
export const getEmptyLocalUsersAuthentication =
  (): LocalUsersAuthenticationState => ({});
const localUserAuthenticationReducer = (
  state: LocalUserAuthenticationState | undefined,
  action: LocalUserAuthenticationActionTypes
) => {
  const stateWithDefaults = state || getEmptyLocalUserAuthentication();
  switch (action.type) {
    case DEVICE_REGISTERED:
      const { registrationType } = action;
      switch (registrationType.type) {
        case "deviceKeys": {
          const { deviceAccessKey } = registrationType;
          return {
            ...stateWithDefaults,
            deviceAccessKey,
            deviceRegisteredWithLegacyKey: false,
          };
        }
        case "uki": {
          return {
            ...stateWithDefaults,
            deviceRegisteredWithLegacyKey: true,
          };
        }
        default:
          assertUnreachable(registrationType);
      }
      break;
    default:
      return state;
  }
};
const getEmptyLocalUserAuthentication = (): LocalUserAuthenticationState => ({
  deviceAccessKey: null,
  deviceRegisteredWithLegacyKey: false,
  ssoActivatedUser: false,
});
