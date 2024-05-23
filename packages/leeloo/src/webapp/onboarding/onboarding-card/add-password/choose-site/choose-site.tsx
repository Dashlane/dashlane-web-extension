import { useEffect, useState } from 'react';
import { Link, useHistory } from 'libs/router';
import { BackIcon, colors, DownloadIcon, FlexContainer, Heading, jsx, Paragraph, PasswordsIcon, } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { Button } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { SitesList } from 'webapp/onboarding/onboarding-card/sites-list/sites-list';
import { setOnboardingMode } from '../../../services';
import { ConfirmSite } from '../confirm-site/confirm-site';
import containerStyles from '../../styles.css';
import { logPageView } from 'libs/logs/logEvent';
const backArrowIcon = (<BackIcon color={colors.dashGreen00} size={20} viewBox="0 2 20 20"/>);
const passwordsIcon = (<PasswordsIcon color={colors.dashGreen02} size={20} viewBox="0 0 40 40"/>);
const I18N_KEYS = {
    PICK_WEBSITE_TITLE: 'web_onboarding_card_title',
    PICK_WEBSITE_DESC: 'web_onboarding_card_body_text',
    ADD_LOGIN_TEXT: 'web_onboarding_card_add_password',
    IMPORT_DATA_BUTTON: 'webapp_account_root_import_data',
    IMPORT_TITLE: 'web_onboarding_import_title',
    IMPORT_DESC: 'web_onboarding_import_description',
};
export const ChooseSite = () => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const history = useHistory();
    const [selectedSite, setSelectedSite] = useState(false);
    const [domainText, setDomainText] = useState('');
    const [loginUrlText, setLoginUrlText] = useState('');
    const handleSetSelectedSite = (newValue: boolean) => {
        setSelectedSite(newValue);
    };
    const showGoToSiteCardView = (domain: string, loginUrl: string) => {
        setDomainText(domain);
        setLoginUrlText(loginUrl);
        setSelectedSite(true);
    };
    const onBackArrowIconClick = () => {
        setOnboardingMode();
    };
    useEffect(() => {
        logPageView(PageView.HomeOnboardingChecklistAddFirstLoginWebsiteList);
    }, []);
    return selectedSite ? (<div className={containerStyles.container}>
      <ConfirmSite setSelectedSite={handleSetSelectedSite} domainText={domainText} loginUrlText={loginUrlText}/>
    </div>) : (<div className={containerStyles.container}>
      <div className={containerStyles.routeContainer}>
        <FlexContainer>
          <Link to={routes.userOnboarding} onClick={onBackArrowIconClick}>
            {backArrowIcon}
          </Link>
          <div className={containerStyles.passwordsIcon}>{passwordsIcon}</div>
          <Paragraph size="small" color="ds.text.oddity.disabled">
            {translate(I18N_KEYS.ADD_LOGIN_TEXT)}
          </Paragraph>
        </FlexContainer>
      </div>
      <div className={containerStyles.subContainer}>
        <FlexContainer flexDirection="column" gap={4}>
          <Heading size="large">
            {translate(I18N_KEYS.PICK_WEBSITE_TITLE)}
          </Heading>
          <Paragraph size="small" color="ds.text.oddity.disabled">
            {translate(I18N_KEYS.PICK_WEBSITE_DESC)}
          </Paragraph>
        </FlexContainer>
        <SitesList onSiteIconClick={showGoToSiteCardView}/>
        <br />
        <FlexContainer flexDirection="column" gap={4}>
          <Heading size="large"> {translate(I18N_KEYS.IMPORT_TITLE)}</Heading>
          <Paragraph size="small" color="ds.text.oddity.disabled">
            {translate(I18N_KEYS.IMPORT_DESC)}
          </Paragraph>
        </FlexContainer>
        <br />
        <Button layout="iconLeading" icon={<DownloadIcon />} mood="neutral" intensity="quiet" onClick={() => history.push(routes.importData)}>
          {translate(I18N_KEYS.IMPORT_DATA_BUTTON)}
        </Button>
      </div>
    </div>);
};
