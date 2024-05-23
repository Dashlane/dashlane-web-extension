import * as React from 'react';
import { Redirect, Route, RouteComponentProps } from 'libs/router/dom';
import { makeLeeForRoute } from 'libs/router/helpers/makeLeeForRoute';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { CommonRouteProps, CustomRouteComponentProps } from 'libs/router/types';
import { LOGIN_URL_SEGMENT } from 'app/routes/constants';
const DEFAULT_OPTIONS = {};
export const CommonRoute = (props: CommonRouteProps): JSX.Element => {
    const globalSettings = useRouterGlobalSettingsContext();
    return React.useMemo(() => (<Route {...props}>
        {(routerProps: RouteComponentProps) => {
            if (!globalSettings || (!routerProps.match && !props.stayMounted)) {
                return null;
            }
            const lee = makeLeeForRoute(globalSettings, props);
            if (props.permission && !props.permission(lee.permission)) {
                return <Redirect to={props.redirectPath ?? LOGIN_URL_SEGMENT}/>;
            }
            const passedProps: CustomRouteComponentProps = {
                ...routerProps,
                lee,
                options: props.options ?? DEFAULT_OPTIONS,
            };
            return props.children(passedProps);
        }}
      </Route>), [props, globalSettings]);
};
