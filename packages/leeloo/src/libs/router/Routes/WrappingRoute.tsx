import { CustomRouteComponentProps, WrappingRouteProps } from "../types";
import { CommonRoute } from "./CommonRoute";
export const WrappingRoute = (props: WrappingRouteProps): JSX.Element => {
  const {
    children,
    component: Wrapper = "div",
    additionalProps,
    ...otherRouteProps
  } = props;
  return (
    <CommonRoute {...otherRouteProps}>
      {({ staticContext, ...routerProps }: CustomRouteComponentProps) => {
        const passedProps =
          Wrapper === "div" ? routerProps : { ...routerProps, staticContext };
        return (
          <Wrapper {...passedProps} {...additionalProps}>
            {children}
          </Wrapper>
        );
      }}
    </CommonRoute>
  );
};
