import * as React from 'react';
import { Icon } from '@dashlane/design-system';
import useTranslate from 'src/libs/i18n/useTranslate';
import { AutofillPreferencesContent } from './preferences-content';
import styles from 'app/autofillSettings/styles.css';
const I18N_KEYS = {
    NEW_HEADER: 'tab/autofill_settings/autofill',
    BACK_TO_SETTINGS: 'tab/autofill_settings/preferences/back_to_autofill_settings',
};
export interface PreferencesViewProps {
    handleClickBackToSettings: () => void;
}
export const PreferencesView = ({ handleClickBackToSettings, }: PreferencesViewProps) => {
    const { translate } = useTranslate();
    return (<>
      <header className={styles.header} tabIndex={-1}>
        <button onClick={handleClickBackToSettings} className={styles.headerButton} aria-label={translate(I18N_KEYS.BACK_TO_SETTINGS)}>
          <Icon name="ArrowLeftOutlined"/>
          {translate(I18N_KEYS.NEW_HEADER)}
        </button>
      </header>

      <div className={styles.container} tabIndex={0}>
        <AutofillPreferencesContent />
      </div>
    </>);
};
