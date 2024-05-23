import { colors, Eyebrow, GridChild, GridContainer, jsx, PasswordInput, TextInput, UnlockFillIcon, } from '@dashlane/ui-components';
import { TutorialStep, TutorialStepStatus } from './tutorial-step';
import useTranslate from 'libs/i18n/useTranslate';
import { CopyToClipboardButton } from 'webapp/credentials/edit/copy-to-clipboard-control';
import { logUserCopyEmailEvent, logUserCopyPasswordEvent } from '../logs';
const I18N_KEYS = {
    HEADING: 'webapp_vpn_page_credential_active_heading',
    EMAIL: 'webapp_vpn_page_credential_active_login_label',
    PASSWORD: 'webapp_vpn_page_credential_active_password_label',
    HIDE: 'webapp_vpn_page_credential_active_hide_password',
    SHOW: 'webapp_vpn_page_credential_active_show_password',
};
const EMAIL_INPUT_ID = 'vpnEmailTextInput';
const PASSWORD_INPUT_ID = 'vpnPasswordInput';
interface VpnCredentialFormProps {
    email: string;
    password: string;
    credentialId: string;
}
const inputStyle = { maxWidth: '464px' };
const lockedLabel = (labelText: string, htmlForId: string) => (<Eyebrow key={labelText} sx={{ mr: '5px' }} as="label" htmlFor={htmlForId} size="small" color={colors.dashGreen01}>
    {labelText}
  </Eyebrow>);
const unlockIcon = (iconKey: string) => (<UnlockFillIcon key={`lockIcon-${iconKey}`} color={colors.dashGreen01} size={10} aria-hidden/>);
export const VpnCredentialForm = ({ email, password, credentialId, }: VpnCredentialFormProps) => {
    const { translate } = useTranslate();
    const emailLabel = [
        lockedLabel(translate(I18N_KEYS.EMAIL), EMAIL_INPUT_ID),
        unlockIcon(EMAIL_INPUT_ID),
    ];
    const passwordLabel = [
        lockedLabel(translate(I18N_KEYS.PASSWORD), PASSWORD_INPUT_ID),
        unlockIcon(PASSWORD_INPUT_ID),
    ];
    return (<GridContainer gridTemplateColumns={'minmax(auto, 464px) auto'} gap="16px" alignItems="flex-end">
      <TextInput sx={inputStyle} value={email} readOnly fullWidth autoComplete="off" label={emailLabel} id={EMAIL_INPUT_ID}/>
      <GridChild>
        <CopyToClipboardButton data={email} onCopy={logUserCopyEmailEvent(credentialId)}/>
      </GridChild>

      <form>
        <PasswordInput sx={inputStyle} value={password} readOnly fullWidth hidePasswordTooltipText={translate(I18N_KEYS.HIDE)} showPasswordTooltipText={translate(I18N_KEYS.SHOW)} autoComplete="off" label={passwordLabel} title={translate(I18N_KEYS.PASSWORD)} id={PASSWORD_INPUT_ID}/>
      </form>
      <GridChild>
        <CopyToClipboardButton data={password} onCopy={logUserCopyPasswordEvent(credentialId)}/>
      </GridChild>
    </GridContainer>);
};
export const VpnViewCredentials = ({ email, password, credentialId, }: VpnCredentialFormProps) => {
    const { translate } = useTranslate();
    return (<TutorialStep options={{ easeIn: true, easeOut: false }} status={TutorialStepStatus.COMPLETED} title={translate(I18N_KEYS.HEADING)}>
      <VpnCredentialForm email={email} password={password} credentialId={credentialId}/>
    </TutorialStep>);
};
