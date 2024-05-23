import * as React from 'react';
import { InfoBox } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { DASHLANE_UPDATE_NEEDED } from 'team/urls';
import styles from './styles.css';
const I18N_KEYS = {
    UPDATE_TITLE: 'webapp_update_title',
    UPDATE_BODY: 'webapp_update_body_markup',
    UPDATE_BODY_SECONDARY: 'webapp_update_body_secondary_markup',
};
export const DashlaneUpdateNeeded = () => {
    const { translate } = useTranslate();
    return (<InfoBox size="simple" title={<h2 className={styles.title}>{translate(I18N_KEYS.UPDATE_TITLE)}</h2>} className={styles.infoBox}>
      <>
        <p className={styles.description}>
          {translate.markup(I18N_KEYS.UPDATE_BODY)}
        </p>
        {translate.markup(I18N_KEYS.UPDATE_BODY_SECONDARY, {
            learnMore: DASHLANE_UPDATE_NEEDED,
        })}
      </>
    </InfoBox>);
};
