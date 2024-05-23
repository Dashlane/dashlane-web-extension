import { forwardRef, Fragment, useEffect, useMemo, useState } from 'react';
import { BankAccount, Country } from '@dashlane/vault-contracts';
import { Field, ItemType, UserCopyVaultItemFieldEvent, UserRevealVaultItemFieldEvent, } from '@dashlane/hermes';
import { Button, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { TranslateFunction } from 'libs/i18n/types';
import DetailField from 'libs/dashlane-style/detail-field';
import DetailSelect from 'libs/dashlane-style/select-field/detail';
import { ButtonsOnHover } from 'libs/dashlane-style/buttons-on-hover';
import { logEvent } from 'libs/logs/logEvent';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { CopyToClipboardButton } from 'webapp/credentials/edit/copy-to-clipboard-control';
import { LockedItemType, ProtectedItemsUnlockerProps, UnlockerAction, } from 'webapp/unlock-items/types';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
import { getFieldLabels } from 'webapp/payments/bank-accounts/form/getFieldLabels';
import { areCountryBanksReady, useCountryBanks, } from 'webapp/payments/hooks/useCountryBanks';
const I18N_KEYS = {
    FIELD_ACTION_HIDE: 'webapp_payment_edition_field_bank_account_action_hide',
    FIELD_ACTION_SHOW: 'webapp_payment_edition_field_bank_account_action_show',
    FIELD_ACCOUNT_NAME: 'webapp_payment_edition_field_bank_account_name',
    FIELD_ACCOUNT_OWNER_NAME: 'webapp_payment_edition_field_bank_account_owner_name',
    FIELD_COUNTRY: 'webapp_payment_edition_field_bank_account_country',
    FIELD_BANK_NAME: 'webapp_payment_edition_field_bank_account_bank_name',
    FIELD_PLACEHOLDER_NO_ACCOUNT_NAME: 'webapp_payment_edition_field_bank_account_no_name_placeholder',
    FIELD_PLACEHOLDER_NO_OWNER_NAME: 'webapp_payment_edition_field_bank_account_no_owner_name_placeholder',
};
type BankAccountField = Field.Bic | Field.Iban;
const getCountryOptions = (countryList: string[], translate: TranslateFunction) => countryList
    .filter((countryKey) => !(Country[countryKey] === Country.UNIVERSAL ||
    Country[countryKey] === Country.NO_TYPE))
    .map((countryKey) => {
    return {
        label: translate(`country_name_${Country[countryKey]}`),
        value: Country[countryKey],
    };
})
    .sort((a, b) => a.label.localeCompare(b.label));
const getBankOptionFromCode = (options: {
    label: string;
    value: string;
}[], code: string) => options.find(({ value }) => value === code);
const FieldButtonsWrapper = (props: {
    children: React.ReactNode;
    buttons: React.ReactNode;
    showButtonsOnHover: boolean;
}): JSX.Element => {
    if (props.buttons === null) {
        return <>{props.children}</>;
    }
    return (<ButtonsOnHover enabled={props.showButtonsOnHover}>
      {props.children}
      {props.buttons}
    </ButtonsOnHover>);
};
export type BankAccountFormFields = Pick<BankAccount, 'accountName' | 'bankCode' | 'BIC' | 'country' | 'IBAN' | 'ownerName' | 'spaceId'>;
type BaseProps = {
    bankAccount: BankAccountFormFields;
    errors?: Set<keyof BankAccountFormFields>;
    signalEditedValues: (newBankAccountContent: BankAccountFormFields, silent?: boolean) => void;
};
type AddProps = BaseProps & {
    variant: 'add';
};
type EditProps = BaseProps & {
    variant: 'edit';
    itemId: string;
    onCopy: (message: string) => void;
} & Partial<ProtectedItemsUnlockerProps>;
type Props = AddProps | EditProps;
const BankAccountFormComponent = (props: Props, ref: React.Ref<DetailField>) => {
    const { bankAccount, errors = new Set(), signalEditedValues } = props;
    const { bankCode, accountName, IBAN, BIC, ownerName, spaceId, country } = bankAccount;
    const hasIBAN = IBAN.length > 0;
    const hasBIC = BIC.length > 0;
    const [shouldShowBIC, setShouldShowBIC] = useState(!hasBIC);
    const [shouldShowIBAN, setShouldShowIBAN] = useState(!hasIBAN);
    const { translate } = useTranslate();
    const { shouldShowTrialDiscontinuedDialog: isDisabled } = useTrialDiscontinuedDialogContext();
    const isItemLocked = props.variant === 'edit' ? !props.areProtectedItemsUnlocked : undefined;
    const translationKeys = getFieldLabels(country);
    const handleContentChanged = (field: keyof BankAccount) => (eventOrValue: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string) => {
        const updatedValue = typeof eventOrValue === 'string'
            ? eventOrValue
            : eventOrValue.target.value;
        signalEditedValues({
            ...bankAccount,
            [field]: updatedValue,
        });
    };
    const logRevealBankAccountField = props.variant === 'edit'
        ? (field: BankAccountField) => {
            logEvent(new UserRevealVaultItemFieldEvent({
                field,
                isProtected: true,
                itemId: props.itemId,
                itemType: ItemType.BankStatement,
            }));
        }
        : undefined;
    const handleToggleShowBIC = props.variant === 'edit'
        ? () => {
            if (!shouldShowBIC && logRevealBankAccountField) {
                logRevealBankAccountField(Field.Bic);
            }
            const toggle = () => setShouldShowBIC((oldValue) => !oldValue);
            if (isItemLocked &&
                typeof props.openProtectedItemsUnlocker === 'function') {
                props.openProtectedItemsUnlocker({
                    action: UnlockerAction.Show,
                    itemType: LockedItemType.BankAccount,
                    successCallback: toggle,
                });
                return;
            }
            toggle();
        }
        : undefined;
    const handleToggleShowIBAN = props.variant === 'edit'
        ? () => {
            if (!shouldShowIBAN && logRevealBankAccountField) {
                logRevealBankAccountField(Field.Iban);
            }
            const toggle = () => setShouldShowIBAN((oldValue) => !oldValue);
            if (isItemLocked &&
                typeof props.openProtectedItemsUnlocker === 'function') {
                props.openProtectedItemsUnlocker({
                    action: UnlockerAction.Show,
                    itemType: LockedItemType.BankAccount,
                    successCallback: toggle,
                });
                return;
            }
            toggle();
        }
        : undefined;
    const handleCopyBIC = props.variant === 'edit'
        ? (success: boolean) => {
            logEvent(new UserCopyVaultItemFieldEvent({
                itemType: ItemType.BankStatement,
                field: Field.Bic,
                itemId: props.itemId,
                isProtected: true,
            }));
            if (success) {
                props.onCopy(translate(translationKeys.BIC_COPIED));
            }
        }
        : undefined;
    const handleCopyIBAN = props.variant === 'edit'
        ? (success: boolean) => {
            logEvent(new UserCopyVaultItemFieldEvent({
                itemType: ItemType.BankStatement,
                field: Field.Iban,
                itemId: props.itemId,
                isProtected: true,
            }));
            if (success) {
                props.onCopy(translate(translationKeys.IBAN_COPIED));
            }
        }
        : undefined;
    const countryBanks = useCountryBanks(country);
    const countryBanksReady = areCountryBanksReady(countryBanks);
    const bankOptions = useMemo(() => countryBanks.map((bankItem) => ({
        label: bankItem.localizedString,
        value: `${country}-${bankItem.code}`,
    })), [countryBanks, country]);
    useEffect(() => {
        if (getBankOptionFromCode(bankOptions, bankCode) === undefined &&
            bankOptions.length > 0) {
            signalEditedValues({
                ...bankAccount,
                bankCode: bankOptions[0].value,
            }, true);
        }
        if (bankCode !== '' && !bankOptions.length && countryBanksReady) {
            signalEditedValues({
                ...bankAccount,
                bankCode: '',
            });
        }
    }, [
        bankCode,
        bankAccount,
        bankOptions,
        countryBanksReady,
        signalEditedValues,
    ]);
    const countryList = Object.keys(Country);
    const countryOptions = getCountryOptions(countryList, translate);
    return (<>
      <DetailField key="name" value={accountName} label={translate(I18N_KEYS.FIELD_ACCOUNT_NAME)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_ACCOUNT_NAME)} onChange={handleContentChanged('accountName')} ref={ref} disabled={!!isDisabled}/>
      <DetailField key="owner" value={ownerName} label={translate(I18N_KEYS.FIELD_ACCOUNT_OWNER_NAME)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_OWNER_NAME)} onChange={handleContentChanged('ownerName')} disabled={!!isDisabled}/>
      <FieldButtonsWrapper showButtonsOnHover={hasBIC} buttons={props.variant === 'edit' ? (<>
              {handleToggleShowBIC ? (<Button mood="neutral" intensity="quiet" sx={{ marginRight: '8px' }} onClick={handleToggleShowBIC}>
                  {shouldShowBIC
                    ? translate(I18N_KEYS.FIELD_ACTION_HIDE)
                    : translate(I18N_KEYS.FIELD_ACTION_SHOW)}
                </Button>) : null}
              {handleCopyBIC && isItemLocked !== undefined ? (<CopyToClipboardButton data={BIC} checkProtected={() => isItemLocked} onCopy={handleCopyBIC} itemType={LockedItemType.BankAccount}/>) : null}
            </>) : null}>
        <DetailField key="BIC" disabled={(!shouldShowBIC && hasBIC) || !!isDisabled} value={shouldShowBIC ? BIC : '●●●●●●'} label={translate(translationKeys.BIC)} placeholder={translate(translationKeys.BIC_PLACEHOLDER)} type="text" onChange={handleContentChanged('BIC')} error={errors.has('BIC')}/>
      </FieldButtonsWrapper>
      <FieldButtonsWrapper showButtonsOnHover={hasIBAN} buttons={props.variant === 'edit' ? (<>
              {handleToggleShowIBAN ? (<Button mood="neutral" intensity="quiet" sx={{ marginRight: '8px' }} onClick={handleToggleShowIBAN}>
                  {shouldShowIBAN
                    ? translate(I18N_KEYS.FIELD_ACTION_HIDE)
                    : translate(I18N_KEYS.FIELD_ACTION_SHOW)}
                </Button>) : null}
              {handleCopyIBAN && isItemLocked !== undefined ? (<CopyToClipboardButton data={IBAN} checkProtected={() => isItemLocked} onCopy={handleCopyIBAN} itemType={LockedItemType.BankAccount}/>) : null}
            </>) : null}>
        <DetailField key="IBAN" label={translate(translationKeys.IBAN)} placeholder={translate(translationKeys.IBAN_PLACEHOLDER)} dataName="IBAN" disabled={(!shouldShowIBAN && hasIBAN) || !!isDisabled} type="text" value={shouldShowIBAN ? IBAN : '●●●●●●●●●●●●●●●●'} onChange={handleContentChanged('IBAN')} error={errors.has('IBAN')}/>
      </FieldButtonsWrapper>
      <DetailSelect key="country" label={translate(I18N_KEYS.FIELD_COUNTRY)} placeholder={translate(I18N_KEYS.FIELD_COUNTRY) + country} onChange={handleContentChanged('country')} options={countryOptions} defaultOption={{
            label: translate(`country_name_${country}`),
            value: country,
        }} disabled={!!isDisabled}/>
      {bankOptions.length > 0 ? (<DetailSelect key={`${country}bank`} label={translate(I18N_KEYS.FIELD_BANK_NAME)} placeholder={translate(I18N_KEYS.FIELD_BANK_NAME) + bankCode} onChange={handleContentChanged('bankCode')} options={bankOptions} defaultOption={getBankOptionFromCode(bankOptions, bankCode) ?? bankOptions[0]} disabled={!!isDisabled}/>) : null}

      <SpaceSelect spaceId={spaceId ?? ''} labelSx={spaceSelectFormLabelSx} onChange={(newSpaceId) => handleContentChanged('spaceId')(newSpaceId)} disabled={!!isDisabled}/>
    </>);
};
export const BankAccountForm = forwardRef<DetailField, Props>(BankAccountFormComponent);
