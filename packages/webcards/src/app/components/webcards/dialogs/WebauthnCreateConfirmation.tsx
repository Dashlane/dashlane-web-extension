import * as React from "react";
import {
  WebauthnCreateConfirmationWebcardData,
  WebauthnOperationType,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import {
  BrowseComponent,
  DismissType,
  ItemType,
  PageView,
  UserAutofillAcceptEvent,
  UserAutofillDismissEvent,
  UserAutofillSuggestEvent,
  WebcardSaveOptions,
} from "@dashlane/hermes";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { usePerformanceContext } from "../../../context/performance";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import styles from "./WebauthnCreateConfirmation.module.scss";
import DOMPurify from "dompurify";
const I18N_KEYS = {
  HEADER_TITLE: "create_headerTitle",
  CONTENT: "create_content",
  CANCEL_BUTTON: "create_cancelButton",
  CONFIRM: "create_confirmButton",
};
interface Props extends WebcardPropsBase {
  data: WebauthnCreateConfirmationWebcardData;
}
export const WebauthnCreateConfirmation = ({
  data: { request, userDisplayName, rpName, webcardId, isRestoredWebcard },
  closeWebcard,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const timeToWebcard = usePerformanceContext();
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillNotificationSavePasskey,
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
          webcardSaveOptions: [WebcardSaveOptions.Save],
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
  const onClose = async () => {
    cancelWebauthnOperation();
    closeWebcard();
  };
  const onCancel = async () => {
    autofillEngineCommands?.webauthnUseOtherAuthenticator(request);
    closeWebcard();
  };
  const onSubmit = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        webcardOptionSelected: WebcardSaveOptions.Save,
        dataTypeList: [ItemType.Passkey],
      })
    );
    autofillEngineCommands?.webauthnCreateUserConfirmed(request, webcardId);
  };
  const userName = translate(I18N_KEYS.CONTENT, {
    0: `<span class=${styles.highlite}>${userDisplayName}</span>`,
    1: `<span class=${styles.highlite}>${rpName}</span>`,
  });
  const sanitizedUserName = DOMPurify.sanitize(userName);
  return (
    <DialogContainer
      closeWebcard={onClose}
      footerContent={
        <div className={styles.footer}>
          <SecondaryActionButton
            onClick={onCancel}
            label={translate(I18N_KEYS.CANCEL_BUTTON)}
          />
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
