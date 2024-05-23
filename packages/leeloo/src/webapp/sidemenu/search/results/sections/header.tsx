import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import styles from '../../styles.css';
export const Header = ({ i18nKey }: {
    i18nKey: string;
}) => {
    const { translate } = useTranslate();
    return (<header className={styles.headingWrapper}>
      <h1 className={styles.heading}>{translate(i18nKey)}</h1>
    </header>);
};
