import createReducer from 'store/reducers/create';
import LocaleState from './types';
const reducer = createReducer<LocaleState>('LOCALE', {
    language: '',
    country: '',
});
export const userChangedLanguage = reducer.registerAction('LANGUAGE_USER_CHANGED', (state: LocaleState, { language }: {
    language: string;
}) => Object.assign({}, state, { language }));
export const loadedLanguage = reducer.registerAction('LANGUAGE_LOADED', (state: LocaleState, { language }: {
    language: string;
}) => Object.assign({}, state, { language }));
export const userChangedCountry = reducer.registerAction('COUNTRY_USER_CHANGED', (state: LocaleState, { country }: {
    country: string;
}) => Object.assign({}, state, { country }));
export const loadedCountry = reducer.registerAction('COUNTRY_LOADED', (state: LocaleState, { country }: {
    country: string;
}) => Object.assign({}, state, { country }));
export default reducer;
