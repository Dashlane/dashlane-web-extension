import * as React from "react";
import useTranslate from "./useTranslate";
import { TranslatorInterface } from "./types";
export type InjectedTranslateProps = {
  translate: TranslatorInterface;
};
export const withTranslate =
  <P extends object>(
    Component: React.ComponentType<P & InjectedTranslateProps>
  ): React.ComponentType<P> =>
  (props) => {
    const { translate } = useTranslate();
    return <Component {...props} translate={translate} />;
  };
