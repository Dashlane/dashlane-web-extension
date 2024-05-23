import { useEffect } from 'react';
import { fromUnixTime } from 'date-fns';
import { Badge, Dialog, DSStyleObject, Icon, jsx, Paragraph, } from '@dashlane/design-system';
import { Button, CallToAction, PageView, UserClickEvent, } from '@dashlane/hermes';
import { useModuleCommands } from '@dashlane/framework-react';
import { SpaceTier, teamAdminNotificationsApi, } from '@dashlane/team-admin-contracts';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { openUrl } from 'libs/external-urls';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamBillingInformation } from 'libs/hooks/use-team-billing-information';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { LOCALE_FORMAT } from 'libs/i18n/helpers';
import { logCallToActionEvent } from 'libs/trial/helpers';
import { BUSINESS_BUY, CONTACT_SUPPORT_WITH_TRACKING, DASHLANE_PAY_WITH_INVOICE, } from 'team/urls';
import { PaymentTypeCard } from './items/payment-type-card';
const SX_STYLES: Record<string, DSStyleObject> = {
    BANNER: {
        display: 'flex',
        padding: '16px',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderRadius: '4px',
        background: 'ds.container.agnostic.neutral.quiet',
    },
    CARD_AREA: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        alignSelf: 'stretch',
    },
    CONTENT_AREA: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
};
const I18N_KEYS = {
    CLOSE: '_common_dialog_dismiss_button',
    DISCONTINUATION_DIALOG_TITLE_TEAM: 'team_dashboard_discontinuation_dialog_title_team',
    DISCONTINUATION_DIALOG_TITLE_BUSINESS: 'team_dashboard_discontinuation_dialog_title_business',
    DISCONTINUATION_DIALOG_SUBTITLE: 'team_dashboard_discontinuation_dialog_subtitle',
    DISCONTINUATION_FREE_TRIAL_ENDED_TEAM: 'team_dashboard_discontinuation_dialog_free_trial_ended_team',
    DISCONTINUATION_FREE_TRIAL_ENDED_BUSINESS: 'team_dashboard_discontinuation_dialog_free_trial_ended_business',
    DISCONTINUATION_FREE_TRIAL_ENDED_DATE: 'team_dashboard_discontinuation_dialog_free_trial_ended_date',
    DISCONTINUATION_DIALOG_CREDIT_CARD: 'team_dashboard_discontinuation_dialog_credit_card',
    DISCONTINUATION_DIALOG_PAYMENT_DETAILS: 'team_dashboard_discontinuation_dialog_payment_details',
    DISCONTINUATION_DIALOG_INVOICE: 'team_dashboard_discontinuation_dialog_invoice',
    DISCONTINUATION_DIALOG_CONTACT_SUPPORT: 'team_dashboard_discontinuation_dialog_contact_support',
    DISCONTINUATION_DIALOG_HELP: 'team_dashboard_discontinuation_dialog_help',
    DISCONTINUATION_DIALOG_GET_IN_TOUCH: 'team_dashboard_discontinuation_dialog_get_in_touch',
};
interface Props {
    onClose: () => void;
}
export const TrialDiscontinuedDialog = ({ onClose }: Props) => {
    const { translate } = useTranslate();
    const accountInfo = useAccountInfo();
    const teamTrialStatus = useTeamTrialStatus();
    const billingInfo = useTeamBillingInformation();
    const discontinuedStatus = useDiscontinuedStatus();
    const adminNotificationCommands = useModuleCommands(teamAdminNotificationsApi);
    const isTeam = teamTrialStatus?.spaceTier === SpaceTier.Team;
    const isBusiness = teamTrialStatus?.spaceTier === SpaceTier.Business;
    const shouldShowDiscontinuationDialog = !discontinuedStatus.isLoading &&
        !!discontinuedStatus.isTeamSoftDiscontinued &&
        !!discontinuedStatus.isTrial &&
        (isTeam || isBusiness);
    useEffect(() => {
        if (shouldShowDiscontinuationDialog) {
            logPageView(PageView.TacAccountTrialEndModal);
        }
    }, [shouldShowDiscontinuationDialog]);
    if (!teamTrialStatus || !billingInfo || discontinuedStatus.isLoading) {
        return null;
    }
    if (!shouldShowDiscontinuationDialog) {
        return null;
    }
    const buyDashlaneLink = `${BUSINESS_BUY}?plan=${isTeam ? 'team' : 'business'}&subCode=${accountInfo?.subscriptionCode}`;
    const handleCloseDialog = () => {
        logCallToActionEvent(CallToAction.Dismiss);
        adminNotificationCommands.markB2BPlanDiscontinuedSeen();
        onClose();
    };
    const handleBuyDashlane = () => {
        logCallToActionEvent(CallToAction.PayWithCreditCard);
        adminNotificationCommands.markB2BPlanDiscontinuedSeen();
        openUrl(buyDashlaneLink);
    };
    const handleContactSupport = () => {
        logCallToActionEvent(CallToAction.PayByInvoice);
        adminNotificationCommands.markB2BPlanDiscontinuedSeen();
        openUrl(DASHLANE_PAY_WITH_INVOICE);
    };
    const handleContactSupportInFooter = () => {
        logEvent(new UserClickEvent({
            button: Button.ContactSupportTeam,
        }));
    };
    return (<Dialog title={translate(isBusiness
            ? I18N_KEYS.DISCONTINUATION_DIALOG_TITLE_BUSINESS
            : I18N_KEYS.DISCONTINUATION_DIALOG_TITLE_TEAM)} closeActionLabel={translate(I18N_KEYS.CLOSE)} onClose={handleCloseDialog} isOpen footerSlot={<div sx={{ display: 'flex', gap: '8px' }}>
          <Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.DISCONTINUATION_DIALOG_HELP)}
          </Paragraph>
          <a href={CONTACT_SUPPORT_WITH_TRACKING} sx={{
                textDecoration: 'none',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
            }} onClick={handleContactSupportInFooter}>
            <Paragraph textStyle="ds.title.block.small" color="ds.text.brand.standard">
              {translate(I18N_KEYS.DISCONTINUATION_DIALOG_GET_IN_TOUCH)}
            </Paragraph>
            <Icon name="ActionOpenExternalLinkOutlined" color="ds.text.brand.standard" size="small"/>
          </a>
        </div>}>
      <div sx={SX_STYLES.CONTENT_AREA}>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.DISCONTINUATION_DIALOG_SUBTITLE)}
        </Paragraph>
        <div sx={SX_STYLES.BANNER}>
          <Paragraph color="ds.text.neutral.standard">
            {translate(isBusiness
            ? I18N_KEYS.DISCONTINUATION_FREE_TRIAL_ENDED_BUSINESS
            : I18N_KEYS.DISCONTINUATION_FREE_TRIAL_ENDED_TEAM)}
          </Paragraph>
          <Badge layout="labelOnly" mood="danger" intensity="quiet" label={translate(I18N_KEYS.DISCONTINUATION_FREE_TRIAL_ENDED_DATE, {
            endDate: translate.shortDate(fromUnixTime(billingInfo.lastBillingDateUnix), LOCALE_FORMAT.LL),
        })}/>
        </div>
        <div sx={SX_STYLES.CARD_AREA}>
          <PaymentTypeCard title={translate(I18N_KEYS.DISCONTINUATION_DIALOG_CREDIT_CARD)} subtitle={translate(I18N_KEYS.DISCONTINUATION_DIALOG_PAYMENT_DETAILS)} iconName="ItemPaymentOutlined" handleClick={handleBuyDashlane}/>
          <PaymentTypeCard title={translate(I18N_KEYS.DISCONTINUATION_DIALOG_INVOICE)} subtitle={translate(I18N_KEYS.DISCONTINUATION_DIALOG_CONTACT_SUPPORT)} iconName="ItemTaxNumberOutlined" handleClick={handleContactSupport}/>
        </div>
      </div>
    </Dialog>);
};
