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
  FollowUpNotificationWebcardData,
  VaultIngredient,
  vaultSourceTypeToHermesItemTypeMap,
  VaultTypeToAuditLogTypeFields,
} from "@dashlane/autofill-engine/types";
import { useCommunication } from "../../../context/communication";
import { I18nContext } from "../../../context/i18n";
import { InputType } from "../../../communication/types";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { FollowUpNotificationItemComponent } from "./items/FollowUpNotificationItemComponent";
import { WebcardPropsBase } from "../config";
import { Paragraph } from "@dashlane/design-system";
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
  const copySensitiveInfo = <
    T extends
      | VaultSourceType.Credential
      | VaultSourceType.BankAccount
      | VaultSourceType.PaymentCard
  >(
    property: VaultIngredient["property"],
    activityLogProperty: VaultTypeToAuditLogTypeFields[T]
  ): void => {
    onClickCopyButton(property);
    let login: string | undefined = undefined;
    if (webcardData.type === VaultSourceType.Credential) {
      login = webcardData.login ? webcardData.login : webcardData.email;
    }
    autofillEngineCommands?.sendPropertyCopiedActivityLog({
      itemType: webcardData.type,
      field: activityLogProperty,
      title: webcardData.title,
      login,
    });
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
        <div sx={{ padding: "0 8px 8px 8px", textAlign: "center" }}>
          <Paragraph
            textStyle="ds.body.helper.regular"
            color="ds.text.neutral.standard"
          >
            {translate(I18N_KEYS.footer)}
          </Paragraph>
        </div>
      }
      withHeaderCloseButton
      withHeaderLogo
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
              onClickCopyButton={(copiedProperty) =>
                copySensitiveInfo<VaultSourceType.Credential>(
                  copiedProperty,
                  "password"
                )
              }
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
              onClickCopyButton={(copiedProperty) =>
                copySensitiveInfo<VaultSourceType.Credential>(
                  copiedProperty,
                  "otp"
                )
              }
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
              onClickCopyButton={(copiedProperty) =>
                copySensitiveInfo<VaultSourceType.BankAccount>(
                  copiedProperty,
                  "iban"
                )
              }
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
              onClickCopyButton={(copiedProperty) =>
                copySensitiveInfo<VaultSourceType.BankAccount>(
                  copiedProperty,
                  "swift"
                )
              }
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
              onClickCopyButton={(copiedProperty) =>
                copySensitiveInfo<VaultSourceType.PaymentCard>(
                  copiedProperty,
                  "number"
                )
              }
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
              onClickCopyButton={(copiedProperty) =>
                copySensitiveInfo<VaultSourceType.PaymentCard>(
                  copiedProperty,
                  "cvv"
                )
              }
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
