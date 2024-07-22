import * as React from "react";
import { Button } from "@dashlane/design-system";
import { Paragraph } from "@dashlane/ui-components";
import {
  AnonymousAutofillAcceptEvent,
  BrowseComponent,
  DomainType,
  hashDomain,
  PageView,
  UserAutofillAcceptEvent,
} from "@dashlane/hermes";
import {
  WebAuthnReactivationWebcardData,
  WebAuthnStatus,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { startAssertion } from "../../../utils/webAuthn/credential";
import { DropdownContainer } from "../../common/layout/DropdownContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import styles from "./WebAuthnReactivation.module.scss";
interface Props extends WebcardPropsBase {
  data: WebAuthnReactivationWebcardData;
}
const I18N_KEYS = {
  BASE: {
    dontAskAgain: "webAuthnReactivationDontAskAgain",
    fallbackButton: "webAuthnReactivationFallbackToMasterPassword",
    header: "webAuthnReactivationHeader",
    loginButton: "webAuthnReactivationLoginButton",
  },
  ERROR: {
    message: "webAuthnReactivationErrorMessage",
    loginButton: "webAuthnReactivationLoginButtonError",
  },
};
export const WebAuthnReactivation = ({ closeWebcard, data }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands, setAutofillEngineActionsHandlers } =
    useCommunication();
  const { extensionShortcuts, tabRootDomain } = data;
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownReactivationBiometrics,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const logEventAutofillAccept = () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList: [],
      })
    );
    (async () => {
      autofillEngineCommands?.logEvent(
        new AnonymousAutofillAcceptEvent({
          domain: {
            type: DomainType.Web,
            id: await hashDomain(tabRootDomain ?? ""),
          },
        })
      );
    })();
  };
  const onLoginWithMasterPassword = async () => {
    logEventAutofillAccept();
    autofillEngineCommands?.openWebapp({ route: "/askmp" });
    closeWebcard();
  };
  const onLoginWithWebAuthn = async () => {
    setError(false);
    logEventAutofillAccept();
    autofillEngineCommands?.startWebAuthnLoginFlow();
  };
  React.useEffect(() => {
    setAutofillEngineActionsHandlers?.({
      updateWebAuthnChallenge: async ({ login, publicKeyOptions }) => {
        try {
          const credential = await startAssertion(publicKeyOptions);
          autofillEngineCommands?.completeWebAuthnLoginFlow(login, credential);
        } catch {
          setError(true);
        }
      },
      updateWebAuthnStatus: (status: WebAuthnStatus) => {
        if (status === WebAuthnStatus.Success) {
          closeWebcard();
        } else {
          setError(true);
        }
      },
    });
  }, [autofillEngineCommands, closeWebcard, setAutofillEngineActionsHandlers]);
  const onNeverAgain = () => {
    autofillEngineCommands?.disableReactivationWebcards();
    closeWebcard();
  };
  return (
    <DropdownContainer
      closeWebcard={closeWebcard}
      extensionShortcuts={extensionShortcuts}
      headerContent={<HeaderTitle title={translate(I18N_KEYS.BASE.header)} />}
      webcardData={data}
      withHeaderCloseButton
      withHeaderLogo
    >
      <div className={styles.main}>
        {error && (
          <Paragraph
            color="errors.5"
            sx={{
              fontSize: "14px",
              fontWeight: "light",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            {translate(I18N_KEYS.ERROR.message)}
          </Paragraph>
        )}
        <Button
          type="button"
          mood="brand"
          intensity="catchy"
          fullsize={true}
          onClick={onLoginWithWebAuthn}
          size="small"
        >
          {translate(
            error ? I18N_KEYS.ERROR.loginButton : I18N_KEYS.BASE.loginButton
          )}
        </Button>
        <Button
          type="button"
          mood="brand"
          intensity="quiet"
          fullsize={true}
          onClick={onLoginWithMasterPassword}
          size="small"
        >
          {translate(I18N_KEYS.BASE.fallbackButton)}
        </Button>
        <Button
          type="button"
          mood="neutral"
          intensity="quiet"
          fullsize={true}
          onClick={onNeverAgain}
          size="small"
        >
          {translate(I18N_KEYS.BASE.dontAskAgain)}
        </Button>
      </div>
    </DropdownContainer>
  );
};
