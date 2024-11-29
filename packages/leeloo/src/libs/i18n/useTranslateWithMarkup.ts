import { ReactNode, useMemo } from "react";
import { TranslationOptions, TranslatorInterface } from "./types";
import useTranslate from "./useTranslate";
const translateWithOptions =
  (translate: TranslatorInterface) =>
  (options: TranslationOptions | string): ReactNode => {
    if (typeof options === "string") {
      return translate(options);
    } else {
      const linkParams = options.linkParams ?? {};
      return options.markup || options.params
        ? translate.markup(options.key, options.params, {
            ...linkParams,
            linkTarget: linkParams.linkTarget ?? "_blank",
          })
        : translate(options.key);
    }
  };
export function useTranslateWithMarkup() {
  const { translate } = useTranslate();
  const createUseTranslateWithMarkup = useMemo(
    () => ({
      translateWithMarkup: translateWithOptions(translate),
    }),
    [translate]
  );
  return createUseTranslateWithMarkup;
}
