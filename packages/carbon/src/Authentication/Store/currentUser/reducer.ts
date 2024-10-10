import { CLOSE_SESSION } from "Session/Store/actions";
import {
  CurrentUserAuthenticationActionTypes,
  REHYDRATE_USER_AUTHENTICATION_DATA,
  SET_REMEMBER_ME_TYPE,
} from "Authentication/Store/currentUser/actions";
import { CurrentUserAuthenticationState } from "Authentication/Store/currentUser/types";
import { DEVICE_REGISTERED } from "Authentication/Store/actions";
export const currentUserAuthenticationReducer = (
  state = getEmptyCurrentUserAuthentication(),
  action: CurrentUserAuthenticationActionTypes
): CurrentUserAuthenticationState => {
  switch (action.type) {
    case CLOSE_SESSION:
      return getEmptyCurrentUserAuthentication();
    case DEVICE_REGISTERED:
      switch (action.registrationType.type) {
        case "deviceKeys": {
          const { deviceAccessKey, deviceSecretKey } = action.registrationType;
          return {
            ...state,
            deviceKeys: {
              accessKey: deviceAccessKey,
              secretKey: deviceSecretKey,
            },
          };
        }
        default:
          return state;
      }
    case REHYDRATE_USER_AUTHENTICATION_DATA:
      return {
        ...state,
        ...action.data,
      };
    case SET_REMEMBER_ME_TYPE:
      return {
        ...state,
        rememberMeType: action.rememberMeType,
      };
    default:
      return state;
  }
};
export const getEmptyCurrentUserAuthentication =
  (): CurrentUserAuthenticationState => ({
    deviceKeys: null,
    rememberMeType: null,
  });
