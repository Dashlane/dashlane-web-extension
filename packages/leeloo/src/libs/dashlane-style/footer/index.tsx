import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
export const Footer = () => {
    const { translate } = useTranslate();
    return (<footer className={styles.footer}>
      <div className={styles.footerWrapper}>
        <p className={styles.copyright}>{translate('footer_copyright')}</p>
        <p className={styles.description}>{translate('footer_description')}</p>
      </div>
    </footer>);
};
