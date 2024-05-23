import * as React from 'react';
import { Lockup, LockupColor, LockupSize } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Footer } from 'libs/dashlane-style/footer';
import styles from './styles.css';
export const JoinFamily = ({ children }: React.PropsWithChildren<{}>) => {
    const { translate } = useTranslate();
    return (<div className={styles.wrapper}>
      <div className={styles.joinFamilyWrapper}>
        <div className={styles.logo}>
          <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39} title={translate('_common_dashlane_logo_title')}/>
        </div>
        {children}
      </div>
      <Footer />
    </div>);
};
