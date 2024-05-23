import React, { Fragment } from 'react';
import { jsx } from '@dashlane/design-system';
import { colors } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import zIndexesVars from 'libs/dashlane-style/globals/z-index-variables.css';
import colorsVars from 'libs/dashlane-style/globals/color-variables.css';
import styles from './styles.css';
import { useShouldDisplayAdminVaultGetStartedGuide } from 'team/settings/hooks/use-display-admin-vault-getstarted';
interface Props {
    children: React.ReactNode;
    location: Location;
}
export const Onboarding = ({ children, location }: Props) => {
    const { translate } = useTranslate();
    const shouldDisplayAdminVaultGetStartedGuideResult = useShouldDisplayAdminVaultGetStartedGuide();
    const isBaseOnboardingRoute = location.href.endsWith('onboarding');
    const applyNewStyle = isBaseOnboardingRoute &&
        shouldDisplayAdminVaultGetStartedGuideResult.status ===
            DataStatus.Success &&
        shouldDisplayAdminVaultGetStartedGuideResult.shouldDisplayAdminVaultGetStartedGuide;
    return (<div sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: applyNewStyle
                ? 'ds.container.agnostic.neutral.standard'
                : colorsVars['--dash-green-00'],
            color: 'white',
            height: '100%',
            width: '100%',
            zIndex: zIndexesVars['--z-index-webapp-onboarding-top-level-wrapper'],
            overflowY: 'auto',
        }}>
      <Header endWidget={<>
            <HeaderAccountMenu color={applyNewStyle ? undefined : colors.white}/>
            <NotificationsDropdown color={applyNewStyle ? undefined : colors.white}/>
          </>}/>

      <div sx={{
            padding: applyNewStyle ? 'none' : '0 40px 40px',
            height: '100%',
            width: '100%',
            maxWidth: applyNewStyle ? '786px' : 'none',
        }}>
        {!applyNewStyle ? (<>
            <h1 className={styles.heading}>
              {translate('web_onboarding_body_title')}
            </h1>

            <p className={styles.headingCaption}>
              {translate('web_onboarding_body_text')}
            </p>
          </>) : null}
        {children}
      </div>
    </div>);
};
