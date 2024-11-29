import * as React from "react";
import { Store } from "../../../store/create";
import rerender from "./rerenderElementWhenStoreChanges";
interface Props extends React.Props<Renderer> {
  store: Store;
}
export default class Renderer extends React.Component<Props> {
  public static childContextTypes: React.ValidationMap<{}> = {};
  public getChildContext() {
    return {};
  }
  public constructor(props: Props) {
    super(props);
    rerender(this, this.props.store);
  }
  public render() {
    return React.Children.only(this.props.children);
  }
}
