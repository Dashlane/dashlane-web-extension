import * as React from "react";
import { ProtectedItemsUnlockerProps } from "./types";
import { useProtectedItemsUnlocker } from "./useProtectedItemsUnlocker";
export function withProtectedItemsUnlocker<Props>(
  Component: React.ComponentType<Props & ProtectedItemsUnlockerProps>
): React.ComponentType<Props> {
  return (props) => {
    const unlockerProps = useProtectedItemsUnlocker();
    return <Component {...props} {...unlockerProps} />;
  };
}
