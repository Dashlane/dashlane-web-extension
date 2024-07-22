import * as React from "react";
import { Icon, jsx, mergeSx } from "@dashlane/design-system";
import {
  AnonymousAutofillDismissEvent,
  DismissType,
  DomainType,
  hashDomain,
  UserAutofillDismissEvent,
} from "@dashlane/hermes";
import { AutofillConfirmationPasswordLessWebcardData } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { COMMON_SX_STYLES } from "../../../../styles";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { KEYBOARD_EVENTS } from "../../../constants";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { WebcardPropsBase } from "../config";
import styles from "./AutofillConfirmation.module.scss";
const SX_STYLES = {
  FOOTER_TEXT: mergeSx([COMMON_SX_STYLES, { paddingLeft: "16px" }]),
};
const I18N_KEYS = {
  CANCEL: "cancel",
  CONFIRM: "confirm",
  TITLE: "title",
  WARNING: "warning",
};
interface Props extends WebcardPropsBase {
  data: AutofillConfirmationPasswordLessWebcardData;
}
export const AutofillConfirmation = ({
  data: { pendingOperation, tabRootDomain },
  closeWebcard,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const onClose = async ({ withEscapeKey = false } = {}) => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: withEscapeKey
          ? DismissType.CloseEscape
          : DismissType.CloseCross,
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillDismissEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
        isNativeApp: false,
        dismissType: withEscapeKey
          ? DismissType.CloseEscape
          : DismissType.CloseCross,
      })
    );
    closeWebcard();
  };
  const onCancel = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: DismissType.Cancel,
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillDismissEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
        isNativeApp: false,
        dismissType: DismissType.Cancel,
      })
    );
    closeWebcard();
  };
  const onSubmit = () => {
    if (pendingOperation) {
      autofillEngineCommands?.resetProtectedItemsTimerAndApplyRecipe(
        pendingOperation
      );
    }
    closeWebcard();
  };
  React.useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_EVENTS.ESCAPE) {
        onClose({ withEscapeKey: true });
      }
    };
    window.addEventListener("keyup", closeOnEscape);
    return () => window.removeEventListener("keyup", closeOnEscape);
  }, []);
  return (
    <DialogContainer
      closeWebcard={onClose}
      footerContent={
        <div className={styles.footer}>
          <Icon name="UnlockOutlined" />
          <div sx={SX_STYLES.FOOTER_TEXT}>{translate(I18N_KEYS.WARNING)}</div>
        </div>
      }
      headerContent={<HeaderTitle title={translate(I18N_KEYS.TITLE)} />}
      withFooterDivider
      withHeaderCloseButton
      withHeaderLogo
    >
      <div className={styles.main}>
        <SecondaryActionButton
          onClick={onCancel}
          label={translate(I18N_KEYS.CANCEL)}
        />
        <PrimaryActionButton
          onClick={onSubmit}
          label={translate(I18N_KEYS.CONFIRM)}
        />
      </div>
    </DialogContainer>
  );
};