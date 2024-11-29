import { ChangeEvent, useCallback, useState } from "react";
import { PaymentCard, PaymentCardColorType } from "@dashlane/vault-contracts";
import {
  Field,
  ItemType,
  UserCopyVaultItemFieldEvent,
  UserRevealVaultItemFieldEvent,
} from "@dashlane/hermes";
import {
  Button,
  ObfuscatedField,
  SelectField,
  SelectOption,
  TextArea,
  TextField,
} from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { CopyToClipboardButton } from "../../../credentials/edit/copy-to-clipboard-control";
import { useProtectedItemsUnlocker } from "../../../unlock-items";
import { LockedItemType, UnlockerAction } from "../../../unlock-items/types";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../../space-select/space-select";
import { ContentCard } from "../../../panel/standard/content-card";
import { ExpiryDatePicker } from "./expiry-date-picker";
import { useActivityLogReport } from "../../../hooks/use-activity-log-report";
export const I18N_KEYS = {
  FIELD_OWNERNAME: "webapp_payment_edition_field_ownerName",
  FIELD_PLACEHOLDER_NO_OWNERNAME:
    "webapp_payment_edition_field_placeholder_no_ownerName",
  FIELD_CARDNUMBER: "webapp_payment_edition_field_cardNumber",
  FIELD_PLACEHOLDER_NO_CARDNUMBER:
    "webapp_payment_edition_field_placeholder_no_cardNumber",
  FIELD_SECURITYCODE: "webapp_payment_edition_field_securityCode",
  FIELD_PLACEHOLDER_NO_SECURITYCODE:
    "webapp_payment_edition_field_placeholder_no_securityCode",
  FIELD_CARD_ACTION_SHOW_CARD_NUMBER:
    "webapp_payment_edition_field_card_action_show_card_number",
  FIELD_CARD_ACTION_HIDE_CARD_NUMBER:
    "webapp_payment_edition_field_card_action_hide_card_number",
  FIELD_CARD_ACTION_SHOW_SECURITY_CODE:
    "webapp_payment_edition_field_card_action_show_security_code",
  FIELD_CARD_ACTION_HIDE_SECURITY_CODE:
    "webapp_payment_edition_field_card_action_hide_security_code",
  FIELD_CARD_ACTION_SHOW_NOTE:
    "webapp_payment_edition_field_card_action_show_note",
  FIELD_CARD_ACTION_HIDE_NOTE:
    "webapp_payment_edition_field_card_action_hide_note",
  FIELD_CARD_ACTION_COPY_CARD_NUMBER:
    "webapp_payment_edition_field_card_action_copy_card_number",
  FIELD_CARD_ACTION_COPY_SECURITY_CODE:
    "webapp_payment_edition_field_card_action_copy_security_code",
  FIELD_CARD_ACTION_COPY_NOTE:
    "webapp_payment_edition_field_card_action_copy_note",
  FIELD_EXPIREDATE: "webapp_payment_edition_field_expireDate",
  FIELD_CARDNAME: "webapp_payment_edition_field_cardname",
  FIELD_PLACEHOLDER_NO_CARDNAME:
    "webapp_payment_edition_field_placeholder_no_cardname",
  FIELD_CARDCOLOR_LABEL: "webapp_payment_edition_field_cardColor",
  FIELD_CARDCOLOR: "webapp_payment_edition_field_cardColor_",
  FIELD_NOTES: "webapp_payment_edition_field_notes",
  FIELD_PLACEHOLDER_NO_NOTES:
    "webapp_payment_edition_field_placeholder_no_notes",
  FIELD_CARDNUMBER_COPIED: "webapp_payment_edition_field_cardNumber_copied",
  FIELD_SECURITYCODE_COPIED: "webapp_payment_edition_field_securityCode_copied",
  FIELD_NOTE_COPIED: "webapp_payment_edition_field_notes_copied",
  DETAILS_CONTENT_LABEL: "webapp_payment_edition_content_card_details_label",
  ORGANIZATION_CONTENT_LABEL:
    "webapp_payment_edition_content_card_organization_label",
};
type PaymentCardField = Field.CardNumber | Field.SecurityCode | Field.Note;
export type PaymentCardFormFields = Pick<
  PaymentCard,
  | "cardNumber"
  | "color"
  | "expireMonth"
  | "expireYear"
  | "itemName"
  | "note"
  | "ownerName"
  | "securityCode"
  | "spaceId"
>;
interface PaymentCardFormProps {
  itemId?: string;
  errors?: Set<keyof PaymentCardFormFields>;
  paymentCardContent: PaymentCardFormFields;
  onValueChanged: (
    newPaymentCardContent: Partial<PaymentCardFormFields>
  ) => void;
  showCopyAlert?: (text: string) => void;
  variant?: "add" | "edit";
}
const copyLogEvent =
  (field: PaymentCardField) => (itemId: string | undefined) => {
    if (itemId) {
      logEvent(
        new UserCopyVaultItemFieldEvent({
          itemType: ItemType.CreditCard,
          field,
          itemId,
          isProtected: true,
        })
      );
    }
  };
const PaymentCardColorTypeToKeyDictionary: Record<
  PaymentCardColorType,
  string
> = {
  [PaymentCardColorType.Black]: `${I18N_KEYS.FIELD_CARDCOLOR}BLACK`,
  [PaymentCardColorType.Blue1]: `${I18N_KEYS.FIELD_CARDCOLOR}BLUE_1`,
  [PaymentCardColorType.Blue2]: `${I18N_KEYS.FIELD_CARDCOLOR}BLUE_2`,
  [PaymentCardColorType.Gold]: `${I18N_KEYS.FIELD_CARDCOLOR}GOLD`,
  [PaymentCardColorType.Green1]: `${I18N_KEYS.FIELD_CARDCOLOR}GREEN_1`,
  [PaymentCardColorType.Green2]: `${I18N_KEYS.FIELD_CARDCOLOR}GREEN_2`,
  [PaymentCardColorType.Orange]: `${I18N_KEYS.FIELD_CARDCOLOR}ORANGE`,
  [PaymentCardColorType.Red]: `${I18N_KEYS.FIELD_CARDCOLOR}RED`,
  [PaymentCardColorType.Silver]: `${I18N_KEYS.FIELD_CARDCOLOR}SILVER`,
  [PaymentCardColorType.White]: `${I18N_KEYS.FIELD_CARDCOLOR}WHITE`,
};
export const PaymentCardForm = ({
  itemId,
  errors,
  paymentCardContent,
  onValueChanged,
  showCopyAlert,
  variant,
}: PaymentCardFormProps) => {
  const {
    cardNumber,
    color,
    expireMonth,
    expireYear,
    itemName,
    note,
    ownerName,
    securityCode = "",
    spaceId,
  } = paymentCardContent;
  const { translate } = useTranslate();
  const { shouldShowFrozenStateDialog: isDisabled } = useFrozenState();
  const { logRevealCreditCardField, logCopiedCreditCardField } =
    useActivityLogReport();
  const hasCardNumber = Boolean(cardNumber.length);
  const hasSecurityCode = Boolean(securityCode.length);
  const hasNote = Boolean(note.length);
  const hasTeamSpaceId = Boolean(spaceId);
  const handleContentChanged = useCallback(
    (field: keyof PaymentCard) =>
      (
        eventOrValue:
          | ChangeEvent<
              HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >
          | string
      ) => {
        const updatedValue =
          typeof eventOrValue === "string"
            ? eventOrValue
            : eventOrValue.target.value;
        const value =
          field === "cardNumber"
            ? updatedValue.replaceAll(" ", "")
            : updatedValue;
        onValueChanged({
          [field]: value,
        });
      },
    [onValueChanged]
  );
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const [shouldShowCardNumber, setShouldShowCardNumber] = useState(
    !hasCardNumber
  );
  const logRevealPaymentCardField = useCallback(
    (field: PaymentCardField) => {
      if (itemId) {
        logEvent(
          new UserRevealVaultItemFieldEvent({
            field,
            isProtected: true,
            itemId: itemId,
            itemType: ItemType.CreditCard,
          })
        );
      }
    },
    [itemId]
  );
  const handleProtectedItemUnlocking = useCallback(
    (override, onSuccess) =>
      new Promise<void>((resolve, reject) => {
        if (override || areProtectedItemsUnlocked) {
          onSuccess();
          return resolve();
        }
        openProtectedItemsUnlocker({
          action: UnlockerAction.Show,
          itemType: LockedItemType.CreditCard,
          successCallback: () => {
            onSuccess();
            return resolve();
          },
          cancelCallback: reject,
        });
      }),
    [areProtectedItemsUnlocked, openProtectedItemsUnlocker]
  );
  const toggleShowCardNumber = useCallback(() => {
    if (!shouldShowCardNumber) {
      logRevealPaymentCardField(Field.CardNumber);
      if (hasTeamSpaceId) {
        logRevealCreditCardField({
          field: "number",
          name: itemName,
        });
      }
    }
    setShouldShowCardNumber((oldValue) => !oldValue);
  }, [
    shouldShowCardNumber,
    logRevealPaymentCardField,
    hasTeamSpaceId,
    logRevealCreditCardField,
    itemName,
  ]);
  const isItemLocked = !areProtectedItemsUnlocked;
  const handleCopyField = (
    copyEvent: (item?: string) => void,
    i18nKey: string
  ) => {
    copyEvent(itemId);
    if (showCopyAlert) {
      showCopyAlert(translate(i18nKey));
    }
  };
  const [shouldShowSecurityCode, setShouldShowSecurityCode] = useState(
    securityCode === ""
  );
  const [shouldDisplayNote, setShouldDisplayNote] = useState(note === "");
  const toggleShowSecurityCode = useCallback(() => {
    if (!shouldShowSecurityCode) {
      logRevealPaymentCardField(Field.SecurityCode);
      if (hasTeamSpaceId) {
        logRevealCreditCardField({
          field: "cvv",
          name: itemName,
        });
      }
    }
    setShouldShowSecurityCode((oldValue) => !oldValue);
  }, [
    shouldShowSecurityCode,
    logRevealPaymentCardField,
    hasTeamSpaceId,
    logRevealCreditCardField,
    itemName,
  ]);
  const toggleShowNote = () => setShouldDisplayNote((oldValue) => !oldValue);
  const handleToggleShowNote = () => {
    handleProtectedItemUnlocking(shouldDisplayNote, toggleShowNote).catch(
      () => {
        setShouldDisplayNote(false);
      }
    );
  };
  const colorOptions = Object.values(PaymentCardColorType).map(
    (colorOption) => {
      return {
        label: translate(PaymentCardColorTypeToKeyDictionary[colorOption]),
        value: colorOption,
      };
    }
  );
  const displayedCardNumber = shouldShowCardNumber
    ? cardNumber
    : "●●●● ●●●● ●●●● ●●●●";
  const cardNumberFieldValue = hasCardNumber ? displayedCardNumber : "";
  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ContentCard
        title={translate(I18N_KEYS.DETAILS_CONTENT_LABEL)}
        additionalSx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <TextField
          data-name="ownerName"
          value={ownerName}
          label={translate(I18N_KEYS.FIELD_OWNERNAME)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_OWNERNAME)}
          onChange={handleContentChanged("ownerName")}
          disabled={!!isDisabled}
        />

        <ObfuscatedField
          data-name="cardNumber"
          required
          formatter={shouldShowCardNumber ? "card" : undefined}
          key={`cardNumber${shouldShowCardNumber}`}
          label={translate(I18N_KEYS.FIELD_CARDNUMBER)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_CARDNUMBER)}
          isValueInitiallyVisible={shouldShowCardNumber}
          toggleVisibilityLabel={{
            hide: translate(I18N_KEYS.FIELD_CARD_ACTION_HIDE_CARD_NUMBER),
            show: translate(I18N_KEYS.FIELD_CARD_ACTION_SHOW_CARD_NUMBER),
          }}
          onValueVisibilityChangeRequest={() =>
            handleProtectedItemUnlocking(
              shouldShowCardNumber,
              toggleShowCardNumber
            )
          }
          onCopy={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(cardNumberFieldValue);
            if (hasTeamSpaceId) {
              logCopiedCreditCardField({
                field: "number",
                name: itemName,
              });
            }
          }}
          readOnly={(!shouldShowCardNumber && hasCardNumber) || !!isDisabled}
          value={cardNumberFieldValue}
          actions={
            variant === "edit"
              ? [
                  <CopyToClipboardButton
                    key="copy-card-number"
                    data={cardNumber}
                    checkProtected={() => isItemLocked}
                    copyLabel={translate(
                      I18N_KEYS.FIELD_CARD_ACTION_COPY_CARD_NUMBER
                    )}
                    onCopy={() => {
                      handleCopyField(
                        copyLogEvent(Field.CardNumber),
                        I18N_KEYS.FIELD_CARDNUMBER_COPIED
                      );
                      if (hasTeamSpaceId) {
                        logCopiedCreditCardField({
                          field: "number",
                          name: itemName,
                        });
                      }
                    }}
                  />,
                ]
              : undefined
          }
          onChange={handleContentChanged("cardNumber")}
          error={errors?.has("cardNumber")}
        />

        <ObfuscatedField
          key={`securityCode${shouldShowSecurityCode}`}
          readOnly={
            (!shouldShowSecurityCode && hasSecurityCode) || !!isDisabled
          }
          value={shouldShowSecurityCode ? securityCode : "●●●"}
          label={translate(I18N_KEYS.FIELD_SECURITYCODE)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_SECURITYCODE)}
          onValueVisibilityChangeRequest={() =>
            handleProtectedItemUnlocking(
              shouldShowSecurityCode,
              toggleShowSecurityCode
            )
          }
          isValueInitiallyVisible={shouldShowSecurityCode}
          toggleVisibilityLabel={{
            hide: translate(I18N_KEYS.FIELD_CARD_ACTION_HIDE_SECURITY_CODE),
            show: translate(I18N_KEYS.FIELD_CARD_ACTION_SHOW_SECURITY_CODE),
          }}
          actions={
            variant === "edit"
              ? [
                  <CopyToClipboardButton
                    key="copy-security-code"
                    checkProtected={() => isItemLocked}
                    data={securityCode}
                    copyLabel={translate(
                      I18N_KEYS.FIELD_CARD_ACTION_COPY_SECURITY_CODE
                    )}
                    onCopy={() => {
                      handleCopyField(
                        copyLogEvent(Field.CardNumber),
                        I18N_KEYS.FIELD_SECURITYCODE_COPIED
                      );
                      if (hasTeamSpaceId) {
                        logCopiedCreditCardField({
                          field: "cvv",
                          name: itemName,
                        });
                      }
                    }}
                  />,
                ]
              : undefined
          }
          onChange={handleContentChanged("securityCode")}
          error={errors?.has("securityCode")}
        />

        <ExpiryDatePicker
          month={expireMonth}
          year={expireYear}
          onYearChange={handleContentChanged("expireYear")}
          onMonthChange={handleContentChanged("expireMonth")}
        />

        <TextArea
          sx={{
            "textarea, .readOnlyMask": {
              variant: "text.ds.body.standard.monospace",
            },
          }}
          label={translate(I18N_KEYS.FIELD_NOTES)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_NOTES)}
          data-name="note"
          readOnly={(!shouldDisplayNote && hasNote) || !!isDisabled}
          value={shouldDisplayNote || !hasNote ? note : "••••"}
          onChange={handleContentChanged("note")}
          actions={[
            <Button
              key="card-note-visibility"
              layout="iconOnly"
              icon={
                shouldDisplayNote
                  ? "ActionHideOutlined"
                  : "ActionRevealOutlined"
              }
              mood="brand"
              intensity="supershy"
              sx={{ marginRight: "16px" }}
              onClick={handleToggleShowNote}
              aria-label={
                shouldDisplayNote
                  ? translate(I18N_KEYS.FIELD_CARD_ACTION_HIDE_NOTE)
                  : translate(I18N_KEYS.FIELD_CARD_ACTION_SHOW_NOTE)
              }
              tooltip={
                shouldDisplayNote
                  ? translate(I18N_KEYS.FIELD_CARD_ACTION_HIDE_NOTE)
                  : translate(I18N_KEYS.FIELD_CARD_ACTION_SHOW_NOTE)
              }
            />,
            ...(variant === "edit"
              ? [
                  <CopyToClipboardButton
                    key="copy-note"
                    data={note}
                    checkProtected={() => isItemLocked}
                    copyLabel={translate(I18N_KEYS.FIELD_CARD_ACTION_COPY_NOTE)}
                    onCopy={() =>
                      handleCopyField(
                        copyLogEvent(Field.Note),
                        I18N_KEYS.FIELD_NOTE_COPIED
                      )
                    }
                    itemType={LockedItemType.CreditCard}
                    tooltipLocation="right"
                  />,
                ]
              : []),
          ]}
          data-testid="credential_edit_note_value"
        />
      </ContentCard>

      <ContentCard
        title={translate(I18N_KEYS.ORGANIZATION_CONTENT_LABEL)}
        additionalSx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <TextField
          key="cardname"
          value={itemName}
          label={translate(I18N_KEYS.FIELD_CARDNAME)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_CARDNAME)}
          onChange={handleContentChanged("itemName")}
          disabled={!!isDisabled}
        />

        <SelectField
          key={`cardColor${color}`}
          label={translate(I18N_KEYS.FIELD_CARDCOLOR_LABEL)}
          placeholder={translate(PaymentCardColorTypeToKeyDictionary[color])}
          value={color}
          onChange={handleContentChanged("color")}
          disabled={!!isDisabled}
        >
          {colorOptions.map((colorOption) => {
            return (
              <SelectOption key={colorOption.value} value={colorOption.value}>
                {colorOption.label}
              </SelectOption>
            );
          })}
        </SelectField>

        <SpaceSelect
          isUsingNewDesign
          spaceId={spaceId ?? ""}
          labelSx={spaceSelectFormLabelSx}
          onChange={(newSpaceId) => handleContentChanged("spaceId")(newSpaceId)}
          disabled={!!isDisabled}
        />
      </ContentCard>
    </div>
  );
};
