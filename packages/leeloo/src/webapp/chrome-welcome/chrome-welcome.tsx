import React from 'react';
import { Button, colors, Lockup, LockupColor, LockupSize, PasswordChangerIcon, RevealIcon, WebIcon, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { redirect } from 'libs/router';
import chromeWelcomeIllustration from './images/chrome-welcome-illustration.svg';
import vars from 'webapp/variables.css';
import styles from './styles.css';
const I18N_KEYS = {
    DASHLANE_LOGO_TITLE: '_common_dashlane_logo_title',
    MARKETING_PANEL_HEADING: 'chrome_welcome_marketing_panel_heading',
    MARKETING_PANEL_DESCRIPTION: 'chrome_welcome_marketing_panel_description',
    MARKETING_PANEL_LIST_ITEM_REVEAL: 'chrome_welcome_marketing_panel_list_item_reveal_heading',
    MARKETING_PANEL_LIST_ITEM_PASSWORD_CHANGER: 'chrome_welcome_marketing_panel_list_item_open_website_heading',
    MARKETING_PANEL_LIST_ITEM_WEB: 'chrome_welcome_marketing_panel_list_item_generator_heading',
    ILLUSTRATION_PANEL_IMG_ALT: 'chrome_welcome_illustration_img_alt',
    ILLUSTRATION_PANEL_DESCRIPTION: 'chrome_welcome_illustration_panel_description',
    ILLUSTRATION_PANEL_BUTTON: 'chrome_welcome_illustration_panel_button',
};
const iconSizeDefault = parseInt(vars['--icon-size-default'], 10);
export const ChromeWelcome = () => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const handleButtonClick = () => {
        redirect(routes.userOnboarding);
    };
    return (<div className={styles.panelsContainer}>
      <div className={styles.marketingPanel}>
        <div className={styles.lockupWrapper}>
          <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39} title={translate(I18N_KEYS.DASHLANE_LOGO_TITLE)}/>
        </div>
        <div className={styles.marketingInner}>
          <h1 className={styles.heading}>
            {translate(I18N_KEYS.MARKETING_PANEL_HEADING)}
          </h1>
          <p className={styles.description}>
            {translate(I18N_KEYS.MARKETING_PANEL_DESCRIPTION)}
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <RevealIcon size={iconSizeDefault} color={colors.midGreen00} title="Reveal Icon"/>
              <p className={styles.listItemDescription}>
                {translate(I18N_KEYS.MARKETING_PANEL_LIST_ITEM_REVEAL)}
              </p>
            </li>
            <li className={styles.listItem}>
              <PasswordChangerIcon size={iconSizeDefault} color={colors.midGreen00} title="Password Changer Icon"/>
              <p className={styles.listItemDescription}>
                {translate(I18N_KEYS.MARKETING_PANEL_LIST_ITEM_PASSWORD_CHANGER)}
              </p>
            </li>
            <li className={styles.listItem}>
              <WebIcon size={iconSizeDefault} color={colors.midGreen00} title="Web Icon"/>
              <p className={styles.listItemDescription}>
                {translate(I18N_KEYS.MARKETING_PANEL_LIST_ITEM_WEB)}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.illustrationPanel}>
        <img className={styles.illustration} src={chromeWelcomeIllustration} alt={translate(I18N_KEYS.ILLUSTRATION_PANEL_IMG_ALT)}/>
        <p className={styles.illustrationDescription}>
          {translate(I18N_KEYS.ILLUSTRATION_PANEL_DESCRIPTION)}
        </p>
        <div className={styles.buttonWrapper}>
          <Button type="submit" size="large" onClick={handleButtonClick}>
            {translate(I18N_KEYS.ILLUSTRATION_PANEL_BUTTON)}
          </Button>
        </div>
      </div>
    </div>);
};
