import { Alert, AlertSeverity, AlertSize, Button, Card, colors, DownloadIcon, Eyebrow, FlexChild, FlexContainer, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import { downloadTextFile } from 'libs/file-download/file-download';
import useTranslate from 'libs/i18n/useTranslate';
import { BACKUP_CODES_FILENAME } from 'webapp/two-factor-authentication/constants';
const I18N_KEYS = {
    TITLE1: 'webapp_account_security_settings_two_factor_authentication_backup_codes_title1',
    TITLE2: 'webapp_account_security_settings_two_factor_authentication_backup_codes_title2',
    DESCRIPTION: 'webapp_account_security_settings_two_factor_authentication_backup_codes_description',
    LIST_LABEL: 'webapp_account_security_settings_two_factor_authentication_backup_codes_list_label',
    DOWNLOAD_BUTTON: 'webapp_account_security_settings_two_factor_authentication_backup_codes_download_button',
    INFO: 'webapp_account_security_settings_two_factor_authentication_backup_codes_info',
};
interface Props {
    backupCodes: string[];
}
export const BackupCodesForm = ({ backupCodes }: Props) => {
    const { translate } = useTranslate();
    const handleDownloadClicked = () => {
        const content = backupCodes?.join('\n');
        downloadTextFile(content, BACKUP_CODES_FILENAME);
    };
    return (<FlexContainer flexDirection="column" justifyContent="flex-start">
      <Heading sx={{ mt: '8px', fontSize: '25px' }} as="span">
        {translate(I18N_KEYS.TITLE1)}
      </Heading>
      <Heading sx={{ mb: '16px', fontSize: '25px' }} as="span">
        {translate(I18N_KEYS.TITLE2)}
      </Heading>
      <Paragraph sx={{ mb: '26px' }} color={colors.grey00}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
      <Eyebrow sx={{ mb: '6px' }} color={colors.dashGreen01}>
        {translate(I18N_KEYS.LIST_LABEL)}
      </Eyebrow>
      <Card sx={{ padding: '8px 12px', width: '100%' }}>
        {backupCodes?.map((code, index) => (<Paragraph key={code} data-testid={`two-factor-authentication-backup-code-${index}`}>
            {code}
          </Paragraph>))}
      </Card>

      <Button sx={{ margin: '26px 0px' }} type="button" nature="secondary" onClick={handleDownloadClicked}>
        <FlexContainer>
          <FlexChild sx={{ mr: '10px' }}>
            <DownloadIcon size={16}/>
          </FlexChild>
          {translate(I18N_KEYS.DOWNLOAD_BUTTON)}
        </FlexContainer>
      </Button>
      <Alert severity={AlertSeverity.SUBTLE} size={AlertSize.SMALL} showIcon>
        {translate(I18N_KEYS.INFO)}
      </Alert>
    </FlexContainer>);
};
