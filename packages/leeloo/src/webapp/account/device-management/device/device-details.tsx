import * as React from 'react';
import { LocaleFormat } from 'libs/i18n/helpers';
import LocalizedTimeAgo from 'libs/i18n/localizedTimeAgo';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    LABEL_AUTHORIZED_DATE: 'webapp_account_devices_device_label_authorized_date',
    LABEL_LAST_UPDATE: 'webapp_account_devices_device_label_last_update_time',
};
interface Props {
    creationDate: Date;
    lastUpdateDate: Date;
}
export const DeviceDetails = ({ creationDate, lastUpdateDate }: Props) => {
    const { translate } = useTranslate();
    const shortDate = translate.shortDate;
    return (<div>
      <div className={styles.propertiesWrapper}>
        <span className={styles.propertyLabel}>
          {translate(I18N_KEYS.LABEL_AUTHORIZED_DATE)}{' '}
        </span>
        <span className={styles.date}>
          {shortDate(creationDate, LocaleFormat.L)}
        </span>
      </div>
      <div className={styles.propertiesWrapper}>
        <span className={styles.propertyLabel}>
          {translate(I18N_KEYS.LABEL_LAST_UPDATE)}{' '}
        </span>
        <span className={styles.date}>
          <LocalizedTimeAgo date={lastUpdateDate}/>
        </span>
      </div>
    </div>);
};
