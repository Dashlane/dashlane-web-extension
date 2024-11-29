import { Icon, Infobox, jsx, Paragraph } from "@dashlane/design-system";
import {
  BrowseComponent,
  CeremonyStatus,
  Mode,
  PageView,
  UserUserVerificationAttemptedEvent,
  UserUserVerificationCompletedEvent,
} from "@dashlane/hermes";
import { Fragment, useEffect, useState } from "react";
import { useCommunication } from "../../../../context/communication";
import { useTranslate } from "../../../../context/i18n";
import { PrimaryActionButton } from "../../../common/generic/buttons/PrimaryActionButton";
import { SecondaryActionButton } from "../../../common/generic/buttons/SecondaryActionButton";
import { UserVerificationPanelProps } from "./UserVerificationPanelProps";
import { SX_STYLES } from "./WebauthnPanel.styles";
import { useWebAuthnHook } from "./useWebAuthnHook";
import { WebAuthnStatus } from "@dashlane/autofill-engine/types";
export const I18N_KEYS = {
  TITLE: "webauthnPanelTitle",
  TRY_AGAIN: "tryAgain",
  CANCEL: "cancel",
  WEBAUTHN_GENERIC_ERROR_TITLE: "webauthnGenericErrorTitle",
  WEBAUTHN_GENERIC_ERROR_DESCRIPTION: "webauthnGenericErrorDescription",
};
export const WebauthnPanel = ({
  onVerificationSucessful,
  onCancel,
  makeUserVerificationDialog,
  usageLogDetails,
  attemptCounter,
  incrementAttemptCounter,
}: UserVerificationPanelProps) => {
  const { translate } = useTranslate();
  const [errorMessage, setErrorMessage] = useState<
    | {
        title: string;
        description: string;
      }
    | undefined
  >(undefined);
  const { autofillEngineCommands } = useCommunication();
  const { startWebauthnFlow, abortWebauthnFlow } = useWebAuthnHook((status) => {
    if (status === WebAuthnStatus.Success) {
      onVerificationSucessful();
    } else {
      setErrorMessage({
        title: I18N_KEYS.WEBAUTHN_GENERIC_ERROR_TITLE,
        description: I18N_KEYS.WEBAUTHN_GENERIC_ERROR_DESCRIPTION,
      });
    }
  });
  const tryAgain = () => {
    incrementAttemptCounter();
    setErrorMessage(undefined);
    startWebauthnFlow();
  };
  const onWebauthnFlowCancel = () => {
    abortWebauthnFlow();
    onCancel();
  };
  useEffect(() => {
    const pageView =
      errorMessage === undefined
        ? PageView.AutofillNotificationAuthenticatePasskeyUserVerificationBiometric
        : PageView.AutofillNotificationAuthenticatePasskeyUserVerificationError;
    autofillEngineCommands?.logPageView({
      pageView,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands, errorMessage]);
  useEffect(() => {
    const event =
      errorMessage === undefined
        ? new UserUserVerificationAttemptedEvent({
            attemptNum: attemptCounter,
            verificationMethod: Mode.Biometric,
            ...usageLogDetails,
          })
        : new UserUserVerificationCompletedEvent({
            attemptNum: attemptCounter,
            status: CeremonyStatus.Failure,
            verificationMethod: Mode.Biometric,
            ...usageLogDetails,
          });
    autofillEngineCommands?.logEvent(event);
  }, [attemptCounter, autofillEngineCommands, errorMessage, usageLogDetails]);
  useEffect(() => {
    startWebauthnFlow();
    return () => {
      abortWebauthnFlow();
    };
  }, [abortWebauthnFlow, startWebauthnFlow]);
  const content = (
    <div sx={SX_STYLES.CONTAINER}>
      {errorMessage ? (
        <Infobox
          title={translate(errorMessage.title)}
          description={translate(errorMessage.description)}
          mood="danger"
        />
      ) : (
        <Fragment>
          <Paragraph
            textStyle="ds.body.standard.regular"
            sx={{ textAlign: "center" }}
          >
            {translate(I18N_KEYS.TITLE)}
          </Paragraph>
          <div sx={SX_STYLES.ICON_CONTAINER}>
            <Icon
              sx={SX_STYLES.ICON}
              name="FingerprintOutlined"
              size="xlarge"
              color="ds.text.brand.quiet"
            />
          </div>
        </Fragment>
      )}
    </div>
  );
  const customFooter = errorMessage ? (
    <PrimaryActionButton
      onClick={tryAgain}
      label={translate(I18N_KEYS.TRY_AGAIN)}
    />
  ) : (
    <SecondaryActionButton
      onClick={onWebauthnFlowCancel}
      label={translate(I18N_KEYS.CANCEL)}
    />
  );
  return makeUserVerificationDialog(
    content,
    customFooter,
    () => {},
    () => {
      abortWebauthnFlow();
    }
  );
};
