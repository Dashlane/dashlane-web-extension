import * as React from "react";
import {
  AnonymousAutofillDismissEvent,
  BrowseComponent,
  DismissType,
  DomainType,
  hashDomain,
  PageView,
  UserAutofillDismissEvent,
} from "@dashlane/hermes";
import { OtherSourceType } from "@dashlane/autofill-contracts";
import {
  isAutofillDetailsForOtherDataSource,
  WarnGeneratedPasswordWebcardData,
} from "@dashlane/autofill-engine/types";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { KEYBOARD_EVENTS } from "../../../constants";
import { useWebcardVisibilityChecker } from "../../common/hooks/visibilityChecker";
import { WebcardPropsBase } from "../config";
import styles from "./WarnGeneratedPassword.module.scss";
interface Props extends WebcardPropsBase {
  data: WarnGeneratedPasswordWebcardData;
}
export const WarnGeneratedPassword = ({
  data: { pendingOperation, webcardId, tabRootDomain },
  closeWebcard,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands, autofillEngineDispatcher } =
    useCommunication();
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView:
        PageView.AutofillNotificationWarningGeneratePasswordDashlaneAccountEmail,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const checkWebcardVisible = useWebcardVisibilityChecker({
    webcardId,
    autofillEngineDispatcher,
    closeWebcard,
  });
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
  const onSubmit = async () => {
    if (
      pendingOperation &&
      pendingOperation.dataSource.type === OtherSourceType.NewPassword
    ) {
      if (await checkWebcardVisible()) {
        isAutofillDetailsForOtherDataSource(pendingOperation) &&
          autofillEngineCommands?.applyAutofillRecipeForOtherDataSource(
            pendingOperation
          );
      }
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
          <SecondaryActionButton
            onClick={onCancel}
            label={translate("cancel")}
          />
          <PrimaryActionButton
            onClick={onSubmit}
            label={translate("continue")}
          />
        </div>
      }
      headerContent={<HeaderTitle title={translate("header")} />}
      withHeaderCloseButton
      withHeaderLogo
    >
      <div className={styles.main}>
        {translate("contentWarnGeneratedPassword")}
      </div>
    </DialogContainer>
  );
};
