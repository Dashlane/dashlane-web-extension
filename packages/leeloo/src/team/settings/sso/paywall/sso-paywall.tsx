import { Fragment, useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { GridContainer } from '@dashlane/ui-components';
import { logPageView } from 'libs/logs/logEvent';
import { ContactSupportDialog } from 'team/page/support/contact-support-dialog';
import { ResponsiveMainSecondaryLayout } from 'team/settings/components/layout/responsive-main-secondary-layout';
import { ContactUsSideContent } from 'team/settings/scim-sso-infoboxes/contact-us-side-item-sso-scim-card';
import { PaywallMainContent } from 'team/settings/sso/paywall/paywall-main-content';
interface Props {
    isTrialOrGracePeriod: boolean;
}
export const SSOPaywall = ({ isTrialOrGracePeriod }: Props) => {
    const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
    useEffect(() => {
        logPageView(PageView.TacSsoPaywall);
    }, []);
    const openSupportDialog = () => setSupportDialogIsOpen(true);
    return (<>
      <ResponsiveMainSecondaryLayout mainContent={GridContainer} mainProps={{
            gridTemplateColumns: 'auto',
            gridAutoRows: 'min-content',
            gap: '32px',
            children: () => PaywallMainContent(isTrialOrGracePeriod),
        }} secondaryContent={() => ContactUsSideContent(openSupportDialog)}/>
      {supportDialogIsOpen ? (<ContactSupportDialog onDismiss={() => setSupportDialogIsOpen(false)}/>) : null}
    </>);
};
