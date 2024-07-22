import * as React from "react";
import { SendWebcardGeometryFunction } from "../communication/types";
type ContextValue = {
  sendWebcardGeometry: SendWebcardGeometryFunction | null;
};
export const LayoutUtilsContext = React.createContext<ContextValue>({
  sendWebcardGeometry: null,
});
