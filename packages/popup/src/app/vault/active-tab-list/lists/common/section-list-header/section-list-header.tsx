import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    CREDENTIAL_COUNT: 'tab/all_items/credential_count',
    CREDENTIAL_ONE_ITEM: 'tab/all_items/credential_one_item',
};
interface Props {
    itemsCount: number;
    headerRef: React.RefObject<HTMLDivElement>;
}
export const SectionListHeader = ({ itemsCount, headerRef, children, }: React.PropsWithChildren<Props>) => {
    const { translate } = useTranslate();
    const getItemsCountTranslation = (): string => {
        if (itemsCount <= 0) {
            return '';
        }
        if (itemsCount === 1) {
            return translate(I18N_KEYS.CREDENTIAL_ONE_ITEM);
        }
        return translate(I18N_KEYS.CREDENTIAL_COUNT, { count: itemsCount });
    };
    const itemsCountTranslation = getItemsCountTranslation();
    return (<header className={styles.listHeaderWrapper} ref={headerRef}>
      {children}
      {itemsCountTranslation !== '' ? (<span>{itemsCountTranslation}</span>) : null}
    </header>);
};
