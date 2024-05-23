import React, { PropsWithChildren } from 'react';
import { Lockup, LockupColor, LockupSize } from '@dashlane/ui-components';
import Animation from 'libs/dashlane-style/animation';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './progress-wrapper.css';
export interface Props {
    description: string;
    subdescription?: string;
    animation: unknown;
    shouldLoopAnimation?: boolean;
    progressValue?: number;
}
const I18N_KEYS = {
    LOGO_TITLE: '_common_dashlane_logo_title',
    PERCENTAGE: '_common_generic_percentage',
};
export const Progress = ({ description, subdescription, animation, shouldLoopAnimation = false, progressValue = 0, children, }: PropsWithChildren<Props>) => {
    const { translate } = useTranslate();
    return (<div className={styles.progressContainer}>
      <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39} title={translate(I18N_KEYS.LOGO_TITLE)}/>

      <div className={styles.content}>
        <Animation height={65} width={65} animationParams={{
            renderer: 'svg',
            animationData: animation,
            loop: shouldLoopAnimation,
            autoplay: true,
        }}/>

        <p className={styles.progressValue}>
          {translate(I18N_KEYS.PERCENTAGE, { number: progressValue })}
        </p>

        <h2 className={styles.description}>{description}</h2>

        {subdescription ? (<p className={styles.subDescription}>{subdescription}</p>) : null}

        {children}
      </div>
    </div>);
};
