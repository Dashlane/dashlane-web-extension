import {
  MasterPasswordWebcardData,
  NeverAskAgainMode,
  PendingOperationType,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { Infobox, jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import {
  AnonymousAutofillDismissEvent,
  BrowseComponent,
  DismissType,
  DomainType,
  hashDomain,
  PageView,
  UserAutofillDismissEvent,
} from "@dashlane/hermes";
import {
  Checkbox,
  GridChild,
  GridContainer,
  Paragraph,
  PasswordInput,
} from "@dashlane/ui-components";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { KEYBOARD_EVENTS } from "../../../constants";
import { useCommunication } from "../../../context/communication";
import { I18nContext } from "../../../context/i18n";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { useWebcardVisibilityChecker } from "../../common/hooks/visibilityChecker";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import styles from "./MasterPassword.module.scss";
import DOMPurify from "dompurify";
const I18N_KEYS = {
  alwaysAuthorize: "alwaysAuthorize",
  TITLE: "title",
  UNLOCK_CONTENT: "unlockContent",
  HIDE: "hide",
  SHOW: "show",
  ENTER_MASTER_PASSWORD: "enterMasterPassword",
  WRONG_PASSWORD: "wrongPassword",
  NEVER_ASK_AGAIN: "neverAskAgainCredentialCheckbox",
  NEVER_ASK_AGAIN_ANY: "neverAskAgainAnyCredentialCheckbox",
  NEVER_ASK_AGAIN_INFOBOX: "neverAskAgainAnyCredentialInfobox",
  LOGGED_IN: "loggedIn",
  EMAIL_HELP: "emailHelpText",
  CANCEL: "cancel",
  UNLOCK: "unlock",
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  LOGGED_IN_INFO: {
    color: "ds.text.neutral.quiet",
    paddingTop: "8px",
    display: "flex",
    alignItems: "center",
  },
  LOGGED_IN_INFO_TEXT: {
    paddingRight: "4px",
    "& > span": {
      color: "ds.text.brand.quiet",
    },
  },
};
export interface MasterPasswordProps extends WebcardPropsBase {
  data: MasterPasswordWebcardData;
}
export const MasterPassword = ({ data, closeWebcard }: MasterPasswordProps) => {
  const { translate } = useContext(I18nContext);
  const {
    autofillEngineCommands,
    autofillEngineDispatcher,
    setAutofillEngineActionsHandlers,
  } = useCommunication();
  const checkWebcardVisible = useWebcardVisibilityChecker({
    webcardId: data.webcardId,
    autofillEngineDispatcher,
    closeWebcard,
  });
  const { tabRootDomain } = data;
  const [password, setPassword] = useState<string>("");
  const [neverAskMeAgain, setNeverAskMeAgain] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillNotificationAuthenticate,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const setMasterPassword = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (password !== newPassword) {
      setWrongPassword(false);
    }
    await checkWebcardVisible();
  };
  setAutofillEngineActionsHandlers?.({
    setMasterPasswordValidationResult: (isPasswordValidated: boolean) => {
      setWrongPassword(!isPasswordValidated);
      if (isPasswordValidated) {
        if (
          neverAskMeAgain &&
          data.pendingOperation.type ===
            PendingOperationType.ApplyAutofillDetails
        ) {
          autofillEngineCommands?.disableAccessProtectionForVaultItem(
            data.pendingOperation.data.dataSource.vaultId
          );
        }
        autofillEngineCommands?.userValidatedMasterPassword(
          data.pendingOperation,
          data.webcardId
        );
        if (data.pendingOperation.type !== PendingOperationType.CopyValue) {
          closeWebcard();
        }
      }
    },
  });
  const cancelWebauthnOperation = () => {
    if (data.pendingOperation.type === PendingOperationType.Webauthn) {
      autofillEngineCommands?.webauthnUserCanceled(
        data.pendingOperation.request
      );
    }
  };
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
    cancelWebauthnOperation();
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
    cancelWebauthnOperation();
    closeWebcard();
  };
  const onSubmit = () => {
    autofillEngineCommands?.validateMasterPassword(password);
  };
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_EVENTS.ESCAPE) {
        onClose({ withEscapeKey: true });
      }
    };
    window.addEventListener("keyup", closeOnEscape);
    return () => window.removeEventListener("keyup", closeOnEscape);
  }, []);
  const neverAskAgainCheckbox = useMemo((): JSX.Element | null => {
    switch (data.neverAskAgainMode) {
      case NeverAskAgainMode.Global:
        return (
          <GridContainer
            sx={{ margin: "12px 0px", rowGap: "12px" }}
            alignItems="flex-start"
            gridTemplateAreas="'checkbox label' 'info info'"
            gridTemplateColumns="min-content auto"
          >
            <Checkbox
              name="alwaysAskMPCheckbox"
              checked={neverAskMeAgain}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNeverAskMeAgain(e.target.checked);
              }}
            />
            <Paragraph size="small">
              {translate(I18N_KEYS.NEVER_ASK_AGAIN_ANY)}
            </Paragraph>
            <GridChild gridArea="info">
              <Infobox
                title={translate(I18N_KEYS.NEVER_ASK_AGAIN_INFOBOX)}
                mood="warning"
              />
            </GridChild>
          </GridContainer>
        );
      case NeverAskAgainMode.VaultItem:
        return (
          <Checkbox
            name="alwaysAskMPCheckbox"
            checked={neverAskMeAgain}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNeverAskMeAgain(e.target.checked);
            }}
            sx={{ margin: "12px 0px" }}
            label={translate(I18N_KEYS.NEVER_ASK_AGAIN)}
          />
        );
      default:
        return null;
    }
  }, [data.neverAskAgainMode, neverAskMeAgain, setNeverAskMeAgain, translate]);
  const loggedIn = translate(I18N_KEYS.LOGGED_IN, {
    0: data.userLogin,
  });
  const sanitizedLoggedIn = DOMPurify.sanitize(loggedIn);
  return (
    <DialogContainer
      closeWebcard={onClose}
      headerContent={<HeaderTitle title={translate(I18N_KEYS.TITLE)} />}
      withFooterDivider
      withHeaderCloseButton
      withHeaderLogo
    >
      <form
        className={styles.main}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <PasswordInput
          autoFocus
          hidePasswordTooltipText={translate(I18N_KEYS.HIDE)}
          showPasswordTooltipText={translate(I18N_KEYS.SHOW)}
          placeholder={translate(I18N_KEYS.ENTER_MASTER_PASSWORD)}
          value={password}
          onChange={setMasterPassword}
          feedbackType={wrongPassword ? "error" : undefined}
          feedbackText={
            wrongPassword ? translate(I18N_KEYS.WRONG_PASSWORD) : undefined
          }
        />
        <div
          id="master-password-logged-in"
          className={styles.loggedInInfo}
          sx={SX_STYLES.LOGGED_IN_INFO}
        >
          <span
            className={styles.loggedInInfoText}
            dangerouslySetInnerHTML={{
              __html: sanitizedLoggedIn,
            }}
          />
        </div>
        {neverAskAgainCheckbox}

        <div className={styles.buttonsContainer}>
          <SecondaryActionButton
            onClick={onCancel}
            label={translate(I18N_KEYS.CANCEL)}
          />
          <PrimaryActionButton
            disabled={!password}
            onClick={onSubmit}
            label={translate(I18N_KEYS.UNLOCK)}
          />
        </div>
      </form>
    </DialogContainer>
  );
};
