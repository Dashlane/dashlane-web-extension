import * as React from "react";
import useTranslate from "./useTranslate";
import { InjectedTranslateProps } from "./types";
const withTranslate =
  <P extends object>(
    Component: React.ComponentType<P & InjectedTranslateProps>
  ): React.FunctionComponent<P> =>
  (props) => {
    const { translate } = useTranslate();
    return <Component {...props} translate={translate} />;
  };
export default withTranslate;
