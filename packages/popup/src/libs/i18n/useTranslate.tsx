import * as React from "react";
import { I18nContext } from "./I18nContext";
import { TranslationService } from "./types";
const useTranslate = (): TranslationService => {
  return React.useContext(I18nContext);
};
export default useTranslate;
