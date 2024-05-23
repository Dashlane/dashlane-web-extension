import { FooterAction } from 'src/libs/sendLog/types';
import { TabName } from 'src/app/vault/tabs-bar/tabs-data';
const I18N_KEYS = {
    ADD_NOTE_TOOLTIP: 'footer_add_note',
    ADD_PASSWORD_TOOLTIP: 'footer_add_password',
    ADD_PAYMENT_TOOLTIP: 'footer_add_payment',
    ADD_PERSONAL_INFO_TOOLTIP: 'footer_add_personal_info',
    ADD_ID_TOOLTIP: 'footer_add_id',
};
interface IAddNewInfo {
    action: FooterAction;
    route: string;
    routeId: string;
    translationKey: string;
}
const addNewInfoDictionary: {
    [key in TabName]: IAddNewInfo;
} = {
    notes: {
        action: FooterAction.AddNote,
        route: '/notes',
        routeId: 'new',
        translationKey: I18N_KEYS.ADD_NOTE_TOOLTIP,
    },
    passwords: {
        action: FooterAction.AddPassword,
        route: '/passwords',
        routeId: 'new',
        translationKey: I18N_KEYS.ADD_PASSWORD_TOOLTIP,
    },
    payments: {
        action: FooterAction.AddPayment,
        route: '/payments',
        routeId: '',
        translationKey: I18N_KEYS.ADD_PAYMENT_TOOLTIP,
    },
    personalInfo: {
        action: FooterAction.AddPersonalInfo,
        route: '/personal-info',
        routeId: '',
        translationKey: I18N_KEYS.ADD_PERSONAL_INFO_TOOLTIP,
    },
    ids: {
        action: FooterAction.AddId,
        route: '/ids',
        routeId: '',
        translationKey: I18N_KEYS.ADD_ID_TOOLTIP,
    },
};
export const getAddNewInfo = (tabName: TabName): IAddNewInfo => addNewInfoDictionary[tabName] || addNewInfoDictionary.passwords;
