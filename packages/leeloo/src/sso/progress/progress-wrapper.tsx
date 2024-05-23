import React, { PropsWithChildren } from 'react';
import { Lockup, LockupColor, LockupSize } from '@dashlane/ui-components';
import Animation from 'libs/dashlane-style/animation';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './progress-wrapper.css';
export interface Props {
    animation: unknown;
    shouldLoopAnimation?: boolean;
    progressValue?: number;
}
const I18N_KEYS = {
    LOGO_TITLE: '_common_dashlane_logo_title',
    DESCRIPTION: 'webapp_sso_changemp_loading_desc',
    SUB_DESCRIPTION: 'webapp_sso_changemp_loading_warning',
    PERCENTAGE: '_common_generic_percentage',
};
export const Progress = ({ animation, shouldLoopAnimation = false, progressValue = 0, }: PropsWithChildren<Props>) => {
    const { translate } = useTranslate();
    return (<>
      <div className={styles.logo}>
        <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39} title={translate(I18N_KEYS.LOGO_TITLE)}/>
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.content}>
          <Animation height={96} width={96} animationParams={{
            renderer: 'svg',
            animationData: animation,
            loop: shouldLoopAnimation,
            autoplay: true,
        }}/>

          <p className={styles.progressValue}>
            {translate(I18N_KEYS.PERCENTAGE, { number: progressValue })}
          </p>

          <h2 className={styles.description}>
            {translate(I18N_KEYS.DESCRIPTION)}
          </h2>
          <p className={styles.subDescription}>
            {translate(I18N_KEYS.SUB_DESCRIPTION)}
          </p>
        </div>
      </div>
    </>);
};
