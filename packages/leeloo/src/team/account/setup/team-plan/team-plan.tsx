import { Fragment, useMemo, useState } from 'react';
import { Badge, Button, jsx, mergeSx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { ClickOrigin, Button as HermesButton, PlanChangeStep, UserClickEvent, } from '@dashlane/hermes';
import { FlexContainer } from '@dashlane/ui-components';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { ExtendTrialDialogFlow, TrialDialog, } from 'libs/trial/trial-dialogs/extend-trial-dialog-flow';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { openUrl } from 'libs/external-urls';
import { useMidCycleTierLogs } from 'team/change-plan/logs';
import { ActionableButton } from './actionable-button';
import styles from './styles.css';
import { DASHLANE_CONTACT_FORM_DASHLANE_FOR_BUSINESS } from 'team/urls';
const OFFER_TO_EXTEND_TRIAL_FF = 'ecommerce_web_offerToExtend_phase1';
export interface TeamPlanProps {
    licenseCount: number;
    onRequestBuyMoreSeats: () => void;
    onRequestTeamUpgrade: (clickOrigin: ClickOrigin) => void;
    style?: React.CSSProperties;
}
export const I18N_KEYS = {
    TRIAL: 'team_account_teamplan_trial',
    USERS: 'team_account_teamplan_users',
    TEAM: 'team_account_teamplan_team',
    BUSINESS: 'team_account_teamplan_business',
    FIREFOX_NO_BILLING: 'manage_subscription_payment_method_add_firefox_unsupported',
    CHANGE_PLAN: 'team_account_teamplan_change_plan',
    PLAN_NAME: 'team_account_teamplan_plan_name',
    SEATS: 'team_account_teamplan_seats',
    STARTER: 'team_account_teamplan_changeplan_plans_starter_name',
    EXTEND_TRIAL: 'team_dashboard_extend_trial_button',
    TRIAL_ENDED_BADGE: 'team_account_teamplan_trial_ended_badge',
    PAY_BY_INVOICE: 'team_account_teamplan_trial_ended_pay_by_invoice_button',
};
const labelContainerStyles: ThemeUIStyleObject = {
    width: '300px',
    margin: '10px 0px',
    flexWrap: 'wrap',
    gap: '8px',
};
const buttonContainerStyles: ThemeUIStyleObject = {
    margin: '10px',
    gap: '8px',
};
export const TeamPlan = ({ style, licenseCount, onRequestTeamUpgrade, onRequestBuyMoreSeats, }: TeamPlanProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const teamTrialStatus = useTeamTrialStatus();
    const discontinuedStatus = useDiscontinuedStatus();
    const extendTrialFF = useFeatureFlip(OFFER_TO_EXTEND_TRIAL_FF);
    const [showExtendTrialDialog, setShowExtendTrialDialog] = useState(false);
    const hasEcommDiscontinuationFF = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationPhase1);
    const isStarterTier = !!teamTrialStatus && teamTrialStatus.spaceTier === SpaceTier.Starter;
    const isTeamTier = !!teamTrialStatus && teamTrialStatus.spaceTier === SpaceTier.Team;
    const isBusinessTier = !!teamTrialStatus && teamTrialStatus.spaceTier === SpaceTier.Business;
    const isFreeTrial = !!teamTrialStatus?.isFreeTrial;
    const licenseStatusKey = useMemo(() => {
        let translatedPlanName;
        if (isStarterTier) {
            translatedPlanName = translate(I18N_KEYS.STARTER);
        }
        else if (isTeamTier) {
            translatedPlanName = translate(I18N_KEYS.TEAM);
        }
        else {
            translatedPlanName = translate(I18N_KEYS.BUSINESS);
        }
        if (isFreeTrial) {
            return translate(I18N_KEYS.TRIAL, {
                planName: translatedPlanName,
            });
        }
        return `Dashlane ${translatedPlanName}`;
    }, [isStarterTier, isTeamTier, isFreeTrial, translate]);
    const { logChangePlanEvent } = useMidCycleTierLogs({
        hasPromo: false,
        currentSeats: licenseCount,
        additionalSeats: 0,
        planChangeStep: PlanChangeStep.ChangePlanCta,
    });
    if (discontinuedStatus.isLoading) {
        return null;
    }
    const { isTeamSoftDiscontinued, isTrial: isNodePremiumStatusFreeTrial } = discontinuedStatus;
    const isDiscontinuedTrial = !!hasEcommDiscontinuationFF &&
        isTeamSoftDiscontinued &&
        isNodePremiumStatusFreeTrial;
    const onClickExtendTrial = () => {
        logEvent(new UserClickEvent({
            button: HermesButton.ExtendTrial,
            clickOrigin: ClickOrigin.AccountStatus,
        }));
        setShowExtendTrialDialog(true);
    };
    const onClickPayByInvoice = () => {
        openUrl(DASHLANE_CONTACT_FORM_DASHLANE_FOR_BUSINESS);
    };
    if (!teamTrialStatus) {
        return null;
    }
    const isGracePeriod = teamTrialStatus.isGracePeriod;
    const isLastDayOfTrial = teamTrialStatus.daysLeftInTrial === 0;
    const showMidTierUpgrade = !isFreeTrial;
    return showMidTierUpgrade ? (<FlexContainer flexDirection="column" sx={{ marginTop: '8px' }}>
      <FlexContainer alignItems="center">
        <div sx={labelContainerStyles}>
          <Paragraph textStyle="ds.body.standard.regular">
            {translate(I18N_KEYS.PLAN_NAME, {
            planName: licenseStatusKey,
        })}
          </Paragraph>
        </div>
        <div sx={buttonContainerStyles}>
          {isBusinessTier ? null : (<Button mood="neutral" intensity="quiet" type="button" onClick={() => {
                logChangePlanEvent();
                redirect(routes.teamAccountChangePlanRoutePath);
            }}>
              {translate(I18N_KEYS.CHANGE_PLAN)}
            </Button>)}
        </div>
      </FlexContainer>
      <FlexContainer alignItems="center" sx={{ marginTop: '8px' }}>
        <div sx={labelContainerStyles}>
          <Paragraph textStyle="ds.body.standard.regular">
            {translate(I18N_KEYS.SEATS, {
            numSeats: licenseCount,
        })}
          </Paragraph>
        </div>
        <div sx={buttonContainerStyles}>
          <ActionableButton isGracePeriod={isGracePeriod} isFreeTrial={isFreeTrial} isStarter={isStarterTier} onClick={onRequestBuyMoreSeats} licenseCount={licenseCount} isDiscontinuedTrial={!!isDiscontinuedTrial}/>
          {isDiscontinuedTrial ? <Button /> : null}
        </div>
      </FlexContainer>
    </FlexContainer>) : (<>
      <div style={style}>
        <div sx={{ display: 'flex' }}>
          <div sx={mergeSx([
            { display: 'flex', flexDirection: 'row' },
            labelContainerStyles,
        ])}>
            <span className={styles.licenseCountText}>{licenseStatusKey}</span>
            {isDiscontinuedTrial ? (<Badge mood="danger" label={translate(I18N_KEYS.TRIAL_ENDED_BADGE)}/>) : null}
          </div>
          <div sx={mergeSx([
            { display: 'flex', flexDirection: 'row' },
            buttonContainerStyles,
        ])}>
            <ActionableButton isGracePeriod={isGracePeriod} isFreeTrial={isFreeTrial} isStarter={isStarterTier} isDiscontinuedTrial={!!isDiscontinuedTrial} onClick={() => onRequestTeamUpgrade(ClickOrigin.AccountStatus)} licenseCount={licenseCount}/>
            {!isGracePeriod &&
            isLastDayOfTrial &&
            !!extendTrialFF &&
            !isTeamSoftDiscontinued ? (<Button mood="brand" intensity="supershy" layout="labelOnly" onClick={onClickExtendTrial}>
                {translate(I18N_KEYS.EXTEND_TRIAL)}
              </Button>) : null}
            {isDiscontinuedTrial ? (<Button mood="brand" intensity="supershy" onClick={onClickPayByInvoice}>
                {translate(I18N_KEYS.PAY_BY_INVOICE)}
              </Button>) : null}
          </div>
        </div>

        <div className={styles.licenseCountContainer}>
          {translate(I18N_KEYS.USERS, {
            count: licenseCount,
        })}
        </div>
      </div>
      {showExtendTrialDialog ? (<ExtendTrialDialogFlow initialDialog={TrialDialog.SURVEY}/>) : null}
    </>);
};
