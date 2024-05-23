import { colors, DialogBody, DialogFooter, DialogTitle, InfoBox, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    WARNING_TITLE: 'webapp_u2f_remove_authenticator_warning_title',
    WARNING_DESCRIPTION: 'webapp_u2f_remove_authenticator_warning_description',
    WARNING_CONTENT: 'webapp_u2f_remove_authenticator_warning_content',
    WARNING_PRIMARY_BUTTON: 'webapp_u2f_remove_authenticator_warning_button',
    WARNING_SECONDARY_BUTTON: '_common_action_cancel',
};
interface Props {
    handleClickOnSubmit: () => void;
    handleClickOnBack: () => void;
}
export const U2FAuthenticatorRemoveWarningDialogContent = ({ handleClickOnSubmit, handleClickOnBack, }: Props) => {
    const { translate } = useTranslate();
    return (<div sx={{
            maxWidth: '576px',
        }}>
      <DialogTitle title={translate(I18N_KEYS.WARNING_TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_KEYS.WARNING_DESCRIPTION)}
          <InfoBox severity="warning" size="small" title={translate(I18N_KEYS.WARNING_CONTENT)} sx={{ marginTop: '15px' }}/>
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.WARNING_PRIMARY_BUTTON)} primaryButtonOnClick={handleClickOnSubmit} primaryButtonProps={{ theme: 'warning' }} secondaryButtonTitle={translate(I18N_KEYS.WARNING_SECONDARY_BUTTON)} secondaryButtonOnClick={handleClickOnBack}/>
    </div>);
};
