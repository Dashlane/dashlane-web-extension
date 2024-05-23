import { carbonConnector } from 'libs/carbon/connector';
import { TranslatorInterface } from 'libs/i18n/types';
const I18N_KEYS = [
    'default_note_category_name_databases',
    'default_note_category_name_finance',
    'default_note_category_name_legal_documents',
    'default_note_category_name_memberships',
    'default_note_category_name_other',
    'default_note_category_name_passwords',
    'default_note_category_name_personal',
    'default_note_category_name_server',
    'default_note_category_name_software',
    'default_note_category_name_wifi',
    'default_note_category_name_work',
];
export function setupDefaultNoteCategories(translate: TranslatorInterface) {
    const defaultCategories = I18N_KEYS.map((key) => translate(key));
    carbonConnector.setupDefaultNoteCategories({
        categories: defaultCategories,
    });
}
export const formatMarkdownSource = (value: string) => {
    return value.replace(/\n/gi, '&nbsp; \n');
};
