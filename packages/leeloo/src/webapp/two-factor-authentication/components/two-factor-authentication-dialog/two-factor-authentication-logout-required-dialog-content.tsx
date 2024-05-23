import { colors, CrossCircleIcon, DialogBody, DialogFooter, DialogTitle, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
interface Props {
    handleClickOnSubmit: () => void;
}
const I18N_KEYS = {
    ACTION: 'webapp_two_factor_authentication_logout_dialog_action',
    DESCRIPTION: 'webapp_two_factor_authentication_logout_dialog_description',
    TITLE: 'webapp_two_factor_authentication_logout_dialog_title',
};
export const TwoFactorAuthenticationLogoutRequiredDialog = ({ handleClickOnSubmit, }: Props) => {
    const { translate } = useTranslate();
    return (<div sx={{
            maxWidth: '480px',
        }}>
      <CrossCircleIcon size={96}/>
      <DialogTitle title={translate(I18N_KEYS.TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.grey00}>
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.ACTION)} primaryButtonProps={{
            type: 'button',
            autoFocus: true,
        }} primaryButtonOnClick={() => handleClickOnSubmit()}/>
    </div>);
};
