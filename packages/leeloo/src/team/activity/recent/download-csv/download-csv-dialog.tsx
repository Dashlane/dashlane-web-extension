import { colors, Dialog, DialogTitle, InfoBox, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { DownloadProgress } from './download-progress';
export const I18N_KEYS = {
    DOWNLOAD_MODAL_BODY: 'team_activity_download_modal_body',
    DOWNLOAD_MODAL_TITLE: 'team_activity_download_modal_title',
    DOWNLOAD_MODAL_WARNING: 'team_activity_download_modal_warning',
    CLOSE: '_common_dialog_dismiss_button',
};
interface Props {
    isOpen: boolean;
    progress: number;
    onClose: () => void;
}
export const DownloadCSVDialog = ({ isOpen, progress, onClose }: Props) => {
    const { translate } = useTranslate();
    return (<Dialog isOpen={isOpen} onClose={onClose} closeIconName={translate(I18N_KEYS.CLOSE)} ariaDescribedby="csv-download-dialog-body" ariaLabelledby="csv-download-dialog-title">
      <DialogTitle id="csv-download-dialog-title" title={translate(I18N_KEYS.DOWNLOAD_MODAL_TITLE)}/>
      
      <div sx={{
            maxHeight: 'fit-content',
            overflowX: 'hidden',
            overflowY: 'auto',
        }}>
        <DownloadProgress progressPercent={progress}/>
        <Paragraph size="medium" sx={{ marginTop: 5, marginBottom: 6, color: colors.grey00 }}>
          {translate(I18N_KEYS.DOWNLOAD_MODAL_BODY)}
        </Paragraph>
        <InfoBox severity="warning" size="small" title={translate(I18N_KEYS.DOWNLOAD_MODAL_WARNING)}/>
      </div>
    </Dialog>);
};
