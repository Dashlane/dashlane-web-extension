import { Fragment } from 'react';
import { Button, Paragraph, TextArea } from '@dashlane/design-system';
import { FlexContainer, GridChild, GridContainer, jsx, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { CopyButton } from 'libs/dashlane-style/copy-button';
import { DownloadButton } from 'libs/dashlane-style/download-button';
import { LOCALE_FORMAT } from 'libs/i18n/helpers';
import { fromUnixTime } from 'date-fns';
const I18N_KEYS = {
    GENERATE_CONFIGURATION_BUTTON: 'team_settings_encryption_service_generate_configuration_button',
    GENERATE_CONFIGURATION_LABEL: 'team_settings_encryption_service_generate_configuration_label',
    GENERATE_CONFIGURATION_LABEL_HELPER: 'team_settings_encryption_service_generate_configuration_label_helper',
    COPY_CONFIGURATION_BUTTON: 'input_copy_button',
    DOWNLOAD_CONFIGURATION_BUTTON: 'team_settings_encryption_service_config_download_button',
    GENERATE_CONFIGURATION_BUTTON_RESET: 'team_settings_encryption_service_generate_configuration_reset_button',
    GENERATE_CONFIGURATION_TIMESTAMP: 'team_settings_encryption_service_generate_configuration_timestamp',
};
interface ConfigGeneratorProps {
    value?: string;
    disabled: boolean;
    error?: string;
    isLoading?: boolean;
    configRegenRequired: boolean;
    lastGeneratedTimeStamp?: number;
}
const CONFIG_FILE_NAME = 'dashlane-encryption-service-config.txt';
const CONFIG_FILE_TYPE = 'text/plain';
const ES_CONFIG_LABEL_ID = 'esConfigurationLabel';
export const BasicConfigField = ({ value, disabled, error, isLoading = false, configRegenRequired, lastGeneratedTimeStamp, }: ConfigGeneratorProps) => {
    const { translate } = useTranslate();
    const lastGeneratedTimeStampDisplay = lastGeneratedTimeStamp ? (<FlexContainer gap="4px" sx={{ mt: '8px' }} justifyContent="center">
      <Paragraph textStyle="ds.body.reduced.strong">
        {translate(I18N_KEYS.GENERATE_CONFIGURATION_TIMESTAMP)}
      </Paragraph>
      <Paragraph textStyle="ds.body.reduced.regular">
        {fromUnixTime(lastGeneratedTimeStamp).toLocaleString(navigator.language, {
            ...LOCALE_FORMAT.lll,
            timeZoneName: 'short',
        })}
      </Paragraph>
    </FlexContainer>) : null;
    return (<GridContainer gridTemplateAreas="'label button' 'description button' 'timestamp timestamp' 'config buttons'" gridTemplateColumns="3fr 1fr" sx={{ gridColumnGap: '8px' }}>
      <GridChild gridArea="label" sx={{ paddingBottom: '8px' }} as={Paragraph} innerAs="label" id={ES_CONFIG_LABEL_ID} textStyle="ds.title.block.medium">
        {translate(I18N_KEYS.GENERATE_CONFIGURATION_LABEL)}
      </GridChild>
      <GridChild gridArea="description" as={Paragraph}>
        {translate(I18N_KEYS.GENERATE_CONFIGURATION_LABEL_HELPER)}
      </GridChild>
      <GridChild gridArea="button">
        <Button disabled={disabled || isLoading} mood={value && !configRegenRequired ? 'neutral' : 'brand'} intensity={value && !configRegenRequired ? 'quiet' : 'catchy'} fullsize type="submit" isLoading={isLoading}>
          {translate(I18N_KEYS.GENERATE_CONFIGURATION_BUTTON)}
        </Button>
        {!configRegenRequired ? lastGeneratedTimeStampDisplay : null}
      </GridChild>
      {value ? (<>
          <GridChild gridArea="config" sx={{ marginTop: '18px' }}>
            <TextArea aria-labelledby={ES_CONFIG_LABEL_ID} readOnly disabled={configRegenRequired} value={value} feedback={error
                ? {
                    text: error,
                }
                : undefined} error={!!error}/>
          </GridChild>
          <GridChild as={FlexContainer} gridArea="buttons" sx={{ marginTop: '18px' }} flexDirection="column" gap="8px">
            <CopyButton disabled={configRegenRequired} copyValue={value} buttonText={translate(I18N_KEYS.COPY_CONFIGURATION_BUTTON)} fullsize/>
            <DownloadButton disabled={configRegenRequired} buttonText={translate(I18N_KEYS.DOWNLOAD_CONFIGURATION_BUTTON)} downloadString={value} fileName={CONFIG_FILE_NAME} fileType={CONFIG_FILE_TYPE} fullsize/>
          </GridChild>
        </>) : null}
    </GridContainer>);
};
