import * as React from 'react';
import { CrossedFieldIcon, InfoCircleIcon } from '@dashlane/ui-components';
import { Button } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { AUTOFILL_CORRECTION_URL as HELP_CENTER_LINK } from 'libs/externalUrls';
import styles from './styles.css';
export interface AutofillDisabledOnFieldsStatusProps {
    disabledFields: number;
    resetFieldsHandler: () => void;
}
const I18N_KEYS = {
    RESUME_BUTTON: 'common/action/resume',
    CORRECTION_DISABLED: 'tab/autofill_settings/settings_autofill_correction_disabled',
    CORRECTION_EMPTY_STATE_INFO_TITLE: 'tab/autofill_settings/setting_autofill_correction_empty_state_info_title',
    CORRECTION_EMPTY_STATE_INFO_CONTENT: 'tab/autofill_settings/setting_autofill_correction_empty_state_info_content',
    CORRECTION_EMPTY_STATE_INFO_CTA: 'tab/autofill_settings/setting_autofill_correction_empty_state_info_cta',
};
export const AutofillDisabledOnFieldsStatus = ({ disabledFields, resetFieldsHandler, }: AutofillDisabledOnFieldsStatusProps) => {
    const { translate } = useTranslate();
    return (<div className={styles.container}>
      {disabledFields ? (<div className={styles.someDisabled}>
          <CrossedFieldIcon />
          <div>
            <span className={styles.correctionStatus}>
              {translate(I18N_KEYS.CORRECTION_DISABLED)}
              &thinsp;
            </span>
          </div>
          <Button mood="brand" intensity="catchy" onClick={resetFieldsHandler} role="link" size="small">
            {translate(I18N_KEYS.RESUME_BUTTON)}
          </Button>
        </div>) : (<div className={styles.noneDisabled}>
          <InfoCircleIcon />
          <div>
            <span className={styles.didYouKnow}>
              {translate(I18N_KEYS.CORRECTION_EMPTY_STATE_INFO_TITLE)}
            </span>
            <span className={styles.correctionEmptyState}>
              {translate(I18N_KEYS.CORRECTION_EMPTY_STATE_INFO_CONTENT)}
              &thinsp;
              <a className={styles.learnMore} href={HELP_CENTER_LINK}>
                {translate(I18N_KEYS.CORRECTION_EMPTY_STATE_INFO_CTA)}
              </a>
            </span>
          </div>
        </div>)}
    </div>);
};
