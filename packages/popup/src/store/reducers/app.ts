import createReducer from "../create";
import { App, Website } from "../types";
import { AccountFeatures } from "../../eventManager/types";
const reducer = createReducer<App>("APP", {
  accountFeatures: null,
  localAccounts: null,
  website: null,
});
export const accountFeaturesUpdated = reducer.registerAction<AccountFeatures>(
  "account-features-updated",
  (state, accountFeatures) => ({
    ...state,
    accountFeatures: accountFeatures || null,
  })
);
export const websiteUpdated = reducer.registerAction<Website>(
  "website-updated",
  (state, website) => ({
    ...state,
    website: website || null,
  })
);
const setAutoFillParametersOnPage = (
  state: App,
  parameters: {
    autofillDisabledOnPage: boolean;
    autologinDisabledOnPage: boolean;
  }
): App => {
  if (!state.website) {
    return state;
  }
  return {
    ...state,
    website: {
      ...state.website,
      ...parameters,
    },
  };
};
export const onAutofillAndAutologinEnabledOnPage = reducer.registerAction(
  "settings-autofill-autlogin-page",
  (state) =>
    setAutoFillParametersOnPage(state, {
      autofillDisabledOnPage: false,
      autologinDisabledOnPage: false,
    })
);
export const onAutologinOnlyEnabledOnPage = reducer.registerAction(
  "settings-autologin-only-page",
  (state) =>
    setAutoFillParametersOnPage(state, {
      autofillDisabledOnPage: true,
      autologinDisabledOnPage: false,
    })
);
const setAutoFillParametersOnSite = (
  state: App,
  parameters: {
    autofillDisabledOnSite: boolean;
    autologinDisabledOnSite: boolean;
  }
): App => {
  if (!state.website) {
    return state;
  }
  return {
    ...state,
    website: {
      ...state.website,
      ...parameters,
    },
  };
};
export const onDashlaneDisabledOnPage = reducer.registerAction(
  "settings-dashlane-disabled-page",
  (state) =>
    setAutoFillParametersOnPage(state, {
      autofillDisabledOnPage: true,
      autologinDisabledOnPage: true,
    })
);
export const onAutofillAndAutologinEnabledOnSite = reducer.registerAction(
  "settings-autofill-autlogin-site",
  (state) =>
    setAutoFillParametersOnSite(state, {
      autofillDisabledOnSite: false,
      autologinDisabledOnSite: false,
    })
);
export const onAutologinOnlyEnabledOnSite = reducer.registerAction(
  "settings-autologin-only-site",
  (state) =>
    setAutoFillParametersOnSite(state, {
      autofillDisabledOnSite: true,
      autologinDisabledOnSite: false,
    })
);
export const onDashlaneDisabledOnSite = reducer.registerAction(
  "settings-dashlane-disabled-site",
  (state) =>
    setAutoFillParametersOnSite(state, {
      autofillDisabledOnSite: true,
      autologinDisabledOnSite: true,
    })
);
export default reducer;
