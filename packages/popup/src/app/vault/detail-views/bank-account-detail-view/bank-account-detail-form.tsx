import { memo } from 'react';
import { jsx, useToast } from '@dashlane/design-system';
import { BankAccount, VaultItemType } from '@dashlane/vault-contracts';
import { Field, ItemType } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { ProtectedValueField } from 'src/components/inputs/common/protected-value-field/protected-value-field';
import { getBankFieldLabels } from 'src/app/vault/active-tab-list/lists/payments-list/bank-accounts/getBankFieldLabels';
import { useCopyAction } from 'src/app/vault/detail-views/credential-detail-view/useCopyAction';
import Input from 'src/components/inputs/common/input/input';
import { FormContainer } from '../common/form-container';
import { IssuingBankInput } from './issuing-bank-input';
export const I18N_KEYS = {
    ACCOUNT_HOLDER_LABEL: 'tab/all_items/paymentCard/view/label/account_holder',
    SHOW: 'tab/all_items/bankAccount/actions/show',
    HIDE: 'tab/all_items/bankAccount/actions/hide',
};
interface BankAccountDetailFormProps {
    bankAccount: BankAccount;
}
const BankAccountFormComponent = ({ bankAccount, }: BankAccountDetailFormProps) => {
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const { bankCode, BIC, IBAN, ownerName, country, id } = bankAccount;
    const bankLabels = getBankFieldLabels(country);
    const baseCopyActionValues = {
        showToast,
        itemType: VaultItemType.BankAccount,
        itemId: id,
    };
    const bicCopyAction = useCopyAction({
        ...baseCopyActionValues,
        toastString: translate(bankLabels.BIC_COPIED),
        field: Field.Bic,
        value: BIC ?? '',
        isProtected: true,
    });
    const ibanCopyAction = useCopyAction({
        ...baseCopyActionValues,
        toastString: translate(bankLabels.IBAN_COPIED),
        field: Field.Iban,
        value: IBAN ?? '',
        isProtected: true,
    });
    return (<FormContainer>
      {ownerName ? (<Input id="accountOwner" label={translate(I18N_KEYS.ACCOUNT_HOLDER_LABEL)} value={ownerName} readonly inputType="text"/>) : null}
      {BIC ? (<ProtectedValueField protectedItemId={id} valueFieldId="BIC" valueFieldLabel={translate(bankLabels.BIC)} value={BIC} fieldType={ItemType.BankStatement} revealValueLabel={translate(I18N_KEYS.SHOW)} hideValueLabel={translate(I18N_KEYS.HIDE)} onCopyClick={() => {
                void bicCopyAction();
            }} copyValueLabel={translate(bankLabels.BIC_COPY)}/>) : null}
      {IBAN ? (<ProtectedValueField protectedItemId={id} valueFieldId="IBAN" valueFieldLabel={translate(bankLabels.IBAN)} value={IBAN} fieldType={ItemType.BankStatement} revealValueLabel={translate(I18N_KEYS.SHOW)} hideValueLabel={translate(I18N_KEYS.HIDE)} onCopyClick={() => {
                void ibanCopyAction();
            }} copyValueLabel={translate(bankLabels.IBAN_COPY)}/>) : null}
      {bankCode ? (<IssuingBankInput bankCode={bankCode} country={country}/>) : null}
    </FormContainer>);
};
export const BankAccountDetailForm = memo(BankAccountFormComponent);
