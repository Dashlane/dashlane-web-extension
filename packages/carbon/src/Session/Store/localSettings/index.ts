import { mergeDeepRight } from "ramda";
import {
  AllowedOngoingLoginStep,
  LoginStep,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import { LoginStepInfoState } from "LoginStepInfo/types";
import {
  LoginStepInfoAction,
  RESET_LOGIN_STEP_INFO,
  UPDATE_LOGIN_STEP_INFO_LOGIN,
  UPDATE_LOGIN_STEP_INFO_STEP,
} from "LoginStepInfo/Store/actions";
import {
  CREDENTIAL_SEARCH_ORDER_UPDATED,
  LOAD_STORED_LOCAL_SETTINGS,
  LocalSettingsAction,
  NODE_PREMIUM_STATUS_UPDATED,
  PREMIUM_CHURNING_DISMISS_DATE_UPDATED,
  PREMIUM_STATUS_UPDATED,
  REGISTER_DEVICE_NAME,
  REGISTER_LAST_SYNC,
  SUBSCRIPTION_INFORMATION_UPDATED,
  WEB_ONBOARDING_MODE_UPDATED,
} from "Session/Store/localSettings/actions";
import {
  USER_MESSAGE_ADDED,
  USER_MESSAGES_DISMISSED,
  UserMessageAddedAction,
  UserMessagesDismissedAction,
} from "UserMessages/Store/actions";
import {
  DEVICE_REGISTERED,
  DeviceRegisteredAction,
} from "Authentication/Store/actions";
import { LocalSettings } from "Session/Store/localSettings/types";
export function getEmptyLoginStepInfo(): LoginStepInfoState {
  return {
    step: null,
    login: "",
    validated: false,
  };
}
const updateStep = (
  state: LoginStepInfoState,
  step: AllowedOngoingLoginStep
) => {
  return [LoginStep.Password, LoginStep.OTPToken].includes(step)
    ? step
    : state.step;
};
const updateValidated = (
  state: LoginStepInfoState,
  step: AllowedOngoingLoginStep
) => {
  if (step === LoginStep.OTPToken) {
    return Boolean(state.login);
  }
  if ([LoginStep.OTP1, LoginStep.OTP2].includes(step)) {
    return false;
  }
  return state.validated;
};
const matchesPredicate = (val: unknown, source: unknown) => {
  return Object.entries(source).every(([key, value]) => val?.[key] === value);
};
export default (
  state = getEmptyLocalSettings(),
  action:
    | LocalSettingsAction
    | DeviceRegisteredAction
    | UserMessageAddedAction
    | UserMessagesDismissedAction
    | LoginStepInfoAction
): LocalSettings => {
  switch (action.type) {
    case LOAD_STORED_LOCAL_SETTINGS: {
      const emptyLocalSettings = getEmptyLocalSettings();
      const stateMergedWithEmptyLocalSettings: LocalSettings = {
        ...emptyLocalSettings,
        ...state,
        ...action.data,
        webOnboardingMode: {
          ...emptyLocalSettings.webOnboardingMode,
          ...state.webOnboardingMode,
          ...action.data.webOnboardingMode,
          completedSteps: {
            ...emptyLocalSettings.webOnboardingMode.completedSteps,
            ...state.webOnboardingMode.completedSteps,
            ...action.data.webOnboardingMode.completedSteps,
          },
        },
      };
      return stateMergedWithEmptyLocalSettings;
    }
    case DEVICE_REGISTERED:
      switch (action.registrationType.type) {
        case "uki":
          return {
            ...state,
            uki: action.registrationType.uki,
          };
        default:
          return state;
      }
    case REGISTER_LAST_SYNC:
      return Object.assign({}, state, {
        lastSync: action.lastSync,
      });
    case REGISTER_DEVICE_NAME:
      return Object.assign({}, state, {
        deviceName: action.deviceName,
      });
    case PREMIUM_STATUS_UPDATED:
      return Object.assign({}, state, {
        premiumStatus: action.premiumStatus,
      });
    case NODE_PREMIUM_STATUS_UPDATED:
      return Object.assign({}, state, {
        nodePremiumStatus: action.nodePremiumStatus,
      });
    case SUBSCRIPTION_INFORMATION_UPDATED:
      return Object.assign({}, state, {
        subscriptionInformation: action.subscriptionInformation,
      });
    case WEB_ONBOARDING_MODE_UPDATED: {
      const baseMergedState = mergeDeepRight(getEmptyLocalSettings(), state);
      return mergeDeepRight(baseMergedState, {
        webOnboardingMode: action.webOnboardingMode,
      }) as LocalSettings;
    }
    case PREMIUM_CHURNING_DISMISS_DATE_UPDATED: {
      return Object.assign({}, state, {
        premiumChurningDismissDate: action.premiumChurningDismissDate,
      });
    }
    case CREDENTIAL_SEARCH_ORDER_UPDATED: {
      return Object.assign({}, state, {
        credentialSearchOrder: action.credentialSearchOrder,
      });
    }
    case USER_MESSAGE_ADDED: {
      return Object.assign({}, state, {
        userMessages: [...state.userMessages, action.userMessage],
      });
    }
    case USER_MESSAGES_DISMISSED: {
      return Object.assign({}, state, {
        userMessages: state.userMessages.some((userMessage) =>
          matchesPredicate(userMessage, action.predicate)
        )
          ? state.userMessages.map((userMessage) =>
              matchesPredicate(userMessage, action.predicate)
                ? {
                    ...userMessage,
                    dismissedAt: Date.now(),
                  }
                : userMessage
            )
          : [
              ...state.userMessages,
              { ...action.predicate, dismissedAt: Date.now() },
            ],
      });
    }
    case UPDATE_LOGIN_STEP_INFO_LOGIN:
      return Object.assign({}, state, {
        loginStepInfo: {
          ...state.loginStepInfo,
          login: action.login,
        },
      });
    case UPDATE_LOGIN_STEP_INFO_STEP:
      return Object.assign({}, state, {
        loginStepInfo: {
          ...state.loginStepInfo,
          step: updateStep(state.loginStepInfo, action.step),
          validated: updateValidated(state.loginStepInfo, action.step),
        },
      });
    case RESET_LOGIN_STEP_INFO:
      return Object.assign({}, state, {
        loginStepInfo: getEmptyLoginStepInfo(),
      });
    default:
      return state;
  }
};
export const getEmptyOnboardingMode = (): WebOnboardingModeEvent => ({
  flowCredentialInApp: false,
  flowLoginCredentialOnWeb: false,
  flowLoginCredentialOnWebSite: null,
  flowSaveCredentialOnWeb: false,
  flowImportPasswords: false,
  flowAddMobileOnWeb: false,
  flowTryAutofillOnWeb: false,
  leelooStep: null,
  popoverStep: null,
  completedSteps: {
    saveCredentialInApp: false,
    loginCredentialOnWeb: false,
    saveCredentialOnWeb: false,
    importPasswordsShown: false,
    onboardingHubShown: false,
    addMobileOnWeb: false,
    tryAutofillOnWeb: false,
  },
});
export function getEmptyLocalSettings(): LocalSettings {
  return {
    uki: null,
    lastSync: 0,
    premiumStatus: null,
    nodePremiumStatus: null,
    subscriptionInformation: null,
    deviceName: null,
    webOnboardingMode: getEmptyOnboardingMode(),
    premiumChurningDismissDate: null,
    credentialSearchOrder: null,
    userMessages: [],
    loginStepInfo: getEmptyLoginStepInfo(),
  };
}
