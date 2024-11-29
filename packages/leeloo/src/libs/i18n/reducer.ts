import createReducer from "../../store/reducers/create";
import LocaleState from "./types";
const reducer = createReducer<LocaleState>("LOCALE", {
  language: "",
  country: "",
});
export const languageOverrideChanged = reducer.registerAction(
  "LANGUAGE_OVERRIDE_CHANGED",
  (
    state: LocaleState,
    {
      languageOverride,
    }: {
      languageOverride: string;
    }
  ) => Object.assign({}, state, { languageOverride })
);
export const loadedLanguage = reducer.registerAction(
  "LANGUAGE_LOADED",
  (
    state: LocaleState,
    {
      language,
    }: {
      language: string;
    }
  ) => Object.assign({}, state, { language })
);
export const loadedCountry = reducer.registerAction(
  "COUNTRY_LOADED",
  (
    state: LocaleState,
    {
      country,
    }: {
      country: string;
    }
  ) => Object.assign({}, state, { country })
);
export default reducer;
