import React, { useEffect, useState } from 'react';
import { Button, Toggle } from '@dashlane/ui-components';
import { carbonConnector } from 'libs/carbon/connector';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import Row from 'team/settings/base-page/row';
import { EnableSsoDialog } from 'team/settings/sso/enable-sso-step/enable-dialog';
import { DisableSsoDialog } from 'team/settings/sso/enable-sso-step/disable-dialog';
import styles from 'team/settings/sso/enable-sso-step/styles.css';
import { DialogAction, SSOSettingSectionProps, SSOSettingStep, } from 'team/settings/sso/types';
import { DASHLANE_SUPPORT } from 'team/urls';
const I18N_KEYS = {
    CONTACT_SUPPORT_BUTTON: 'team_settings_enable_sso_contact_support',
    TEST_TITLE: 'team_settings_enable_sso_test_title',
    TEST_DESCRIPTION: 'team_settings_enable_sso_test_description',
    TEST_BUTTON: 'team_settings_enable_sso_test_button',
    ACTION_TITLE: 'team_settings_enable_sso_action_title',
    ACTION_DESCRIPTION: 'team_settings_enable_sso_action_description',
    TOGGLE_DESCRIPTION: 'team_settings_enable_sso_action_toggle_description',
    TOGGLE_WARNING: 'team_settings_enable_sso_action_toggle_warning_markup',
};
export const EnableSsoStep = ({ teamSettings, updateTeamSettings, teamId, planTier, setStepComplete, }: SSOSettingSectionProps) => {
    const [ssoEnabled, setSsoEnabled] = useState<boolean>(teamSettings?.ssoEnabled ?? false);
    const [toggleWarning, setToggleWarning] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState(false);
    const [domainNames, setDomainNames] = useState<string[]>([]);
    const [redirectToBuyBusiness, setRedirectToBuyBusiness] = useState(false);
    useEffect(() => {
        if (ssoEnabled) {
            setStepComplete(SSOSettingStep.EnableSSO);
            return;
        }
        if (planTier === 'legacy' || planTier === 'team') {
            return setRedirectToBuyBusiness(true);
        }
    }, [teamId, domainNames, ssoEnabled, planTier, setStepComplete]);
    const updateDomainsList = async () => {
        const result = await carbonConnector.getTeamDomains();
        if (result.success) {
            setDomainNames(result.domains
                .filter((domain) => domain.status === 'valid')
                .map((verifiedDomain) => verifiedDomain.name));
        }
    };
    useEffect(() => {
        updateDomainsList();
    }, []);
    const { translate } = useTranslate();
    const openServiceProviderUrl = (): void => {
        openUrl(`${teamSettings?.ssoServiceProviderUrl}/saml/login?redirect=test_idp`);
    };
    const closeDialog = async (dialogAction: DialogAction) => {
        setShowDialog(false);
        if (dialogAction === DialogAction.dismiss) {
            return;
        }
        try {
            const toggleNewValue = !ssoEnabled;
            await updateTeamSettings({ ssoEnabled: toggleNewValue });
            setSsoEnabled(toggleNewValue);
        }
        catch (error) {
            setToggleWarning(true);
        }
    };
    const toggleOrContactUs = () => {
        if (redirectToBuyBusiness) {
            return (<Button nature="primary" onClick={() => openUrl(DASHLANE_SUPPORT)} type="button">
          {translate(I18N_KEYS.CONTACT_SUPPORT_BUTTON)}
        </Button>);
        }
        return (<div>
        <Toggle onClick={() => setShowDialog(true)} checked={ssoEnabled} disabled={toggleWarning}/>
        {ssoEnabled ? (<div className={styles.toggleDescription}>
            {translate(I18N_KEYS.TOGGLE_DESCRIPTION)}
          </div>) : null}
        {toggleWarning ? (<div className={styles.toggleWarning}>
            {translate.markup(I18N_KEYS.TOGGLE_WARNING)}
          </div>) : null}
      </div>);
    };
    return (<div className={styles.enableSSOContainer}>
      <Row label={translate(I18N_KEYS.TEST_TITLE)} labelHelper={translate(I18N_KEYS.TEST_DESCRIPTION)}>
        <Button type="button" nature="primary" onClick={openServiceProviderUrl} disabled={!(teamSettings && teamSettings.ssoServiceProviderUrl)}>
          {translate(I18N_KEYS.TEST_BUTTON)}
        </Button>
      </Row>
      <Row label={translate(I18N_KEYS.ACTION_TITLE)} labelHelper={translate(I18N_KEYS.ACTION_DESCRIPTION)}>
        {toggleOrContactUs()}
      </Row>
      {showDialog ? (ssoEnabled ? (<DisableSsoDialog closeDialog={closeDialog}/>) : (<EnableSsoDialog closeDialog={closeDialog}/>)) : null}
    </div>);
};
