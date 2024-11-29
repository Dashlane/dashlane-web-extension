import * as React from "react";
import { Store } from "../../store/create";
import AppRenderer from "./renderer";
import AppStyles from "./styles";
type Props = React.PropsWithChildren<{
  store: Store;
}>;
const Container = (props: Props) => (
  <AppStyles>
    <AppRenderer store={props.store}>
      {React.Children.only(props.children)}
    </AppRenderer>
  </AppStyles>
);
export default Container;
