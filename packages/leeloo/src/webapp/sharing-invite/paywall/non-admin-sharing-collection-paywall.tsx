import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import { DialogFooter } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    HEADING: "webapp_sharing_non_admin_starter_paywall_heading",
    DESCRIPTION: "webapp_sharing_non_admin_starter_paywall_description",
    CTA: "webapp_sharing_non_admin_starter_paywall_cta"
};
interface NonAdminSharingCollectionPaywallProps {
    onDismiss: () => void;
}
export const NonAdminSharingCollectionPaywall = ({ onDismiss, }: NonAdminSharingCollectionPaywallProps) => {
    const { translate } = useTranslate();
    return (<div sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Heading as="h1">{translate(I18N_KEYS.HEADING)}</Heading>

      <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>

      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.CTA)} primaryButtonOnClick={onDismiss}/>
    </div>);
};
