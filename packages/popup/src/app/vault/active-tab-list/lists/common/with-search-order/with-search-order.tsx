import React, { ComponentType } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useCredentialSearchOrder } from "../../../../../../libs/api";
import { ISearchOrderProps } from "./types";
import ComponentWithSearchOrder from "./component-with-search-order";
function withSearchOrder<T>(
  WrappedComponent: ComponentType<T & ISearchOrderProps>
) {
  const WrappedComponentWithSearchOrder = (
    hocProps: Omit<T, keyof ISearchOrderProps>
  ) => {
    const savedCredentialSearchOrder = useCredentialSearchOrder();
    if (savedCredentialSearchOrder.status !== DataStatus.Success) {
      return null;
    }
    return (
      <ComponentWithSearchOrder
        searchOrderData={savedCredentialSearchOrder.data}
        WrappedComponent={WrappedComponent}
        wrappedComponentProps={hocProps as T}
      />
    );
  };
  WrappedComponentWithSearchOrder.displayName = `withSearchOrder(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  return WrappedComponentWithSearchOrder;
}
export default withSearchOrder;
