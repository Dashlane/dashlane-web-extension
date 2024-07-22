import { jsx, Paragraph, PasswordField } from "@dashlane/design-system";
import {
  BrowseComponent,
  CeremonyStatus,
  Mode,
  PageView,
  UserUserVerificationAttemptedEvent,
  UserUserVerificationCompletedEvent,
} from "@dashlane/hermes";
import { Fragment, useContext, useEffect, useState } from "react";
import { useCommunication } from "../../../../context/communication";
import { I18nContext } from "../../../../context/i18n";
import { PrimaryActionButton } from "../../../common/generic/buttons/PrimaryActionButton";
import { SecondaryActionButton } from "../../../common/generic/buttons/SecondaryActionButton";
import { useWebcardVisibilityChecker } from "../../../common/hooks/visibilityChecker";
import { UserVerificationPanelProps } from "./UserVerificationPanelProps";
import { SX_STYLES } from "./MasterPasswordPanel.styles";
import DOMPurify from "dompurify";
export const I18N_KEYS = {
  HIDE: "hide",
  SHOW: "show",
  ENTER_MASTER_PASSWORD: "enterMasterPassword",
  WRONG_PASSWORD: "wrongPassword",
  LOGGED_IN: "loggedIn",
  CANCEL: "cancel",
  UNLOCK: "unlock",
};
export interface MasterPasswordPanelProps extends UserVerificationPanelProps {
  readonly webcardId: string;
  readonly userLogin: string;
  readonly closeWebcard: () => void;
}
export const MasterPasswordPanel = ({
  webcardId,
  userLogin,
  closeWebcard,
  onVerificationSucessful,
  onCancel,
  makeUserVerificationDialog,
  attemptCounter,
  incrementAttemptCounter,
  usageLogDetails,
}: MasterPasswordPanelProps) => {
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
  const [password, setPassword] = useState<string>("");
  const [wrongPassword, setWrongPassword] = useState(false);
  useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView:
        PageView.AutofillNotificationAuthenticatePasskeyUserVerificationMasterPassword,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  useEffect(() => {
    const event = !wrongPassword
      ? new UserUserVerificationAttemptedEvent({
          attemptNum: attemptCounter,
          verificationMethod: Mode.MasterPassword,
          ...usageLogDetails,
        })
      : new UserUserVerificationCompletedEvent({
          attemptNum: attemptCounter,
          status: CeremonyStatus.Failure,
          verificationMethod: Mode.MasterPassword,
          ...usageLogDetails,
        });
    autofillEngineCommands?.logEvent(event);
  }, [attemptCounter, autofillEngineCommands, usageLogDetails, wrongPassword]);
  const setMasterPassword = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (wrongPassword && password !== newPassword) {
      incrementAttemptCounter();
      setWrongPassword(false);
    }
    await checkWebcardVisible();
  };
  setAutofillEngineActionsHandlers?.({
    setMasterPasswordValidationResult: (isPasswordValidated: boolean) => {
      setWrongPassword(!isPasswordValidated);
      if (isPasswordValidated) {
        onVerificationSucessful();
      }
    },
  });
  const onSubmit = () => {
    autofillEngineCommands?.validateMasterPassword(password);
  };
  const loggedIn = translate(I18N_KEYS.LOGGED_IN, {
    0: userLogin,
  });
  const sanitizedLoggedIn = DOMPurify.sanitize(loggedIn);
  const content = (
    <form
      sx={SX_STYLES.MASTERPASSWORD_PANEL_CONTAINER}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <PasswordField
        autoFocus
        toggleVisibilityLabel={{
          hide: translate(I18N_KEYS.HIDE),
          show: translate(I18N_KEYS.SHOW),
        }}
        placeholder={translate(I18N_KEYS.ENTER_MASTER_PASSWORD)}
        value={password}
        onChange={setMasterPassword}
        error={wrongPassword}
        feedback={
          wrongPassword ? translate(I18N_KEYS.WRONG_PASSWORD) : undefined
        }
        label={translate(I18N_KEYS.ENTER_MASTER_PASSWORD)}
        labelPersists={false}
      />
      <div sx={SX_STYLES.LOGGED_IN_INFO}>
        <Paragraph
          sx={SX_STYLES.LOGGED_IN_INFO_TEXT}
          as="span"
          textStyle="ds.body.helper.regular"
          dangerouslySetInnerHTML={{
            __html: sanitizedLoggedIn,
          }}
        />
      </div>
    </form>
  );
  const customFooter = (
    <Fragment>
      <SecondaryActionButton
        onClick={onCancel}
        label={translate(I18N_KEYS.CANCEL)}
      />
      <PrimaryActionButton
        disabled={!password}
        onClick={onSubmit}
        label={translate(I18N_KEYS.UNLOCK)}
      />
    </Fragment>
  );
  return makeUserVerificationDialog(content, customFooter);
};
