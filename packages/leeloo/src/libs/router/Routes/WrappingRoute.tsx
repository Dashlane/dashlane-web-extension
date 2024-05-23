import * as React from 'react';
import { CustomRouteComponentProps, WrappingRouteProps, } from 'libs/router/types';
import { CommonRoute } from 'libs/router/Routes/CommonRoute';
export const WrappingR = (props: WrappingRouteProps): JSX.Element => {
    const { children, component: Wrapper = 'div', additionalProps, ...otherRouteProps } = props;
    return (<CommonRoute {...otherRouteProps}>
      {({ staticContext, ...routerProps }: CustomRouteComponentProps) => {
            const passedProps = Wrapper === 'div' ? routerProps : { ...routerProps, staticContext };
            return (<Wrapper {...passedProps} {...additionalProps}>
            {children}
          </Wrapper>);
        }}
    </CommonRoute>);
};
export const WrappingRoute = React.memo(WrappingR);
