import * as React from 'react';
import ButtonTransparent from 'libs/dashlane-style/buttons/modern/transparent';
import useTranslate from 'libs/i18n/useTranslate';
import styles from '../styles.css';
const I18N_KEYS = {
    SEE_MORE: 'webapp_sidemenu_search_results_see_more',
};
interface LoadMoreProps {
    loadMore: () => void;
    remaining: number;
}
export const LoadMore = ({ loadMore, remaining }: LoadMoreProps) => {
    const { translate } = useTranslate();
    return remaining ? (<ButtonTransparent classNames={[styles.loadMore]} size="small" label={translate(I18N_KEYS.SEE_MORE, {
            count: remaining,
        })} onClick={loadMore}/>) : null;
};
