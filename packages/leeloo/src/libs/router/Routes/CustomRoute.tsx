import * as React from 'react';
import { CustomRouteComponentProps, CustomRouteProps } from 'libs/router/types';
import { CommonRoute } from 'libs/router/Routes/CommonRoute';
const Route = (props: CustomRouteProps): JSX.Element => {
    const { component: Component = 'div', additionalProps, ...otherRouteProps } = props;
    return (<CommonRoute {...otherRouteProps}>
      {(routerProps: CustomRouteComponentProps) => (<Component {...routerProps} {...additionalProps}/>)}
    </CommonRoute>);
};
export const CustomRoute = React.memo(Route);
