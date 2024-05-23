import { Fragment, MouseEventHandler } from 'react';
import { Button, Icon, jsx, Tooltip } from '@dashlane/design-system';
import { AlertSeverity, DropdownMenu, IconButton, } from '@dashlane/ui-components';
import { DropdownType, Field, ItemType, UserCopyVaultItemFieldEvent, UserOpenVaultItemDropdownEvent, } from '@dashlane/hermes';
import { BankAccount } from '@dashlane/vault-contracts';
import { useAlert } from 'libs/alert-notifications/use-alert';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { DropDownButton } from 'webapp/payments/bank-accounts/bank-account-actions/drop-down-button';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { BankAccountActionsMode, BankAccountValue } from './types';
import { getLabelsKey } from './getLabels';
interface DropdownButtonsProps {
    BIC: string;
    IBAN: string;
    bicKey: string;
    ibanKey: string;
    onClick: (value: BankAccountValue) => void;
}
const DropdownButtons = ({ BIC, IBAN, bicKey, ibanKey, onClick, }: DropdownButtonsProps) => {
    return (<>
      <DropDownButton onClick={() => onClick(BankAccountValue.BIC)} translationKey={bicKey} isEnabled={BIC.length > 0} value={BankAccountValue.BIC}/>
      <DropDownButton onClick={() => onClick(BankAccountValue.IBAN)} translationKey={ibanKey} isEnabled={IBAN.length > 0} value={BankAccountValue.IBAN}/>
    </>);
};
const I18N_KEYS = {
    SEARCH_MODE_TOOLTIP: 'webapp_sidemenu_search_actions_bank_account_tooltip',
    LIST_MODE_LABEL: 'webapp_payment_bankaccount_list_item_copy_info',
    COPY_TO_CLIPBOARD_ERROR: 'webapp_generic_copy_to_clipboard_feedback_error',
};
interface Props {
    bankAccount: Pick<BankAccount, 'id' | 'IBAN' | 'BIC' | 'country'>;
    mode: BankAccountActionsMode;
    dropdownIsOpen: boolean;
    setDropdownIsOpen: (open: boolean) => void;
}
export const BankAccountActions = ({ bankAccount, mode, dropdownIsOpen, setDropdownIsOpen, }: Props) => {
    const { translate } = useTranslate();
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const alert = useAlert();
    const labels = getLabelsKey(bankAccount.country, mode);
    const onClick: MouseEventHandler = (event) => {
        event.stopPropagation();
        if (!dropdownIsOpen) {
            logEvent(new UserOpenVaultItemDropdownEvent({
                dropdownType: DropdownType.Copy,
                itemType: ItemType.BankStatement,
            }));
        }
        setDropdownIsOpen(!dropdownIsOpen);
    };
    const handleBICCopyClick = async () => {
        logEvent(new UserCopyVaultItemFieldEvent({
            itemType: ItemType.BankStatement,
            field: Field.Bic,
            itemId: bankAccount.id,
            isProtected: true,
        }));
        try {
            await navigator.clipboard.writeText(bankAccount.BIC);
            alert.showAlert(translate(labels.BIC_ALERT), AlertSeverity.SUCCESS);
        }
        catch (err) {
        }
    };
    const handleIBANCopyClick = async () => {
        logEvent(new UserCopyVaultItemFieldEvent({
            itemType: ItemType.BankStatement,
            field: Field.Iban,
            itemId: bankAccount.id,
            isProtected: true,
        }));
        try {
            await navigator.clipboard.writeText(bankAccount.IBAN);
            alert.showAlert(translate(labels.IBAN_ALERT), AlertSeverity.SUCCESS);
        }
        catch (err) {
        }
    };
    const handleCopyClick = (valueToCopy: BankAccountValue) => {
        const onItemUnlockedCallback = async () => {
            try {
                switch (valueToCopy) {
                    case BankAccountValue.BIC:
                        await handleBICCopyClick();
                        break;
                    case BankAccountValue.IBAN:
                        await handleIBANCopyClick();
                        break;
                }
            }
            catch (e) {
                alert.showAlert(translate(I18N_KEYS.COPY_TO_CLIPBOARD_ERROR), AlertSeverity.ERROR);
            }
        };
        if (!areProtectedItemsUnlocked) {
            return openProtectedItemsUnlocker({
                action: UnlockerAction.Copy,
                itemType: LockedItemType.BankAccount,
                successCallback: onItemUnlockedCallback,
            });
        }
        onItemUnlockedCallback();
    };
    const dropdownButtons = (<DropdownButtons BIC={bankAccount.BIC} IBAN={bankAccount.IBAN} bicKey={labels.BIC} ibanKey={labels.IBAN} onClick={handleCopyClick}/>);
    if (mode === BankAccountActionsMode.SEARCH) {
        return (<DropdownMenu placement="bottom-end" trigger="persist" passThrough={!dropdownIsOpen} content={dropdownButtons} offset={[0, 4]}>
        <div>
          <Tooltip passThrough={dropdownIsOpen} location="left" content={translate(I18N_KEYS.LIST_MODE_LABEL)}>
            <IconButton contrast aria-label={translate(I18N_KEYS.SEARCH_MODE_TOOLTIP)} onClick={onClick} type="button" icon={<Icon name="ActionCopyOutlined" color="ds.text.neutral.standard" aria-label={translate(I18N_KEYS.SEARCH_MODE_TOOLTIP)}/>}/>
          </Tooltip>
        </div>
      </DropdownMenu>);
    }
    return (<DropdownMenu placement="bottom-end" trigger="persist" passThrough={!dropdownIsOpen} content={dropdownButtons} offset={[0, 4]}>
      <Button mood="neutral" intensity="quiet" onClick={onClick}>
        <Icon name="ActionCopyOutlined" color="ds.text.neutral.standard"/>
        <span sx={{
            marginLeft: '10px',
        }}>
          {translate(I18N_KEYS.LIST_MODE_LABEL)}
        </span>
      </Button>
    </DropdownMenu>);
};
