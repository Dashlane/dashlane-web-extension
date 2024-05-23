import * as React from 'react';
import { colors, TaxIcon } from '@dashlane/ui-components';
import styles from './styles.css';
export const BankAccountIcon = () => {
    return (<div className={styles.iconWrapper}>
      <TaxIcon size={48} color={colors.white}/>
    </div>);
};
