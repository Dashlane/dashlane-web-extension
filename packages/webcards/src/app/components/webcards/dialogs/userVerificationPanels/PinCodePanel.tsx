import { Infobox, jsx, Paragraph, PinField } from "@dashlane/design-system";
import {
  BrowseComponent,
  CeremonyStatus,
  Mode,
  PageView,
  UserUserVerificationAttemptedEvent,
  UserUserVerificationCompletedEvent,
} from "@dashlane/hermes";
import { useContext, useEffect, useRef, useState } from "react";
import { useCommunication } from "../../../../context/communication";
import { I18nContext } from "../../../../context/i18n";
import { PrimaryActionButton } from "../../../common/generic/buttons/PrimaryActionButton";
import { SecondaryActionButton } from "../../../common/generic/buttons/SecondaryActionButton";
import { useWebcardVisibilityChecker } from "../../../common/hooks/visibilityChecker";
import { UserVerificationPanelProps } from "./UserVerificationPanelProps";
import { SX_STYLES } from "./PinCodePanel.styles";
export const I18N_KEYS = {
  HIDE: "hide",
  SHOW: "show",
  TYPE_YOUR_PIN: "typeYourPin",
  PIN_CODE: "pinCode",
  TWO_ATTEMPTS_LEFT: "incorrectPinFirstAttempt",
  ONE_ATTEMPT_LEFT: "incorrectPinSecondAttempt",
  MAX_PIN_ATTEMPTS_REACHED: "maxPinAttemptsReached",
  YOUR_PIN_HAS_BEEN_DISABLED: "maxPinAttemptsReachedPinDisabled",
  LOGIN_TO_DASHLANE: "loginToDashlane",
  SOMETHING_WENT_WRONG: "somethingWentWrong",
  COULD_NOT_UNLOCK: "couldNotUnlock",
  TRY_AGAIN: "tryAgain",
  CANCEL: "cancel",
};
export interface PinCodePanelProps extends UserVerificationPanelProps {
  readonly webcardId: string;
  readonly closeWebcard: () => void;
}
export const PinCodePanel = ({
  webcardId,
  closeWebcard,
  onVerificationSucessful,
  onCancel,
  makeUserVerificationDialog,
  attemptCounter,
  incrementAttemptCounter,
  usageLogDetails,
}: PinCodePanelProps) => {
  const { translate } = useContext(I18nContext);
  const {
    autofillEngineCommands,
    autofillEngineDispatcher,
    setAutofillEngineActionsHandlers,
  } = useCommunication();
  const checkWebcardVisible = useWebcardVisibilityChecker({
    webcardId: webcardId,
    autofillEngineDispatcher,
    closeWebcard,
  });
  const [pin, setPin] = useState<string>("");
  const [wrongPin, setWrongPin] = useState(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const validatingPinCodeTimeout = useRef<NodeJS.Timeout>();
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState<boolean>(false);
  useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView:
        PageView.AutofillNotificationAuthenticatePasskeyUserVerificationPin,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  useEffect(() => {
    const event = !wrongPin
      ? new UserUserVerificationAttemptedEvent({
          attemptNum: attemptCounter,
          verificationMethod: Mode.Pin,
          ...usageLogDetails,
        })
      : new UserUserVerificationCompletedEvent({
          attemptNum: attemptCounter,
          status: CeremonyStatus.Failure,
          verificationMethod: Mode.Pin,
          ...usageLogDetails,
        });
    autofillEngineCommands?.logEvent(event);
  }, [attemptCounter, autofillEngineCommands, usageLogDetails, wrongPin]);
  const onPinChange = async (newPin: string) => {
    setPin(newPin);
    if (wrongPin && pin !== newPin) {
      incrementAttemptCounter();
      setWrongPin(false);
    }
    await checkWebcardVisible();
  };
  const onPinComplete = async (newPin: string) => {
    setIsValidating(true);
    autofillEngineCommands?.validatePinCode(newPin);
    if (attemptsLeft <= 1) {
      validatingPinCodeTimeout.current = setTimeout(() => {
        setMaxAttemptsReached(true);
        setIsValidating(false);
      }, 500);
    }
  };
  const onCloseMaxAttemptsReached = () => {
    window.parent.postMessage("closeUVwebcard", "*");
  };
  const onLoginToDashlane = () => {
    window.open("__REDACTED__", "_blank");
    onCloseMaxAttemptsReached();
  };
  const onTryAgain = () => {
    setSomethingWentWrong(false);
  };
  const getWrongPinFeedback = () => {
    if (wrongPin) {
      switch (attemptsLeft) {
        case 2:
          return { text: translate(I18N_KEYS.TWO_ATTEMPTS_LEFT) };
        case 1:
          return { text: translate(I18N_KEYS.ONE_ATTEMPT_LEFT) };
      }
    }
    return undefined;
  };
  setAutofillEngineActionsHandlers?.({
    setPinCodeValidationResult: (
      data:
        | {
            success: true;
            isPinCodeCorrect: boolean;
            remainingAttempts: number;
          }
        | {
            success: false;
          }
    ) => {
      validatingPinCodeTimeout.current &&
        clearTimeout(validatingPinCodeTimeout.current);
      setIsValidating(false);
      if (!data.success) {
        setSomethingWentWrong(true);
        return;
      }
      const { isPinCodeCorrect, remainingAttempts } = data;
      setWrongPin(!isPinCodeCorrect);
      setAttemptsLeft(remainingAttempts);
      setMaxAttemptsReached(remainingAttempts <= 0);
      if (isPinCodeCorrect) {
        onVerificationSucessful();
      }
    },
  });
  if (somethingWentWrong) {
    return makeUserVerificationDialog(
      <Infobox
        sx={SX_STYLES.INFO_BOX}
        title={translate(I18N_KEYS.SOMETHING_WENT_WRONG)}
        description={translate(I18N_KEYS.COULD_NOT_UNLOCK)}
        mood="danger"
      />,
      <SecondaryActionButton
        onClick={onTryAgain}
        label={translate(I18N_KEYS.TRY_AGAIN)}
      />
    );
  }
  if (maxAttemptsReached) {
    return makeUserVerificationDialog(
      <Infobox
        sx={SX_STYLES.INFO_BOX}
        title={translate(I18N_KEYS.MAX_PIN_ATTEMPTS_REACHED)}
        description={translate(I18N_KEYS.YOUR_PIN_HAS_BEEN_DISABLED)}
        mood="danger"
      />,
      <PrimaryActionButton
        onClick={onLoginToDashlane}
        label={translate(I18N_KEYS.LOGIN_TO_DASHLANE)}
      />,
      onCloseMaxAttemptsReached
    );
  }
  return makeUserVerificationDialog(
    <div sx={SX_STYLES.TYPE_YOUR_PIN}>
      <Paragraph>{translate(I18N_KEYS.TYPE_YOUR_PIN)}</Paragraph>
      <PinField
        error={wrongPin}
        label={translate(I18N_KEYS.PIN_CODE)}
        onPinComplete={onPinComplete}
        onPinChange={onPinChange}
        feedback={getWrongPinFeedback()}
        isValidating={isValidating}
        data-testid="passkey-uv-pin-field"
      />
    </div>,
    <SecondaryActionButton
      onClick={onCancel}
      label={translate(I18N_KEYS.CANCEL)}
    />
  );
};
