import { MouseEvent } from 'react';
import { Button, colors, jsx, SearchIcon } from '@dashlane/ui-components';
import { Query, Route, } from '@dashlane/framework-infra/src/spi/business/webapp/open.types';
import useTranslate from 'libs/i18n/useTranslate';
import { openWebAppAndClosePopup } from 'src/app/helpers';
import { VaultTabType } from '../../../../../types';
import styles from './styles.css';
const I18N_KEYS = {
    ADD_PASSWORD_ADVICE: 'tab/all_items/no_search_results_placeholder_part3',
    ADD_PASSWORD_CTA: 'tab/all_items/no_search_results_add_password_button',
    ADD_SECURE_NOTE_CTA: 'tab/all_items/no_search_results_add_secure_note_button',
    ADD_SECURE_NOTE_ADVICE: 'tab/all_items/no_search_results_placeholder_secure_note',
    ADD_PAYMENT_CTA: 'tab/all_items/no_search_results_add_payment_button',
    ADD_PAYMENT_ADVICE: 'tab/all_items/no_search_results_placeholder_payment_item',
    NO_RESULTS_FOR_QUERY: 'tab/all_items/no_search_results_placeholder_no_results',
    SPELL_CHECK_ADVICE: 'tab/all_items/no_search_results_placeholder_part2',
};
interface Props {
    vaultTabType: VaultTabType;
    searchValue: string;
}
export const NoResultsVaultItemsList = ({ vaultTabType, searchValue, }: Props) => {
    const { translate } = useTranslate();
    const newVaultItemRoutes: Record<VaultTabType, Route> = {
        [VaultTabType.Credentials]: '/passwords',
        [VaultTabType.SecureNotes]: '/notes',
        [VaultTabType.Payments]: '/payments',
        [VaultTabType.Identities]: '/identities',
        [VaultTabType.PersonalInformation]: '/personal-info',
    };
    const getWebAppQueryAndID = (): {
        query: Query | undefined;
        id: string;
    } => {
        switch (vaultTabType) {
            case VaultTabType.Credentials:
                return { query: { name: searchValue }, id: 'new' };
            case VaultTabType.SecureNotes:
                return {
                    query: { name: searchValue },
                    id: 'new',
                };
            default:
                return { query: undefined, id: '' };
        }
    };
    const handleClickOnAddNewItem = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const webappQueryAndID = getWebAppQueryAndID();
        void openWebAppAndClosePopup({
            id: webappQueryAndID.id,
            query: webappQueryAndID.query,
            route: newVaultItemRoutes[vaultTabType],
        });
    };
    const getI18NAddKey = () => {
        switch (vaultTabType) {
            case VaultTabType.Credentials:
                return I18N_KEYS.ADD_PASSWORD_CTA;
            case VaultTabType.SecureNotes:
                return I18N_KEYS.ADD_SECURE_NOTE_CTA;
            case VaultTabType.Payments:
                return I18N_KEYS.ADD_PAYMENT_CTA;
            default:
                return I18N_KEYS.ADD_PASSWORD_CTA;
        }
    };
    const getI18NAdviceKey = () => {
        switch (vaultTabType) {
            case VaultTabType.Credentials:
                return I18N_KEYS.ADD_PASSWORD_ADVICE;
            case VaultTabType.SecureNotes:
                return I18N_KEYS.ADD_SECURE_NOTE_ADVICE;
            case VaultTabType.Payments:
                return I18N_KEYS.ADD_PAYMENT_ADVICE;
            default:
                return I18N_KEYS.ADD_PASSWORD_ADVICE;
        }
    };
    return (<article className={styles.searchMessage}>
      <header className={styles.noResultsHeader}>
        <SearchIcon color={colors.grey05} size={70}/>
        <span className={styles.noResultsTitle}>
          {translate(I18N_KEYS.NO_RESULTS_FOR_QUERY, { searchValue })}
        </span>
      </header>
      <p>{translate(I18N_KEYS.SPELL_CHECK_ADVICE)}</p>
      <p>{translate(getI18NAdviceKey())}</p>
      <Button onClick={handleClickOnAddNewItem} size="small" type="button">
        {translate(getI18NAddKey())}
      </Button>
    </article>);
};
