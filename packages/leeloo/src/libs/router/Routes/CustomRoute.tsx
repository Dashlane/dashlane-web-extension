import { CustomRouteComponentProps, CustomRouteProps } from "../types";
import { CommonRoute } from "./CommonRoute";
export const CustomRoute = (props: CustomRouteProps): JSX.Element => {
  const {
    component: Component = "div",
    additionalProps,
    ...otherRouteProps
  } = props;
  return (
    <CommonRoute {...otherRouteProps}>
      {(routerProps: CustomRouteComponentProps) => (
        <Component {...routerProps} {...additionalProps} />
      )}
    </CommonRoute>
  );
};
