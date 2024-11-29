import * as React from "react";
import {
  CustomRoute,
  RoutesProps,
  Switch,
  WrappingRoute,
} from "../../libs/router";
import Container from "./container";
import { Connected as Edit } from "./edit/connected";
import editReducer from "./edit/reducer";
import { Connected as List } from "./list/connected";
import listReducer from "./list/reducer";
interface Props extends RoutesProps {
  permission: (p: any) => boolean;
}
export default function routes(props: Props): JSX.Element {
  const { path, permission } = props;
  return (
    <WrappingRoute
      exact
      path={[path, `${path}/:uuid`]}
      component={Container}
      permission={permission}
    >
      <Switch>
        <CustomRoute exact path={path} component={List} reducer={listReducer} />
        <CustomRoute
          path={`${path}/:uuid`}
          component={Edit}
          reducer={editReducer}
        />
      </Switch>
    </WrappingRoute>
  );
}
