import { useContext } from "react";
import { I18nContext } from "./I18nContext";
function useTranslate() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslate must be used with I18n Provider");
  }
  return {
    translate: context.translate,
  };
}
export default useTranslate;
