import * as React from 'react';
import { CloseIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from '../styles.css';
const I18N_KEYS = {
    HEADER: 'passwordGeneratedHistory/header',
};
interface PasswordGeneratedHistoryHeaderProps {
    onClose: () => void;
}
export const PasswordGeneratedHistoryHeader: React.FC<PasswordGeneratedHistoryHeaderProps> = React.memo(function PasswordGeneratedHistoryHeader({ onClose }) {
    const { translate } = useTranslate();
    return (<header className={styles.header}>
        <h2>{translate(I18N_KEYS.HEADER)}</h2>
        <button className={styles.headerIcon} onClick={onClose} aria-label="close">
          <CloseIcon />
        </button>
      </header>);
});
