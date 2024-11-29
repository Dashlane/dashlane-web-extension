import { UserVerificationResult } from "@dashlane/autofill-engine/client";
import {
  NeverAskAgainMode,
  UserVerificationWebcardData,
  WebcardMetadataType,
} from "@dashlane/autofill-engine/types";
import { Checkbox, Infobox, jsx } from "@dashlane/design-system";
import {
  CeremonyStatus,
  Mode,
  UserUserVerificationCompletedEvent,
} from "@dashlane/hermes";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useCommunication } from "../../../context/communication";
import { I18nContext } from "../../../context/i18n";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { WebcardPropsBase } from "../config";
import { MasterPasswordPanel } from "./userVerificationPanels/MasterPasswordPanel";
import { SelectionPanel } from "./userVerificationPanels/SelectionPanel";
import { WebauthnPanel } from "./userVerificationPanels/WebauthnPanel";
import { PinCodePanel } from "./userVerificationPanels/PinCodePanel";
import { SX_STYLES } from "./UserVerificationWebcard.styles";
import { UserVerificationMethods } from "@dashlane/authentication-contracts";
import { assertUnreachable } from "@dashlane/framework-types";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
export const I18N_KEYS = {
  TITLE: "webcardTitle",
  USE_ANOTHER_METHOD: "useAnotherMethod",
  NEVER_ASK_AGAIN: "neverAskAgainCredentialCheckbox",
  NEVER_ASK_AGAIN_ANY: "neverAskAgainAnyCredentialCheckbox",
  NEVER_ASK_AGAIN_INFOBOX: "neverAskAgainAnyCredentialInfobox",
};
function eventModeForMethod(method: UserVerificationMethods): Mode {
  switch (method) {
    case UserVerificationMethods.Biometrics:
      return Mode.Biometric;
    case UserVerificationMethods.MasterPassword:
      return Mode.MasterPassword;
    case UserVerificationMethods.Pin:
      return Mode.Pin;
  }
}
export interface UserVerificationProps extends WebcardPropsBase {
  data: UserVerificationWebcardData;
}
export const UserVerification = ({
  data,
  closeWebcard,
}: UserVerificationProps) => {
  const { metadata, webcardId, neverAskAgainMode } = data;
  const pendingOperation = metadata[WebcardMetadataType.PendingOperation];
  const { translate } = useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const [currentMethod, setCurrentMethod] = useState(data.defaultMethod);
  const [neverAskMeAgain, setNeverAskMeAgain] = useState(false);
  const [attemptCounter, setAttemptCounter] = useState(
    data.defaultMethod ? 1 : 0
  );
  const incrementAttemptCounter = useCallback(
    () => setAttemptCounter((value) => value + 1),
    []
  );
  const onChooseOtherMethod =
    data.availableMethods.length > 1
      ? () => setCurrentMethod(undefined)
      : undefined;
  const onClose = async () => {
    if (currentMethod) {
      autofillEngineCommands?.logEvent(
        new UserUserVerificationCompletedEvent({
          attemptNum: attemptCounter,
          status: CeremonyStatus.Cancelled,
          verificationMethod: eventModeForMethod(currentMethod),
          ...data.usageLogDetails,
        })
      );
    }
    autofillEngineCommands?.userVerificationComplete(
      pendingOperation,
      UserVerificationResult.Failure,
      {},
      webcardId
    );
    closeWebcard();
  };
  const onCancel = onClose;
  const onVerificationSucessful = useCallback(() => {
    if (currentMethod) {
      autofillEngineCommands?.logEvent(
        new UserUserVerificationCompletedEvent({
          attemptNum: attemptCounter,
          status: CeremonyStatus.Success,
          verificationMethod: eventModeForMethod(currentMethod),
          ...data.usageLogDetails,
        })
      );
    }
    const neverAgain =
      neverAskAgainMode !== NeverAskAgainMode.None && neverAskMeAgain;
    if (pendingOperation) {
      autofillEngineCommands?.userVerificationComplete(
        pendingOperation,
        UserVerificationResult.Success,
        { neverAgain },
        webcardId
      );
    }
  }, [
    currentMethod,
    neverAskAgainMode,
    neverAskMeAgain,
    pendingOperation,
    attemptCounter,
    data.usageLogDetails,
    autofillEngineCommands,
    webcardId,
  ]);
  const neverAskAgainCheckbox = useMemo((): ReactNode => {
    switch (data.neverAskAgainMode) {
      case NeverAskAgainMode.Global:
        return (
          <div sx={SX_STYLES.NEVER_ASK_AGAIN_CONTAINER}>
            <Checkbox
              name="alwaysAskMPCheckbox"
              checked={neverAskMeAgain}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNeverAskMeAgain(e.target.checked);
              }}
              label={translate(I18N_KEYS.NEVER_ASK_AGAIN_ANY)}
            />
            <Infobox
              title={translate(I18N_KEYS.NEVER_ASK_AGAIN_INFOBOX)}
              mood="warning"
            />
          </div>
        );
      case NeverAskAgainMode.VaultItem:
        return (
          <div sx={SX_STYLES.NEVER_ASK_AGAIN_CONTAINER}>
            <Checkbox
              name="alwaysAskMPCheckbox"
              checked={neverAskMeAgain}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNeverAskMeAgain(e.target.checked);
              }}
              label={translate(I18N_KEYS.NEVER_ASK_AGAIN)}
            />
          </div>
        );
      default:
        return null;
    }
  }, [data.neverAskAgainMode, neverAskMeAgain, setNeverAskMeAgain, translate]);
  const makeUserVerificationDialog = (
    content: ReactNode,
    customFooterPart: ReactNode,
    closeWebcard: () => Promise<void> = onClose,
    onChooseOtherMethodCleanup?: () => void
  ) => {
    const footerContent = (
      <div sx={SX_STYLES.BUTTONS_CONTAINER}>
        <div sx={SX_STYLES.BUTTONS_GROUP}>
          {currentMethod !== undefined && onChooseOtherMethod ? (
            <SecondaryActionButton
              onClick={() => {
                if (onChooseOtherMethodCleanup) {
                  onChooseOtherMethodCleanup();
                }
                onChooseOtherMethod();
              }}
              label={translate(I18N_KEYS.USE_ANOTHER_METHOD)}
              intensity={"supershy"}
            />
          ) : null}
        </div>

        <div sx={SX_STYLES.BUTTONS_GROUP}>{customFooterPart}</div>
      </div>
    );
    const dialogContent = (
      <div sx={SX_STYLES.CONTENT_CONTAINER}>
        {content}

        {currentMethod !== undefined ? neverAskAgainCheckbox : undefined}
      </div>
    );
    return (
      <DialogContainer
        closeWebcard={closeWebcard}
        headerContent={<HeaderTitle title={translate(I18N_KEYS.TITLE)} />}
        footerContent={footerContent}
        withHeaderCloseButton
        withHeaderLogo
      >
        {dialogContent}
      </DialogContainer>
    );
  };
  let content: JSX.Element | null = null;
  switch (currentMethod) {
    case UserVerificationMethods.MasterPassword:
      content = (
        <MasterPasswordPanel
          onVerificationSucessful={onVerificationSucessful}
          onCancel={onCancel}
          makeUserVerificationDialog={makeUserVerificationDialog}
          userLogin={data.userLogin}
          webcardId={data.webcardId}
          closeWebcard={closeWebcard}
          usageLogDetails={data.usageLogDetails}
          attemptCounter={attemptCounter}
          incrementAttemptCounter={incrementAttemptCounter}
        />
      );
      break;
    case UserVerificationMethods.Biometrics:
      content = (
        <WebauthnPanel
          onVerificationSucessful={onVerificationSucessful}
          onCancel={onCancel}
          makeUserVerificationDialog={makeUserVerificationDialog}
          usageLogDetails={data.usageLogDetails}
          attemptCounter={attemptCounter}
          incrementAttemptCounter={incrementAttemptCounter}
        />
      );
      break;
    case UserVerificationMethods.Pin:
      content = (
        <PinCodePanel
          webcardId={webcardId}
          onVerificationSucessful={onVerificationSucessful}
          onCancel={onCancel}
          closeWebcard={closeWebcard}
          makeUserVerificationDialog={makeUserVerificationDialog}
          usageLogDetails={data.usageLogDetails}
          attemptCounter={attemptCounter}
          incrementAttemptCounter={incrementAttemptCounter}
        />
      );
      break;
    case undefined:
      if (data.availableMethods.length > 1) {
        return (
          <SelectionPanel
            onCancel={onCancel}
            makeUserVerificationDialog={makeUserVerificationDialog}
            availableMethods={data.availableMethods}
            onChooseMethod={(method) => {
              incrementAttemptCounter();
              setCurrentMethod(method);
            }}
            usageLogDetails={data.usageLogDetails}
            attemptCounter={attemptCounter}
            incrementAttemptCounter={incrementAttemptCounter}
          />
        );
      }
      if (data.availableMethods.length === 1) {
        incrementAttemptCounter();
        setCurrentMethod(data.availableMethods[0]);
      } else {
        autofillEngineCommands?.userVerificationComplete(
          pendingOperation,
          UserVerificationResult.Failure,
          {},
          webcardId
        );
        closeWebcard();
      }
      break;
    default:
      return assertUnreachable(currentMethod);
  }
  return content;
};
