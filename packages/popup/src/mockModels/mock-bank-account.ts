import { BankAccount, Country } from '@dashlane/vault-contracts';
import { baseItemView } from './credential';
export const mockBankAccount: BankAccount = {
    ...baseItemView,
    accountName: 'Banky',
    bankCode: '',
    BIC: 'LEGODK22',
    country: Country.FR,
    IBAN: '',
    lastBackupTime: 1692895183280,
    lastUse: undefined,
    ownerName: 'Testy Testersen',
};
