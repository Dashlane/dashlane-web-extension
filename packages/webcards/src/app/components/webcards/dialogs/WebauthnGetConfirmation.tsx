import * as React from "react";
import { Button } from "@dashlane/design-system";
import {
  BrowseComponent,
  DismissType,
  ItemType,
  PageView,
  UserAutofillAcceptEvent,
  UserAutofillDismissEvent,
  UserAutofillSuggestEvent,
} from "@dashlane/hermes";
import { WebauthnGetConfirmationWebcardData } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { usePerformanceContext } from "../../../context/performance";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import styles from "./WebauthnGetConfirmation.module.scss";
import DOMPurify from "dompurify";
const I18N_KEYS = {
  HEADER_TITLE: "headerTitle",
  CONTENT: "content",
  CANCEL_BUTTON: "cancelButton",
  CONFIRM: "confirmButton",
  WITHOUT_DASHLANE_BUTTON: "get_withoutDashlaneButton",
};
interface Props extends WebcardPropsBase {
  data: WebauthnGetConfirmationWebcardData;
}
export const WebauthnGetConfirmation = ({
  data: {
    request,
    passkey,
    rpName,
    webcardId,
    isRestoredWebcard,
    allowUsingOtherAuthenticator,
  },
  closeWebcard,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const timeToWebcard = usePerformanceContext();
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillNotificationAuthenticatePasskey,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  React.useEffect(() => {
    if (timeToWebcard) {
      autofillEngineCommands?.logEvent(
        new UserAutofillSuggestEvent({
          isNativeApp: false,
          isRestoredWebcard,
          msToWebcard: timeToWebcard,
          vaultTypeList: [ItemType.Passkey],
        })
      );
    }
  }, [autofillEngineCommands, isRestoredWebcard, timeToWebcard]);
  const cancelWebauthnOperation = () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: DismissType.Cancel,
      })
    );
    autofillEngineCommands?.webauthnUserCanceled(request);
  };
  const onUseOtherAuthenticator = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: DismissType.Never,
      })
    );
    autofillEngineCommands?.webauthnUseOtherAuthenticator(request);
    closeWebcard();
  };
  const onClose = async () => {
    cancelWebauthnOperation();
    closeWebcard();
  };
  const onCancel = async () => {
    cancelWebauthnOperation();
    closeWebcard();
  };
  const onSubmit = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList: [ItemType.Passkey],
      })
    );
    autofillEngineCommands?.webauthnGetUserConfirmed(
      request,
      passkey.passkeyItemId,
      webcardId
    );
  };
  const userName = translate(I18N_KEYS.CONTENT, {
    0: `<span class=${styles.highlite}>${passkey.userDisplayName}</span>`,
    1: `<span class=${styles.highlite}>${rpName}</span>`,
  });
  const sanitizedUserName = DOMPurify.sanitize(userName);
  return (
    <DialogContainer
      closeWebcard={onClose}
      footerContent={
        <div className={styles.footer}>
          {allowUsingOtherAuthenticator ? (
            <Button
              mood="brand"
              intensity="quiet"
              size="small"
              type="button"
              onClick={onUseOtherAuthenticator}
            >
              {translate(I18N_KEYS.WITHOUT_DASHLANE_BUTTON)}
            </Button>
          ) : (
            <SecondaryActionButton
              onClick={onUseOtherAuthenticator}
              label={translate(I18N_KEYS.CANCEL_BUTTON)}
            />
          )}
          <PrimaryActionButton
            onClick={onSubmit}
            label={translate(I18N_KEYS.CONFIRM)}
          />
        </div>
      }
      headerContent={<HeaderTitle title={translate(I18N_KEYS.HEADER_TITLE)} />}
      withHeaderCloseButton
      withHeaderLogo
    >
      <div className={styles.main}>
        <p
          dangerouslySetInnerHTML={{
            __html: sanitizedUserName,
          }}
        ></p>
      </div>
    </DialogContainer>
  );
};