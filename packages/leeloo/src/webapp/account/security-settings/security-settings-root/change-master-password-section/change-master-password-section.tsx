import { Fragment, useState } from 'react';
import { colors, GridChild, InfoBox, LoadingIcon, } from '@dashlane/ui-components';
import { Button, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { ActivePanel } from 'webapp/account/security-settings/security-settings';
import { useIsChangeMasterPasswordEnabled } from 'webapp/account/security-settings/security-settings-root/change-master-password-section/hooks/use-is-change-master-password-enabled';
import { SettingsSection } from '../settings-section/settings-section';
import { AuthorizationStepDialog } from '../../change-master-password-root/authorization-step-dialog/authorization-step-dialog';
import { ChangeMasterPasswordInfoboxWrapper } from './change-master-password-security-infobox-wrapper';
import { TwoFactorAuthenticationInfo, TwoFactorAuthenticationInfoRequestStatus, TwoFactorAuthenticationType, } from '@dashlane/communication';
import { useUserLogin } from 'libs/hooks/useUserLogin';
const I18N_KEYS = {
    TITLE: 'webapp_account_security_settings_changemp_section_title',
    DESCRIPTION: 'webapp_account_security_settings_changemp_section_description',
    NOTE: 'webapp_account_security_settings_changemp_section_note_markup',
    CHANGE_BUTTON: 'webapp_account_security_settings_changemp_section_button',
    CHANGE_MP_DISABLED_1: 'webapp_account_security_settings_changemp_section_button_disabled_1',
    CHANGE_MP_DISABLED_2: 'webapp_account_security_settings_changemp_section_button_disabled_2',
    TIP_MP_COMPROMISED_INFOBOX_TITLE: 'webapp_account_security_settings_changemp_section_tip_mpcompromised_infobox_title',
    TIP_MP_COMPROMISED_INFOBOX_DESCRIPTION: 'webapp_account_security_settings_changemp_section_tip_mpcompromised_infobox_description',
    TIP_MP_WEAK_INFOBOX_TITLE: 'webapp_account_security_settings_changemp_section_tip_mpweak_infobox_title',
    TIP_MP_WEAK_INFOBOX_DESCRIPTION: 'webapp_account_security_settings_changemp_section_tip_mpweak_infobox_description',
    LOADING_DATA: 'webapp_loader_loading',
};
interface Props {
    changeActivePanel: (panel: ActivePanel) => void;
    twoFactorAuthenticationInfo: TwoFactorAuthenticationInfo | undefined;
}
export const ChangeMasterPasswordSection = ({ changeActivePanel, twoFactorAuthenticationInfo, }: Props) => {
    const { translate } = useTranslate();
    const login = useUserLogin() ?? '';
    const [showAutorizationDialog, setShowAuthorizationDialog] = useState(false);
    const showChangeMPPanel = () => {
        changeActivePanel(ActivePanel.ChangeMP);
        if (showAutorizationDialog) {
            setShowAuthorizationDialog(false);
        }
    };
    const handleChangeMasterPassword = () => {
        if (twoFactorAuthenticationInfo?.status ===
            TwoFactorAuthenticationInfoRequestStatus.READY &&
            twoFactorAuthenticationInfo.isTwoFactorAuthenticationEnabled &&
            twoFactorAuthenticationInfo.type !== TwoFactorAuthenticationType.SSO) {
            setShowAuthorizationDialog(true);
        }
        else {
            showChangeMPPanel();
        }
    };
    const isEnabled = useIsChangeMasterPasswordEnabled();
    const ActionButton = ({ disabled }: {
        disabled: boolean;
    }) => (<Button type="button" mood="brand" size="small" onClick={handleChangeMasterPassword} disabled={disabled} sx={{ marginTop: '8px' }}>
      {translate(I18N_KEYS.CHANGE_BUTTON)}
    </Button>);
    const ChangeMasterPasswordLoadingSection = () => (<GridChild justifySelf="flex-start" id="changeMasterPasswordLoading" sx={{ marginTop: '20px' }} title={translate(I18N_KEYS.LOADING_DATA)}>
      <LoadingIcon color={colors.midGreen01} size={40} aria-describedby="changeMasterPasswordLoading"/>
    </GridChild>);
    const ChangeMasterPasswordErrorSection = () => (<GridChild justifySelf="flex-start">
      <InfoBox severity="alert" size="small" title={translate(I18N_KEYS.CHANGE_MP_DISABLED_1)}/>
    </GridChild>);
    const ChangeMasterPasswordReadySection = () => (<>
      {isEnabled ? (<>
          <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular">
            {translate(I18N_KEYS.DESCRIPTION)}
          </Paragraph>
          <ChangeMasterPasswordInfoboxWrapper />
          <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular">
            {translate.markup(I18N_KEYS.NOTE)}
          </Paragraph>
        </>) : null}
      <GridChild justifySelf="flex-start">
        {<>
            {!isEnabled ? (<>
                <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular" sx={{ marginBottom: '8px' }}>
                  {translate(I18N_KEYS.CHANGE_MP_DISABLED_1)}
                </Paragraph>
                <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular">
                  {translate(I18N_KEYS.CHANGE_MP_DISABLED_2)}
                </Paragraph>
              </>) : null}
            <ActionButton disabled={!isEnabled}/>
          </>}
      </GridChild>
    </>);
    const isChangeMPSectionReady = twoFactorAuthenticationInfo?.status ===
        TwoFactorAuthenticationInfoRequestStatus.READY;
    const isChangeMPSectionError = twoFactorAuthenticationInfo?.status ===
        TwoFactorAuthenticationInfoRequestStatus.ERROR;
    return (<>
      <SettingsSection sectionTitle={translate(I18N_KEYS.TITLE)}>
        {isChangeMPSectionReady ? (<ChangeMasterPasswordReadySection />) : isChangeMPSectionError ? (<ChangeMasterPasswordErrorSection />) : (<ChangeMasterPasswordLoadingSection />)}
      </SettingsSection>
      {showAutorizationDialog ? (<AuthorizationStepDialog handleOnCancel={() => setShowAuthorizationDialog(false)} handleOnSubmit={showChangeMPPanel} login={login}/>) : null}
    </>);
};
