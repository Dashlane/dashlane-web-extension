import { Fragment } from 'react';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { autofillSettingsApi, isDashlaneDisabledPermanently, } from '@dashlane/autofill-contracts';
import { ParsedURL } from '@dashlane/url-parser';
import { jsx } from '@dashlane/ui-components';
import { Website } from 'src/store/types';
import useTranslate from 'src/libs/i18n/useTranslate';
import { AutofillDisabledOnFieldsStatus } from '../autofill-on-fields-status';
import { AutofillSettingsContent } from './settings-content';
import styles from 'app/autofillSettings/styles.css';
const I18N_KEYS = {
    NEW_HEADER: 'tab/autofill_settings/autofill',
};
export interface SettingsViewProps {
    website: Website;
    handleClickGoToPreferences: () => void;
}
export const SettingsView = ({ website, handleClickGoToPreferences, }: SettingsViewProps) => {
    const { translate } = useTranslate();
    const { setUserAutofillCorrections } = useModuleCommands(autofillSettingsApi);
    const getAutofillSettingsResult = useModuleQuery(autofillSettingsApi, 'getUserAutofillCorrections');
    const tabFullDomain = new ParsedURL(website.fullUrl).getHostname();
    const userCorrections = getAutofillSettingsResult.status === DataStatus.Success
        ? getAutofillSettingsResult.data
        : [];
    const disablingRules = userCorrections.filter((correction) => correction.domain === tabFullDomain &&
        isDashlaneDisabledPermanently(correction));
    const handleResetDisabledFields = () => {
        const restoredUserAutofillCorrections = userCorrections.filter((correction) => correction.domain !== tabFullDomain ||
            !isDashlaneDisabledPermanently(correction));
        void setUserAutofillCorrections({
            corrections: restoredUserAutofillCorrections,
        });
    };
    return (<>
      <header className={styles.header} sx={{
            backgroundColor: 'ds.container.expressive.brand.quiet.active',
        }} tabIndex={-1}>
        <h2>{translate(I18N_KEYS.NEW_HEADER)}</h2>
      </header>

      <div className={styles.container}>
        <AutofillSettingsContent website={website} changeActiveView={handleClickGoToPreferences}/>
      </div>

      <AutofillDisabledOnFieldsStatus disabledFields={disablingRules.length} resetFieldsHandler={handleResetDisabledFields}/>
    </>);
};
