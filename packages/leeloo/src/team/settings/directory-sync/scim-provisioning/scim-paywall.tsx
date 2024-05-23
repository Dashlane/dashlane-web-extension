import { useEffect } from 'react';
import { Badge, Button, Icon, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { ClickOrigin, Button as HermesButton, PageView, UserClickEvent, } from '@dashlane/hermes';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { LearnMoreDropdown } from 'libs/dropdown/learn-more-dropdown';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { BUSINESS_BUY, DASHLANE_ADMIN_HELP_CENTER, DASHLANE_CONFIDENTIAL_SCIM, DASHLANE_IDP_INTEGRATION, DASHLANE_MULTI_DOMAINS, DASHLANE_RESOURCES_ZERO_KNOWLEDGE, DASHLANE_SELF_HOSTED_SCIM, } from 'team/urls';
import { useFeatureFlip } from '@dashlane/framework-react';
const SCIM_PAYWALL_UTM_SOURCE = 'button:upgrade_business_tier+click_origin:directory_sync_paywall_page+origin_page:tac/settings/directory_sync/paywall+origin_component:main_app';
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
    CONTAINER: {
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid ds.border.neutral.quiet.idle',
        background: 'ds.container.agnostic.neutral.supershy',
        '& h1': {
            margin: '8px 0px',
        },
    },
    MAIN_TITLE: {
        margin: '8px 0px',
        fontFamily: 'Public Sans',
        fontSize: '22px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '28px',
    },
    CONTENT_CARD: {
        margin: '32px 0px',
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
    },
    CONTENT_CARD_FEATURE_TITLE: {
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '20px',
        color: 'ds.text.neutral.catchy',
    },
    CONTENT_CARD_FEATURE_DESC: {
        color: 'ds.text.neutral.quiet',
        fontSize: '13px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '18px',
        maxWidth: '600px',
    },
    BUTTONS: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};
const I18N_KEYS = {
    BADGE_BUSINESS_PLAN: 'team_settings_directory_sync_scim_paywall_business_badge',
    BADGE_COMING_SOON: 'team_settings_directory_sync_scim_paywall_coming_soon_badge',
    PAYWALL_TITLE: 'team_settings_directory_sync_scim_paywall_title',
    PAYWALL_DESC: 'team_settings_directory_sync_scim_paywall_description',
    FEATURE_SELFHOSTED_TITLE: 'team_settings_directory_sync_scim_paywall_feature_selfhosted_title',
    FEATURE_SELFHOSTED_DESC: 'team_settings_directory_sync_scim_paywall_feature_selfhosted_desc',
    FEATURE_CONFIDENTIAL_TITLE: 'team_settings_directory_sync_scim_paywall_feature_confidential_title',
    FEATURE_CONFIDENTIAL_DESC: 'team_settings_directory_sync_scim_paywall_feature_confidential_desc',
    UPGRADE_BUSINESS: 'team_settings_directory_sync_scim_paywall_upgrade_business',
    LEARN_MORE: 'team_settings_directory_sync_scim_paywall_dropdown_learn_more',
};
const LEARN_MORE_DROPDOWN_ITEMS: Record<string, {
    i18nKey: string;
    url: string;
}> = {
    LINK_ZEROKNOWLEDGE: {
        i18nKey: 'team_settings_directory_sync_scim_paywall_link_zeroknowledge',
        url: DASHLANE_RESOURCES_ZERO_KNOWLEDGE,
    },
    LINK_MULTIPLEDOMAINS: {
        i18nKey: 'team_settings_directory_sync_scim_paywall_link_multiple_domains',
        url: DASHLANE_MULTI_DOMAINS,
    },
    LINK_SELFHOSTED: {
        i18nKey: 'team_settings_directory_sync_scim_paywall_link_self_hosted',
        url: DASHLANE_SELF_HOSTED_SCIM,
    },
    LINK_CONFIDENTIAL: {
        i18nKey: 'team_settings_directory_sync_scim_paywall_link_confidential',
        url: DASHLANE_CONFIDENTIAL_SCIM,
    },
    LINK_IDP_INTEGRATION: {
        i18nKey: 'team_settings_directory_sync_scim_paywall_link_idp',
        url: DASHLANE_IDP_INTEGRATION,
    },
    LINK_ADMIN_HC: {
        i18nKey: 'team_settings_directory_sync_scim_paywall_link_help_center',
        url: DASHLANE_ADMIN_HELP_CENTER,
    },
};
interface SCIMPaywallProps {
    isTrialOrGracePeriod: boolean;
}
export const SCIMPaywall = ({ isTrialOrGracePeriod }: SCIMPaywallProps) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const accountInfo = useAccountInfo();
    const isConfidentialScimFFActivated = useFeatureFlip('setup_rollout_confidential_scim_prod');
    useEffect(() => {
        logPageView(PageView.TacSettingsDirectorySyncPaywall);
    }, []);
    const handleClickUpsellButton = () => {
        logEvent(new UserClickEvent({
            button: HermesButton.UpgradeBusinessTier,
            clickOrigin: ClickOrigin.DirectorySyncPaywallPage,
        }));
        if (isTrialOrGracePeriod) {
            openUrl(`${BUSINESS_BUY}?plan=business&subCode=${accountInfo?.subscriptionCode}&utm_source=${SCIM_PAYWALL_UTM_SOURCE}`);
        }
        else {
            redirect(`${routes.teamAccountChangePlanRoutePath}?plan=business`);
        }
    };
    return (<div sx={SX_STYLES.CONTAINER}>
      <Badge iconName="PremiumOutlined" label={translate(I18N_KEYS.BADGE_BUSINESS_PLAN)} layout="iconLeading" intensity="quiet" mood="brand" sx={{
            height: '16px',
        }}/>
      <h2 sx={SX_STYLES.MAIN_TITLE}>{translate(I18N_KEYS.PAYWALL_TITLE)}</h2>
      <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.PAYWALL_DESC)}
      </Paragraph>
      <div sx={SX_STYLES.CONTENT_CARD}>
        <Icon name="ToolsOutlined" size="xlarge" tooltip="bli"/>
        <div>
          <span sx={SX_STYLES.CONTENT_CARD_FEATURE_TITLE}>
            {translate(I18N_KEYS.FEATURE_SELFHOSTED_TITLE)}
          </span>
          <Paragraph sx={SX_STYLES.CONTENT_CARD_FEATURE_DESC}>
            {translate(I18N_KEYS.FEATURE_SELFHOSTED_DESC)}
          </Paragraph>
        </div>
      </div>
      <div sx={SX_STYLES.CONTENT_CARD}>
        <Icon name="ToolsOutlined" size="xlarge" tooltip="bli"/>
        <div>
          <div sx={{ display: 'flex', gap: '5px' }}>
            <span sx={SX_STYLES.CONTENT_CARD_FEATURE_TITLE}>
              {translate(I18N_KEYS.FEATURE_CONFIDENTIAL_TITLE)}
            </span>
            {!isConfidentialScimFFActivated ? (<Badge label={translate(I18N_KEYS.BADGE_COMING_SOON)} mood="neutral" intensity="supershy"/>) : null}
          </div>
          <Paragraph sx={SX_STYLES.CONTENT_CARD_FEATURE_DESC}>
            {translate(I18N_KEYS.FEATURE_CONFIDENTIAL_DESC)}
          </Paragraph>
        </div>
      </div>
      <div sx={SX_STYLES.BUTTONS}>
        <LearnMoreDropdown dropdownItems={LEARN_MORE_DROPDOWN_ITEMS} titleKey={I18N_KEYS.LEARN_MORE}/>
        <Button layout="iconLeading" icon="PremiumOutlined" mood="brand" intensity="quiet" onClick={handleClickUpsellButton} role={isTrialOrGracePeriod ? 'link' : 'button'}>
          {translate(I18N_KEYS.UPGRADE_BUSINESS)}
        </Button>
      </div>
    </div>);
};
