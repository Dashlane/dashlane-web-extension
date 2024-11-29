import React from "react";
import ReactDOM from "react-dom";
import { DialogContext } from "../context/dialog-context-provider";
export const Dialog = ({ dialogId }: { dialogId?: string }) => {
  const domNode = document.getElementById(dialogId ?? "dashlane-dialog");
  const { isDialogVisible, dialogContent } = React.useContext(DialogContext);
  if (domNode && isDialogVisible && dialogContent) {
    return ReactDOM.createPortal(dialogContent, domNode);
  } else {
    return null;
  }
};
