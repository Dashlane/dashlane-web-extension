import { PageView } from '@dashlane/hermes';
export enum TabName {
    Ids = 'ids',
    Notes = 'notes',
    Passwords = 'passwords',
    Payments = 'payments',
    PersonalInfo = 'personalInfo'
}
export interface TabInfo {
    name: TabName;
    nameKey: string;
    pageViewLog: PageView;
}
const I18N_KEYS = {
    CREDENTIALS: 'tab/all_items/tab_bar/credentials',
    IDS: 'tab/all_items/tab_bar/ids',
    PAYMENTS: 'tab/all_items/tab_bar/payments',
    PERSONAL_INFO: 'tab/all_items/tab_bar/personal_info',
    SECURE_NOTES: 'tab/all_items/tab_bar/secure_notes',
};
export const TabList: TabInfo[] = [
    {
        nameKey: I18N_KEYS.CREDENTIALS,
        name: TabName.Passwords,
        pageViewLog: PageView.ItemCredentialList,
    },
    {
        nameKey: I18N_KEYS.PAYMENTS,
        name: TabName.Payments,
        pageViewLog: PageView.ItemPaymentList,
    },
    {
        nameKey: I18N_KEYS.SECURE_NOTES,
        name: TabName.Notes,
        pageViewLog: PageView.ItemSecureNoteList,
    },
    {
        nameKey: I18N_KEYS.PERSONAL_INFO,
        name: TabName.PersonalInfo,
        pageViewLog: PageView.ItemPersonalInfoList,
    },
    {
        nameKey: I18N_KEYS.IDS,
        name: TabName.Ids,
        pageViewLog: PageView.ItemIdList,
    },
];
