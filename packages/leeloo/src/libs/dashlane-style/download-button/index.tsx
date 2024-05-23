import { Key } from 'react';
import { jsx, PropsOf, Tooltip } from '@dashlane/ui-components';
import { Button, Icon } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { downloadFile } from 'libs/file-download/file-download';
const I18N_KEYS = {
    DOWNLOAD: 'team_settings_encryption_service_config_download_button',
};
interface DownloadButtonProps extends Omit<PropsOf<typeof Button>, 'type'>, Partial<Pick<PropsOf<typeof Button>, 'type'>> {
    downloadString: string;
    fileName: string;
    fileType: string;
    buttonText?: string;
    key?: Key | undefined;
}
export const DownloadButton = ({ downloadString, fileName, fileType, buttonText, type = 'button', disabled, ...rest }: DownloadButtonProps) => {
    const { translate } = useTranslate();
    const handleButtonClick = () => {
        downloadFile(downloadString, fileName, fileType);
    };
    const hideTooltip = disabled || Boolean(buttonText);
    return (<Tooltip content={translate(I18N_KEYS.DOWNLOAD)} placement="bottom" passThrough={hideTooltip}>
      <Button type={type} mood="neutral" intensity="quiet" layout="iconLeading" onClick={handleButtonClick} icon={<Icon name="DownloadOutlined" size="small"/>} size="medium" disabled={disabled} {...rest}>
        {buttonText}
      </Button>
    </Tooltip>);
};
