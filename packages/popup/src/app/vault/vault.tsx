import { FC, useState } from 'react';
import { Action } from 'redux';
import { WebOnboardingModeEvent } from '@dashlane/communication';
import { jsx } from '@dashlane/ui-components';
import { Website } from 'store/types';
import useTranslate from 'libs/i18n/useTranslate';
import { EmbeddedAlertWrapper } from 'app/vault/embedded-alert-hub/embedded-alert-hub';
import { OverlayAlertHub } from 'app/vault/overlay-alert-hub/overlay-alert-hub';
import { SearchProvider } from './search-field/search-context';
import { TabsBar } from './tabs-bar/tabs-bar';
import ActiveTabList from './active-tab-list/active-tab-list';
import { FooterAlertWrapper } from './footer-alert-hub/footer-alert-hub';
import styles from './styles.css';
const I18N_KEYS = {
    VAULT: 'tab/all_items/title_vault',
};
export interface VaultProps {
    dispatch: (action: Action) => void;
    webOnboardingMode: WebOnboardingModeEvent | null;
    website: Website;
}
export const Vault: FC<VaultProps> = ({ dispatch, webOnboardingMode, website, }) => {
    const [embeddedAlertIsShown, setEmbeddedAlertIsShown] = useState(false);
    const { translate } = useTranslate();
    return (<div className={styles.wrapper} role="heading" aria-level={1} aria-label={translate(I18N_KEYS.VAULT)} tabIndex={-1}>
      <SearchProvider>
        <TabsBar />
        <EmbeddedAlertWrapper dispatch={dispatch} webOnboardingMode={webOnboardingMode} alertBubbleHandler={setEmbeddedAlertIsShown}/>
        <ActiveTabList website={website}/>
        <FooterAlertWrapper embeddedAlertIsShown={embeddedAlertIsShown}/>
        <OverlayAlertHub />
      </SearchProvider>
    </div>);
};
