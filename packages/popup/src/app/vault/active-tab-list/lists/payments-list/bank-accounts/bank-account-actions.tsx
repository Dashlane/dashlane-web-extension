import { Fragment } from "react";
import { jsx } from "@dashlane/ui-components";
import { Field } from "@dashlane/hermes";
import { BankAccount, VaultItemType } from "@dashlane/vault-contracts";
import { ConfirmLabelMode } from "../../../../../protected-items-unlocker/master-password-dialog";
import { ActionsDropdown, ProtectedCopyDropdownElement } from "../../common";
import { getBankFieldLabels } from "./getBankFieldLabels";
interface Props {
  bankAccount: BankAccount;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}
export const BankAccountActions = ({
  bankAccount,
  isDropdownOpen,
  setIsDropdownOpen,
}: Props) => {
  const bankFieldLabelKeys = getBankFieldLabels(bankAccount.country);
  const defaultCopyDropdownElementProps = {
    credentialId: bankAccount.id,
    confirmLabelMode: ConfirmLabelMode.Copy,
    itemType: VaultItemType.BankAccount,
  };
  return (
    <ActionsDropdown
      isDisabled={!bankAccount.BIC.length && !bankAccount.IBAN.length}
      isOpen={isDropdownOpen}
      setIsOpen={setIsDropdownOpen}
      itemType={defaultCopyDropdownElementProps.itemType}
    >
      <>
        <ProtectedCopyDropdownElement
          {...defaultCopyDropdownElementProps}
          copyValue={bankAccount.BIC}
          field={Field.Bic}
          I18N_KEY_text={bankFieldLabelKeys.BIC}
          I18N_KEY_notification={bankFieldLabelKeys.BIC_COPIED}
          showNeverAskOption={false}
        />
        <ProtectedCopyDropdownElement
          {...defaultCopyDropdownElementProps}
          copyValue={bankAccount.IBAN}
          field={Field.Iban}
          I18N_KEY_text={bankFieldLabelKeys.IBAN}
          I18N_KEY_notification={bankFieldLabelKeys.IBAN_COPIED}
          showNeverAskOption={false}
        />
      </>
    </ActionsDropdown>
  );
};
