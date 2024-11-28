import { memo } from "react";
import { DisplayField, jsx, useToast } from "@dashlane/design-system";
import { Field, ItemType } from "@dashlane/hermes";
import { PaymentCard, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ProtectedValueField } from "../../../../components/inputs/common/protected-value-field/protected-value-field";
import { useCopyAction } from "../credential-detail-view/useCopyAction";
import { ProtectedTextArea } from "../../../../components/inputs/common/protected-text-area/protected-text-area";
import { FormContainer } from "../common/form-container";
import { CopyIconButton } from "../credential-detail-view/form-fields/copy-icon-button";
export const I18N_KEYS = {
  ACCOUNT_HOLDER_LABEL: "tab/all_items/paymentCard/view/label/account_holder",
  CARD_NUMBER_LABEL: "tab/all_items/paymentCard/view/label/card_number",
  CARD_NUMBER_COPY:
    "tab/all_items/paymentCard/actions/card_number_copy_to_clipboard",
  CARD_NUMBER_COPIED:
    "tab/all_items/paymentCard/actions/card_number_copied_to_clipboard",
  CARD_NUMBER_SHOW: "tab/all_items/paymentCard/actions/card_number_show",
  CARD_NUMBER_HIDE: "tab/all_items/paymentCard/actions/card_number_hide",
  SECURITY_CODE_LABEL: "tab/all_items/paymentCard/view/label/security_code",
  SECURITY_CODE_COPY:
    "tab/all_items/paymentCard/actions/security_code_copy_to_clipboard",
  SECURITY_CODE_COPIED:
    "tab/all_items/paymentCard/actions/security_code_copied_to_clipboard",
  SECURITY_CODE_SHOW: "tab/all_items/paymentCard/actions/security_code_show",
  SECURITY_CODE_HIDE: "tab/all_items/paymentCard/actions/security_code_hide",
  EXPIRATION_DATE_LABEL: "tab/all_items/paymentCard/view/label/expiration_date",
  EXPIRATION_DATE_COPY:
    "tab/all_items/paymentCard/actions/expiration_date_copy_to_clipboard",
  EXPIRATION_DATE_COPIED:
    "tab/all_items/paymentCard/actions/expiration_date_copied_to_clipboard",
  NOTE_LABEL: "tab/all_items/paymentCard/view/label/note",
  NOTE_COPY: "tab/all_items/paymentCard/actions/note_copy_to_clipboard",
  NOTE_COPIED: "tab/all_items/paymentCard/actions/note_copied_to_clipboard",
  NOTE_HIDE: "tab/all_items/paymentCard/actions/note_hide",
  NOTE_SHOW: "tab/all_items/paymentCard/actions/note_show",
};
interface PaymentCardDetailFormProps {
  card: PaymentCard;
}
const PaymentCardFormComponent = ({ card }: PaymentCardDetailFormProps) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const {
    cardNumber,
    expireMonth,
    expireYear,
    id,
    ownerName,
    note,
    securityCode,
  } = card;
  const baseCopyActionValues = {
    showToast,
    itemType: VaultItemType.PaymentCard,
    itemId: id,
  };
  const cardNumberCopyAction = useCopyAction({
    ...baseCopyActionValues,
    toastString: translate(I18N_KEYS.CARD_NUMBER_COPIED),
    field: Field.CardNumber,
    value: cardNumber ?? "",
    isProtected: true,
  });
  const securityCodeCopyAction = useCopyAction({
    ...baseCopyActionValues,
    toastString: translate(I18N_KEYS.SECURITY_CODE_COPIED),
    field: Field.SecurityCode,
    value: securityCode ?? "",
    isProtected: true,
  });
  const expirationDateCopyAction = useCopyAction({
    ...baseCopyActionValues,
    toastString: translate(I18N_KEYS.EXPIRATION_DATE_COPIED),
    field: Field.ExpireDate,
    value: `${expireMonth}/${expireYear}`,
    isProtected: false,
  });
  const noteCopyAction = useCopyAction({
    ...baseCopyActionValues,
    toastString: translate(I18N_KEYS.NOTE_COPIED),
    field: Field.Note,
    value: note ?? "",
    isProtected: true,
  });
  const paymentCardExpiredStyle = (cardMonth: string, cardYear: string) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const cardYearInt = parseInt(cardYear, 10);
    const cardMonthInt = parseInt(cardMonth, 10);
    if (
      currentYear > cardYearInt ||
      (currentYear === cardYearInt && currentMonth > cardMonthInt)
    ) {
      return { color: "ds.text.danger.quiet" };
    }
    return { color: "ds.text.neutral.standard" };
  };
  return (
    <FormContainer>
      {ownerName && (
        <DisplayField
          data-name="accountHolder"
          label={translate(I18N_KEYS.ACCOUNT_HOLDER_LABEL)}
          value={ownerName}
        />
      )}
      {cardNumber && (
        <ProtectedValueField
          shouldItemBeVisible
          protectedItemId={id}
          valueFieldId="cardNumber"
          valueFieldLabel={translate(I18N_KEYS.CARD_NUMBER_LABEL)}
          value={cardNumber.replace(/(.{4})/g, "$1 ")}
          fieldType={ItemType.CreditCard}
          revealValueLabel={translate(I18N_KEYS.CARD_NUMBER_SHOW)}
          hideValueLabel={translate(I18N_KEYS.CARD_NUMBER_HIDE)}
          onCopyClick={() => {
            void cardNumberCopyAction();
          }}
          copyValueLabel={translate(I18N_KEYS.CARD_NUMBER_COPY)}
        />
      )}
      {securityCode && (
        <ProtectedValueField
          shouldItemBeVisible
          protectedItemId={id}
          valueFieldId="securityCode"
          valueFieldLabel={translate(I18N_KEYS.SECURITY_CODE_LABEL)}
          value={securityCode}
          fieldType={ItemType.CreditCard}
          revealValueLabel={translate(I18N_KEYS.SECURITY_CODE_SHOW)}
          hideValueLabel={translate(I18N_KEYS.SECURITY_CODE_HIDE)}
          onCopyClick={() => {
            void securityCodeCopyAction();
          }}
          copyValueLabel={translate(I18N_KEYS.SECURITY_CODE_COPY)}
        />
      )}
      {expireMonth && expireYear ? (
        <DisplayField
          data-name="expiryDate"
          label={translate(I18N_KEYS.EXPIRATION_DATE_LABEL)}
          value={`${expireMonth}/${expireYear}`}
          sx={paymentCardExpiredStyle(expireMonth, expireYear)}
          actions={[
            <CopyIconButton
              key="copy-button"
              text={translate(I18N_KEYS.EXPIRATION_DATE_COPY)}
              copyAction={() => {
                void expirationDateCopyAction();
              }}
            />,
          ]}
        />
      ) : null}
      {note && (
        <ProtectedTextArea
          protectedItemId={note}
          valueFieldId="notes"
          valueFieldLabel={translate(I18N_KEYS.NOTE_LABEL)}
          value={note}
          revealValueLabel={translate(I18N_KEYS.NOTE_SHOW)}
          hideValueLabel={translate(I18N_KEYS.NOTE_HIDE)}
          onCopyClick={() => {
            void noteCopyAction();
          }}
          copyValueLabel={translate(I18N_KEYS.NOTE_COPY)}
        />
      )}
    </FormContainer>
  );
};
export const PaymentCardDetailForm = memo(PaymentCardFormComponent);
