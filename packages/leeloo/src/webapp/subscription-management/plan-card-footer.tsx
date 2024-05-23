import * as React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { colors, jsx, Link, Paragraph } from '@dashlane/ui-components';
import { APP_STORE_PLANS, GOOGLE_PLAY_PLANS } from 'team/urls';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    FOOTER: 'manage_subscription_plan_section_cancel_text',
    FOOTER_APPLE: 'manage_subscription_plan_section_apple_cancel_text_markup',
    FOOTER_GOOGLE: 'manage_subscription_plan_section_google_cancel_text_markup',
};
export const PlanCardFooter: React.FC = () => {
    const premiumStatus = usePremiumStatus();
    const { translate } = useTranslate();
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return null;
    }
    const { planType } = premiumStatus.data;
    const isAppStoreUser = planType?.includes('ios');
    const isGooglePlayUser = planType?.includes('playstore');
    const unparsedFooter = translate(I18N_KEYS.FOOTER);
    const [preFooterLink, footerLink, postFooterLink] = unparsedFooter.split('_');
    const appleFooter = translate.markup(I18N_KEYS.FOOTER_APPLE, {
        link: APP_STORE_PLANS,
    });
    const googleFooter = translate.markup(I18N_KEYS.FOOTER_GOOGLE, {
        link: GOOGLE_PLAY_PLANS,
    });
    const startCancelFlow = () => {
    };
    return (<Paragraph size="small" sx={{
            borderTop: `1px solid ${colors.grey04}`,
            marginTop: '32px',
            paddingTop: '32px',
        }}>
      {!isGooglePlayUser && !isAppStoreUser ? (<span>
          {preFooterLink}
          <Link role="button" sx={{ color: colors.midGreen00 }} onClick={startCancelFlow}>
            {footerLink}
          </Link>
          {postFooterLink}
        </span>) : null}
      {isAppStoreUser ? appleFooter : null}
      {isGooglePlayUser ? googleFooter : null}
    </Paragraph>);
};
