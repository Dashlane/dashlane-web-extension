import * as React from "react";
import { jsx } from "@dashlane/ui-components";
import {
  BrowseComponent,
  FollowUpNotificationActions,
  PageView,
  UserFollowUpNotificationEvent,
} from "@dashlane/hermes";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  VaultIngredient,
  vaultSourceTypeToHermesItemTypeMap,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { FollowUpNotificationWebcardData } from "@dashlane/autofill-engine/dist/autofill-engine/src/Api/types/webcards/follow-up-notification-webcard";
import { useCommunication } from "../../../context/communication";
import { I18nContext } from "../../../context/i18n";
import { InputType } from "../../../communication/types";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { FollowUpNotificationItemComponent } from "./items/FollowUpNotificationItemComponent";
import { WebcardPropsBase } from "../config";
const I18N_KEYS = {
  title: "headerTitle",
  footer: "footerInformation",
  email: "emailLabel",
  login: "loginLabel",
  username: "usernameLabel",
  secondaryLogin: "secondaryLoginLabel",
  password: "passwordLabel",
  otpCode: "otpLabel",
  accountHolder: "accountHolderLabel",
  bicSwift: "bicLabel",
  iban: "ibanLabel",
  cardNumber: "cardNumberLabel",
  securityCode: "securityCodeLabel",
  expireDate: "expireDateLabel",
};
const SX_STYLES = {
  FOOTER: {
    backgroundColor: "ds.container.agnostic.neutral.quiet",
    color: "ds.text.neutral.standard",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "16px",
    padding: "16px",
  },
};
interface Props extends WebcardPropsBase {
  data: FollowUpNotificationWebcardData;
}
export const FollowUpNotification = ({ data, closeWebcard }: Props) => {
  const { webcardData, copiedProperties } = data;
  const { autofillEngineCommands } = useCommunication();
  const { translate } = React.useContext(I18nContext);
  const [closeWebcardDelay, setCloseWebcardDelay] = React.useState(5000);
  const [copiedPropertiesList, setCopiedProperties] =
    React.useState(copiedProperties);
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.NotificationFollowUpNotification,
      browseComponent: BrowseComponent.Webcard,
    });
    autofillEngineCommands?.logEvent(
      new UserFollowUpNotificationEvent({
        action: FollowUpNotificationActions.Trigger,
        itemType: vaultSourceTypeToHermesItemTypeMap[webcardData.type],
      })
    );
  }, [autofillEngineCommands, webcardData.type]);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      closeWebcard();
    }, closeWebcardDelay);
    return () => {
      clearTimeout(timer);
    };
  }, [closeWebcard, closeWebcardDelay]);
  const onClickCopyButton = (property: VaultIngredient["property"]) => {
    setCloseWebcardDelay(7000);
    setCopiedProperties([property].concat(copiedPropertiesList));
    autofillEngineCommands?.logEvent(
      new UserFollowUpNotificationEvent({
        action: FollowUpNotificationActions.Copy,
        itemType: vaultSourceTypeToHermesItemTypeMap[webcardData.type],
      })
    );
  };
  const onCloseWebcard = () => {
    autofillEngineCommands?.logEvent(
      new UserFollowUpNotificationEvent({
        action: FollowUpNotificationActions.Dismiss,
      })
    );
    closeWebcard();
  };
  return (
    <DialogContainer
      closeWebcard={onCloseWebcard}
      headerContent={<HeaderTitle title={translate(I18N_KEYS.title)} />}
      footerContent={
        <div sx={SX_STYLES.FOOTER}>{translate(I18N_KEYS.footer)}</div>
      }
      withHeaderCloseButton
      withHeaderLogo
      withNoMainPadding
      withFooterPadding={false}
    >
      {webcardData.type === VaultSourceType.Credential ? (
        <div>
          {webcardData.email ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.Credential}
              property={"email"}
              isPropertyCopied={copiedPropertiesList.includes("email")}
              label={translate(I18N_KEYS.email)}
              value={webcardData.email}
              inputType={InputType.Text}
              autofillEngineCommands={autofillEngineCommands}
              onClickCopyButton={onClickCopyButton}
              previouslyCopiedProperties={copiedPropertiesList}
            />
          ) : null}
          {webcardData.login ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.Credential}
              property={"login"}
              isPropertyCopied={copiedPropertiesList.includes("login")}
              label={translate(I18N_KEYS.login)}
              value={webcardData.login}
              inputType={InputType.Text}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
          {webcardData.secondaryLogin ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.Credential}
              property={"secondaryLogin"}
              isPropertyCopied={copiedPropertiesList.includes("secondaryLogin")}
              label={translate(I18N_KEYS.secondaryLogin)}
              value={webcardData.secondaryLogin}
              inputType={InputType.Text}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
          {webcardData.hasPassword ? (
            <FollowUpNotificationItemComponent
              webcardId={data.webcardId}
              itemId={webcardData.itemId}
              itemType={VaultSourceType.Credential}
              property={"password"}
              isPropertyCopied={copiedPropertiesList.includes("password")}
              label={translate(I18N_KEYS.password)}
              inputType={InputType.Password}
              isCopyButtonDisabled={webcardData.hasLimitedRights}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}

          {webcardData.hasOTP ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.Credential}
              property={"otpSecret"}
              isPropertyCopied={copiedPropertiesList.includes("otpSecret")}
              label={translate(I18N_KEYS.otpCode)}
              inputType={InputType.OtpSecret}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
        </div>
      ) : null}

      {webcardData.type === VaultSourceType.BankAccount ? (
        <div>
          {webcardData.ownerName ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.BankAccount}
              property={"owner"}
              isPropertyCopied={copiedPropertiesList.includes("owner")}
              label={translate(I18N_KEYS.accountHolder)}
              value={webcardData.ownerName}
              inputType={InputType.Text}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
          {webcardData.hasIBAN ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.BankAccount}
              property={"IBAN"}
              isPropertyCopied={copiedPropertiesList.includes("IBAN")}
              label={translate(I18N_KEYS.iban)}
              inputType={InputType.IBAN}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
          {webcardData.hasBIC ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.BankAccount}
              property={"BIC"}
              isPropertyCopied={copiedPropertiesList.includes("BIC")}
              label={translate(I18N_KEYS.bicSwift)}
              inputType={InputType.BIC}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
        </div>
      ) : null}

      {webcardData.type === VaultSourceType.PaymentCard ? (
        <div>
          {webcardData.ownerName ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.PaymentCard}
              property={"ownerName"}
              isPropertyCopied={copiedPropertiesList.includes("ownerName")}
              label={translate(I18N_KEYS.accountHolder)}
              value={webcardData.ownerName}
              inputType={InputType.Text}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
          {webcardData.hasCardNumber ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.PaymentCard}
              property={"cardNumber"}
              isPropertyCopied={copiedPropertiesList.includes("cardNumber")}
              label={translate(I18N_KEYS.cardNumber)}
              inputType={InputType.CardNumber}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
          {webcardData.hasSecurityCode ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.PaymentCard}
              property={"securityCode"}
              isPropertyCopied={copiedPropertiesList.includes("securityCode")}
              label={translate(I18N_KEYS.securityCode)}
              inputType={InputType.SecurityCode}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
          {webcardData.expireDate ? (
            <FollowUpNotificationItemComponent
              itemId={webcardData.itemId}
              webcardId={data.webcardId}
              itemType={VaultSourceType.PaymentCard}
              property={"expireDate"}
              isPropertyCopied={copiedPropertiesList.includes("expireDate")}
              label={translate(I18N_KEYS.expireDate)}
              inputType={InputType.ExpireDate}
              autofillEngineCommands={autofillEngineCommands}
              previouslyCopiedProperties={copiedPropertiesList}
              onClickCopyButton={onClickCopyButton}
            />
          ) : null}
        </div>
      ) : null}
    </DialogContainer>
  );
};
