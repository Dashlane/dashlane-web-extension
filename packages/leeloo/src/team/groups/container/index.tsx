import * as React from "react";
import styles from "./styles.css";
type Props = React.PropsWithChildren<{}>;
const Container = (props: Props) => (
  <div className={styles.container}>{props.children}</div>
);
export default Container;
