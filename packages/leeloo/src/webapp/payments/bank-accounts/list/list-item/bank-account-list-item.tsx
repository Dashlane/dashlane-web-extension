import { jsx, Paragraph } from '@dashlane/design-system';
import { BankAccount } from '@dashlane/vault-contracts';
import { memo, useState } from 'react';
import { Link } from 'libs/router';
import { fromUnixTime } from 'date-fns';
import zIndexVars from 'libs/dashlane-style/globals/z-index-variables.css';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { logSelectBankAccount } from 'libs/logs/events/vault/select-item';
import LocalizedTimeAgo from 'libs/i18n/localizedTimeAgo';
import useTranslate from 'libs/i18n/useTranslate';
import { BankAccountActions } from 'webapp/payments/bank-accounts/bank-account-actions/bank-account-actions';
import { BankAccountActionsMode } from 'webapp/payments/bank-accounts/bank-account-actions/types';
import { BankAccountInfo } from 'webapp/payments/bank-accounts/bank-account-info/bank-account-info';
import { LocalizedBankName } from './localized-bank-name';
const I18N_KEYS = {
    NEVER_USED: 'webapp_payment_bankaccount_list_item_never_used',
};
export interface BankAccountListItemProps {
    bankAccount: BankAccount;
}
const BankAccountListItemComponent = ({ bankAccount, }: BankAccountListItemProps) => {
    const [copyDropdownIsOpen, setCopyDropdownIsOpen] = useState(false);
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const { bankCode, country, ownerName, accountName, id } = bankAccount;
    return (<li sx={{
            display: 'flex',
            height: '60px',
            borderBottom: 'solid 1px transparent',
            borderColor: 'ds.border.neutral.quiet.idle',
            '&:hover .actions': {
                opacity: 1,
            },
        }} onMouseLeave={() => {
            if (copyDropdownIsOpen) {
                setCopyDropdownIsOpen(false);
            }
        }}>
      <Link onClick={() => {
            logSelectBankAccount(bankAccount.id);
        }} to={routes.userBankAccount(id)} sx={{
            textDecoration: 'none',
            alignItems: 'center',
            cursor: 'pointer',
            display: 'grid',
            gridTemplateColumns: '3fr 2fr 3fr',
            gridTemplateRows: '60px',
            gridTemplateAreas: '"info bankname lastuse buttons"',
            width: '80%',
            color: 'ds.text.neutral.quiet',
            '&:focus + .actions': {
                opacity: 1,
            },
        }}>
        <div sx={{
            alignSelf: 'center',
            gridArea: 'info',
            maxWidth: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            overflow: 'hidden',
        }}>
          <BankAccountInfo bankAccountName={accountName} bankOwner={ownerName}/>
        </div>
        <div sx={{
            alignSelf: 'center',
            gridArea: 'bankname',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            height: '100%',
            alignItems: 'center',
            display: 'flex',
            paddingRight: '8px',
        }}>
          <LocalizedBankName bankCode={bankCode} country={country}/>
        </div>
        <div sx={{
            gridArea: 'lastuse',
            display: 'flex',
            alignSelf: 'center',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '100%',
            alignItems: 'center',
            flex: '1',
        }}>
          <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular">
            {bankAccount.lastUse ? (<LocalizedTimeAgo date={fromUnixTime(bankAccount.lastUse)}/>) : (translate(I18N_KEYS.NEVER_USED))}
          </Paragraph>
        </div>
      </Link>
      <div className="actions" sx={{
            gridArea: 'buttons',
            display: 'flex',
            flex: '1',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            opacity: '0',
            '& > div': {
                zIndex: zIndexVars['--z-index-content-overlap'],
            },
        }}>
        <BankAccountActions bankAccount={bankAccount} mode={BankAccountActionsMode.LIST} dropdownIsOpen={copyDropdownIsOpen} setDropdownIsOpen={setCopyDropdownIsOpen}/>
      </div>
    </li>);
};
export const BankAccountListItem = memo(BankAccountListItemComponent);
