import { Fragment } from 'react';
import { jsx } from '@dashlane/ui-components';
import { Field } from '@dashlane/hermes';
import { PaymentCard, VaultItemType } from '@dashlane/vault-contracts';
import { ConfirmLabelMode } from 'src/app/protected-items-unlocker/master-password-dialog';
import { ActionsDropdown, ProtectedCopyDropdownElement } from '../../common';
const I18N_KEYS = {
    TOOLTIP: 'tab/all_items/payments/actions/bank_account_tooltip',
    COPY_CARD_NUMBER: 'tab/all_items/paymentCard/actions/card_number_copy_to_clipboard',
    COPY_CARD_NUMBER_SUCCESS: 'tab/all_items/paymentCard/actions/card_number_copied_to_clipboard',
    COPY_SECURITY_CODE: 'tab/all_items/paymentCard/actions/security_code_copy_to_clipboard',
    COPY_SECURITY_CODE_SUCCESS: 'tab/all_items/paymentCard/actions/security_code_copied_to_clipboard',
    COPY_NOTE: 'tab/all_items/paymentCard/actions/note_copy_to_clipboard',
    COPY_NOTE_SUCCESS: 'tab/all_items/paymentCard/actions/note_copied_to_clipboard'
};
interface Props {
    paymentCard: PaymentCard;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (open: boolean) => void;
}
export const PaymentCardActions = ({ paymentCard, isDropdownOpen, setIsDropdownOpen, }: Props) => {
    const defaultCopyDropdownElementProps = {
        credentialId: paymentCard.id,
        confirmLabelMode: ConfirmLabelMode.Copy,
        itemType: VaultItemType.PaymentCard,
    };
    return (<ActionsDropdown isDisabled={!paymentCard.cardNumber.length &&
            !paymentCard.securityCode &&
            !paymentCard.note} isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen} itemType={defaultCopyDropdownElementProps.itemType}>
      <>
        <ProtectedCopyDropdownElement {...defaultCopyDropdownElementProps} copyValue={paymentCard.cardNumber} field={Field.CardNumber} I18N_KEY_text={I18N_KEYS.COPY_CARD_NUMBER} I18N_KEY_notification={I18N_KEYS.COPY_CARD_NUMBER_SUCCESS}/>
        <ProtectedCopyDropdownElement {...defaultCopyDropdownElementProps} copyValue={paymentCard.securityCode} field={Field.SecurityCode} I18N_KEY_text={I18N_KEYS.COPY_SECURITY_CODE} I18N_KEY_notification={I18N_KEYS.COPY_SECURITY_CODE_SUCCESS}/>
        <ProtectedCopyDropdownElement {...defaultCopyDropdownElementProps} copyValue={paymentCard.note} field={Field.Note} I18N_KEY_text={I18N_KEYS.COPY_NOTE} I18N_KEY_notification={I18N_KEYS.COPY_NOTE_SUCCESS}/>
      </>
    </ActionsDropdown>);
};
