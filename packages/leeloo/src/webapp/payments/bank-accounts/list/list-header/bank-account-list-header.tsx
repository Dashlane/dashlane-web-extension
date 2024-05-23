import { jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    BANK_ACCOUNTS_TITLE: 'payments_grid_category_bank_account',
    BANK_ACCOUNTS_NAME: 'webapp_payment_bankaccounts_list_header_bank_name',
    BANK_ACCOUNTS_LASTUSE: 'webapp_payment_bankaccounts_list_header_last_use',
};
export interface BankAccountListHeaderProps {
    quantity: number;
}
export const BankAccountListHeader = ({ quantity, }: BankAccountListHeaderProps) => {
    const { translate } = useTranslate();
    return (<div sx={{
            userSelect: 'none',
            height: '60px',
            borderBottom: 'solid 1px transparent',
            borderColor: 'ds.border.neutral.quiet.idle',
            display: 'grid',
            gridTemplateColumns: '3fr 2fr 3fr 20%',
            gridTemplateAreas: '"info bankname lastuse"',
            alignItems: 'center',
            minWidth: '800px',
        }}>
      <Paragraph textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet" sx={{
            gridArea: 'info',
        }}>
        {translate(I18N_KEYS.BANK_ACCOUNTS_TITLE)} ({quantity})
      </Paragraph>

      <Paragraph textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet" sx={{
            gridArea: 'bankname',
        }}>
        {translate(I18N_KEYS.BANK_ACCOUNTS_NAME)}
      </Paragraph>
      <Paragraph textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet" sx={{
            gridArea: 'lastuse',
        }}>
        {translate(I18N_KEYS.BANK_ACCOUNTS_LASTUSE)}
      </Paragraph>
    </div>);
};
