import * as React from "react";
import {
  BrowseComponent,
  DismissType,
  ItemType,
  PageView,
  UserAutofillAcceptEvent,
  UserAutofillDismissEvent,
  UserAutofillSuggestEvent,
} from "@dashlane/hermes";
import {
  filterWebcardMetadataStore,
  WebauthnPasskeySelectionWebcardData,
  WebcardItem,
  WebcardMetadataType,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { Button } from "@dashlane/design-system";
import { I18nContext } from "../../../context/i18n";
import { KEYBOARD_EVENTS } from "../../../constants";
import { useCommunication } from "../../../context/communication";
import { usePerformanceContext } from "../../../context/performance";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { SuggestedItemsList } from "../dropdowns/SuggestedItemsList";
import { WebcardPropsBase } from "../config";
interface Props extends WebcardPropsBase {
  data: WebauthnPasskeySelectionWebcardData;
}
const I18N_KEYS = {
  HEADER_TITLE: "headerTitle",
  WITHOUT_DASHLANE_BUTTON: "selection_withoutDashlaneButton",
};
export const WebauthnPasskeySelection = ({
  data: { webcardId, isRestoredWebcard, passkeys, metadata },
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
          webcardItemTotalCount: passkeys.length,
        })
      );
    }
  }, [
    autofillEngineCommands,
    isRestoredWebcard,
    passkeys.length,
    timeToWebcard,
  ]);
  const webauthnMetadata = metadata?.[WebcardMetadataType.WebauthnRequest];
  const onClick = async (passkey: WebcardItem) => {
    const itemPosition = passkeys.indexOf(passkey) + 1;
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList: [ItemType.Passkey],
        itemPosition: itemPosition,
      })
    );
    autofillEngineCommands?.webcardItemSelected(
      passkey,
      filterWebcardMetadataStore(metadata ?? {}, passkey.metadataKeys ?? []),
      webcardId
    );
  };
  const cancelWebauthnOperation = () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: DismissType.Cancel,
      })
    );
    if (webauthnMetadata) {
      autofillEngineCommands?.webauthnUserCanceled(webauthnMetadata);
    }
  };
  const onUseOtherAuthenticator = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: DismissType.Never,
      })
    );
    if (webauthnMetadata) {
      autofillEngineCommands?.webauthnUseOtherAuthenticator(webauthnMetadata);
    }
    closeWebcard();
  };
  const onClose = async () => {
    cancelWebauthnOperation();
    closeWebcard();
  };
  React.useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_EVENTS.ESCAPE) {
        onClose();
      }
    };
    window.addEventListener("keyup", closeOnEscape);
    return () => window.removeEventListener("keyup", closeOnEscape);
  }, []);
  return (
    <DialogContainer
      closeWebcard={onClose}
      headerContent={<HeaderTitle title={translate(I18N_KEYS.HEADER_TITLE)} />}
      footerContent={
        <Button
          mood="brand"
          intensity="quiet"
          size="small"
          type="button"
          onClick={onUseOtherAuthenticator}
        >
          {translate(I18N_KEYS.WITHOUT_DASHLANE_BUTTON)}
        </Button>
      }
      withHeaderCloseButton
      withHeaderLogo
      withNoMainPadding
      withFooterDivider
    >
      <SuggestedItemsList
        onAddNewItem={onClose}
        items={passkeys}
        onClickItem={onClick}
        withPages
      />
    </DialogContainer>
  );
};
