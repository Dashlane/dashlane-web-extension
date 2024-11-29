import * as React from "react";
import { Redirect, Route, RouteComponentProps } from "../dom";
import { makeLeeForRoute } from "../helpers/makeLeeForRoute";
import { useRouterGlobalSettingsContext } from "../RouterGlobalSettingsProvider";
import { CommonRouteProps, CustomRouteComponentProps } from "../types";
import { LOGIN_URL_SEGMENT } from "../../../app/routes/constants";
import { useHasSecretManagement } from "../../../webapp/secrets/hooks/use-has-secret-management";
const DEFAULT_OPTIONS = {};
export const CommonRoute = (props: CommonRouteProps): JSX.Element => {
  const globalSettings = useRouterGlobalSettingsContext();
  const hasSecretManagement = useHasSecretManagement();
  return React.useMemo(
    () => (
      <Route {...props}>
        {(routerProps: RouteComponentProps) => {
          if (!globalSettings || (!routerProps.match && !props.stayMounted)) {
            return null;
          }
          const lee = makeLeeForRoute(globalSettings, props);
          if (props.isB2BCapabilityRestricted && !hasSecretManagement) {
            return <Redirect to={props.redirectPath ?? LOGIN_URL_SEGMENT} />;
          }
          if (props.permission && !props.permission(lee.permission)) {
            return <Redirect to={props.redirectPath ?? LOGIN_URL_SEGMENT} />;
          }
          const passedProps: CustomRouteComponentProps = {
            ...routerProps,
            lee,
            options: props.options ?? DEFAULT_OPTIONS,
          };
          return props.children(passedProps);
        }}
      </Route>
    ),
    [props, globalSettings, hasSecretManagement]
  );
};
