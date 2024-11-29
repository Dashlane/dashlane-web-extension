import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InAppMessage, InAppMessageButton, ModalMessage } from "@braze/web-sdk";
import { Dialog, Paragraph } from "@dashlane/design-system";
import { Redirect, useRouterGlobalSettingsContext } from "../router";
import { openUrl } from "../external-urls";
import {
  DEEPLINK_SCHEME,
  getDialogActions,
  isDeeplink,
} from "./braze-cta-helpers";
interface Props {
  inAppMessage: ModalMessage;
  logButtonClick: (
    button: InAppMessageButton,
    inAppMessage: ModalMessage
  ) => void;
  logImpression: (inAppMessage: InAppMessage) => void;
  flushBrazeData: Dispatch<SetStateAction<boolean>>;
}
export const BrazeModalWrapper = ({
  inAppMessage,
  logButtonClick,
  logImpression,
  flushBrazeData,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [redirectPath, setRedirectPath] = useState("");
  const {
    routes: { clientRoutesBasePath },
  } = useRouterGlobalSettingsContext();
  useEffect(() => {
    if (redirectPath) {
      flushBrazeData(true);
    }
  }, [redirectPath]);
  useEffect(() => {
    logImpression(inAppMessage);
  }, []);
  const { buttons, imageUrl, header, message } = inAppMessage;
  const handleClose = () => setIsOpen(false);
  const handleAction = (button: InAppMessageButton) => {
    const { uri } = button;
    logButtonClick(button, inAppMessage);
    if (uri) {
      if (isDeeplink(uri)) {
        setRedirectPath(uri.substring(DEEPLINK_SCHEME.length - 1));
      } else {
        openUrl(uri);
      }
    }
    setIsOpen(false);
  };
  return redirectPath ? (
    <Redirect to={clientRoutesBasePath + redirectPath} />
  ) : (
    <Dialog
      title={header}
      isOpen={isOpen}
      onClose={handleClose}
      closeActionLabel="Close message"
      actions={getDialogActions(buttons, handleAction)}
      decorationSlot={imageUrl}
      decorationFullWidth
    >
      <Paragraph>{message}</Paragraph>
    </Dialog>
  );
};
