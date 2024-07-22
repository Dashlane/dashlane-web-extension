import * as React from "react";
const translations = require("../../lang");
interface PluralKey {
  one: string;
  other: string;
}
const isPluralKey = (obj: unknown): obj is PluralKey =>
  typeof obj === "object" &&
  obj !== null &&
  "one" in obj &&
  typeof obj["one"] === "string" &&
  "other" in obj &&
  typeof obj["other"] === "string";
export type TranslateFn = (
  key: string,
  args?: Record<string, string | number>
) => string;
export const getTranslate =
  (langCode: string) =>
  (nameSpace: string): TranslateFn =>
  (keyToTranslate, args): string => {
    let translation: unknown =
      translations[langCode][nameSpace]?.[keyToTranslate] ||
      translations["en"][nameSpace]?.[keyToTranslate] ||
      keyToTranslate;
    if (isPluralKey(translation)) {
      const keyOfFirstAvailableNumber =
        args && Object.keys(args).find((key) => typeof args[key] === "number");
      if (
        keyOfFirstAvailableNumber &&
        args?.[keyOfFirstAvailableNumber] !== 1
      ) {
        translation = translation.other;
      } else {
        translation = translation.one;
      }
    }
    if (typeof translation !== "string") {
      return keyToTranslate;
    }
    if (args) {
      return Object.keys(args).reduce((trad: string, key: string) => {
        return trad.replace(`{${key}}`, args[key].toString());
      }, translation);
    }
    return translation;
  };
interface I18State {
  nameSpace: string;
  translate: TranslateFn;
  langCode: string;
}
const initialI18State: I18State = {
  nameSpace: "",
  translate: (key: string) => key,
  langCode: "en",
};
interface State extends I18State {
  dispatch: React.Dispatch<Record<string, string>> | null;
}
type ActionType = {
  payload: string;
  type: "setLanguage" | "setNameSpace";
};
export const I18nContext = React.createContext<State>({
  ...initialI18State,
  dispatch: null,
});
export const I18nContextProvider = ({
  children,
  langCode,
}: {
  children: React.ReactNode;
  langCode: string;
}) => {
  const reducer = (state: I18State, action: ActionType): I18State => {
    switch (action.type) {
      case "setLanguage":
        return {
          langCode: action.payload,
          nameSpace: state.nameSpace,
          translate: getTranslate(action.payload)(state.nameSpace),
        };
      case "setNameSpace":
        return {
          langCode: state.langCode,
          nameSpace: action.payload,
          translate: getTranslate(state.langCode)(action.payload),
        };
      default:
        return { ...initialI18State };
    }
  };
  const [i18State, dispatch] = React.useReducer<
    React.Reducer<I18State, ActionType>
  >(reducer, {
    ...initialI18State,
    langCode: langCode ? langCode : initialI18State.langCode,
  });
  React.useLayoutEffect(() => {
    document.documentElement.lang = i18State.langCode;
  }, [i18State.langCode]);
  return (
    <I18nContext.Provider value={{ ...i18State, dispatch }}>
      {children}
    </I18nContext.Provider>
  );
};
export const useTranslate = () => React.useContext(I18nContext);
