import { Fragment, useState } from 'react';
import { fromUnixTime } from 'date-fns';
import { Button, IndeterminateLoader, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { ClickOrigin, Button as HermesButton, UserClickEvent, } from '@dashlane/hermes';
import { FlexContainer } from '@dashlane/ui-components';
import { useFeatureFlip } from '@dashlane/framework-react';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { LOCALE_FORMAT } from 'libs/i18n/helpers';
import useTranslate from 'libs/i18n/useTranslate';
import { useExpectedTaxInformation } from 'team/change-plan/hooks/useExpectedTaxInformation';
import { useBillingCountry } from 'team/helpers/useBillingCountry';
import { logEvent } from 'libs/logs/logEvent';
import { ExtendTrialDialogFlow, TrialDialog, } from 'libs/trial/trial-dialogs/extend-trial-dialog-flow';
import { useTeamBillingInformation } from 'libs/hooks/use-team-billing-information';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { SX_ACCOUNT_STYLES } from 'team/account/account.styles';
import { DownloadBillingHistoryButton } from './download-billing-history-button';
const OFFER_TO_EXTEND_TRIAL_FF = 'ecommerce_web_offerToExtend_phase1';
const I18N_KEYS = {
    TRIAL_HEADER: 'team_account_teamplan_plan_header_trial',
    TRIAL_DESCRIPTION: 'team_account_teamplan_plan_copy_trial',
    TRIAL_ENDED_HEADER: 'team_account_teamplan_plan_header_trial_discontinued',
    TRIAL_ENDED_DESCRIPTION_BUSINESS: 'team_account_teamplan_plan_copy_trial_business_discontinued',
    TRIAL_ENDED_DESCRIPTION_TEAM: 'team_account_teamplan_plan_copy_trial_team_discontinued',
    TRIAL_ENDED_BUY_DASHLANE: 'team_account_teamplan_plan_buy_dashlane_trial_discontinued',
    EXTEND_TRIAL: 'team_dashboard_extend_trial_button',
    BUY_DASHLANE: 'team_account_teamplan_plan_buy_dashlane',
    RENEWAL_HEADER: 'team_account_teamplan_plan_header_annual',
    RENEWAL_DESCRIPTION: 'team_account_teamplan_plan_copy',
    TOTAL_WITH_TAX: 'team_account_teamplan_plan_total_with_tax',
    TOTAL_WITH_VAT: 'team_account_teamplan_plan_total_with_vat',
    EXPIRATION_HEADER: 'team_account_teamplan_plan_expiration_header',
    EXPIRATION_DESCRIPTION: 'team_account_teamplan_plan_expiration_description',
};
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
    WRAPPER: {
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
    },
    BUY_DASHLANE_BUTTON: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
    },
};
export interface Props {
    onClickBuyDashlane: () => void;
    handleGetPastReceipts: () => void;
    isRenewalStopped: boolean | undefined;
    usersToBeRenewedCount: number;
    discontinuedTrial: boolean;
}
export const SubscriptionDateCard = ({ isRenewalStopped, onClickBuyDashlane, handleGetPastReceipts, usersToBeRenewedCount, discontinuedTrial, }: Props) => {
    const { translate } = useTranslate();
    const extendTrialFF = useFeatureFlip(OFFER_TO_EXTEND_TRIAL_FF);
    const { loading, billingCountry } = useBillingCountry();
    const [showExtendTrialDialog, setShowExtendTrialDialog] = useState(false);
    const teamTrialStatus = useTeamTrialStatus();
    const teamBillingInformation = useTeamBillingInformation();
    const billingDetails = teamBillingInformation?.nextBillingDetails;
    const { isLoading: isExpectedTaxInformationLoading, expectedTaxInformation } = useExpectedTaxInformation({ total: billingDetails?.amount });
    if (loading || !teamTrialStatus || !billingDetails) {
        return <IndeterminateLoader mood="brand"/>;
    }
    const freeTrial = teamTrialStatus.isFreeTrial;
    const lastDayOfTrial = teamTrialStatus.daysLeftInTrial === 0;
    const renewalAmount = billingDetails.amount;
    const currency = billingDetails.currency;
    const isTeam = teamTrialStatus.spaceTier === SpaceTier.Team;
    const renewalOrEndDate = fromUnixTime(billingDetails.dateUnix);
    const totalCost = renewalAmount / 100;
    const seatCost = totalCost && usersToBeRenewedCount ? totalCost / usersToBeRenewedCount : 0;
    const renewalCopy = billingCountry === 'US'
        ? I18N_KEYS.TOTAL_WITH_TAX
        : I18N_KEYS.TOTAL_WITH_VAT;
    const hasTax = !isExpectedTaxInformationLoading &&
        expectedTaxInformation?.expectedTaxesInCents !== undefined &&
        expectedTaxInformation?.expectedTaxesInCents > 0;
    const totalWithTax = hasTax && renewalAmount && expectedTaxInformation?.expectedTaxesInCents
        ? (renewalAmount + expectedTaxInformation.expectedTaxesInCents) / 100
        : undefined;
    const onClickExtendTrial = () => {
        logEvent(new UserClickEvent({
            button: HermesButton.ExtendTrial,
            clickOrigin: ClickOrigin.BillingInformation,
        }));
        setShowExtendTrialDialog(true);
    };
    return (<>
      <FlexContainer flexDirection="column" gap="12px" sx={SX_ACCOUNT_STYLES.CARD_BORDER}>
        
        {freeTrial && !discontinuedTrial && (<FlexContainer sx={SX_STYLES.WRAPPER}>
            <Paragraph textStyle="ds.title.block.medium" color="ds.text.neutral.quiet">
              {translate(I18N_KEYS.TRIAL_HEADER)}
            </Paragraph>
            <FlexContainer sx={{ margin: '16px 0px' }}>
              <Paragraph color="ds.text.neutral.standard" textStyle="ds.specialty.spotlight.small">
                {renewalOrEndDate
                ? translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.LL)
                : null}
              </Paragraph>
            </FlexContainer>
            <Paragraph color={'ds.text.neutral.catchy'} textStyle="ds.title.block.medium">
              {renewalOrEndDate
                ? translate(I18N_KEYS.TRIAL_DESCRIPTION, {
                    expireDate: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.MMMM_D),
                })
                : null}
            </Paragraph>

            <div sx={SX_STYLES.BUY_DASHLANE_BUTTON}>
              <Button mood="neutral" intensity="quiet" size="medium" fullsize onClick={onClickBuyDashlane}>
                {translate(I18N_KEYS.BUY_DASHLANE)}
              </Button>

              {!teamTrialStatus.isGracePeriod &&
                lastDayOfTrial &&
                !!extendTrialFF ? (<Button mood="brand" intensity="supershy" layout="labelOnly" size="medium" fullsize onClick={onClickExtendTrial}>
                  {translate(I18N_KEYS.EXTEND_TRIAL)}
                </Button>) : null}
            </div>
          </FlexContainer>)}

        
        {!freeTrial && !discontinuedTrial && (<FlexContainer sx={SX_STYLES.WRAPPER}>
            <Paragraph textStyle="ds.title.block.medium" color="ds.text.neutral.quiet">
              {translate(isRenewalStopped
                ? I18N_KEYS.EXPIRATION_HEADER
                : I18N_KEYS.RENEWAL_HEADER)}
            </Paragraph>
            <FlexContainer sx={{ margin: '16px 0px' }}>
              
              <Paragraph color="ds.text.neutral.standard" textStyle="ds.specialty.spotlight.small" className="automation-tests-tac-billing">
                {translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.LL)}
              </Paragraph>
            </FlexContainer>
            {!isRenewalStopped ? (<Paragraph color={'ds.text.neutral.catchy'} textStyle="ds.title.block.medium">
                {hasTax
                    ? translate(renewalCopy, {
                        numSeats: usersToBeRenewedCount,
                        seatCost: seatCost
                            ? translate.price(currency, seatCost, {
                                notation: 'compact',
                            })
                            : null,
                        totalCost: totalWithTax
                            ? translate.price(currency, totalWithTax)
                            : null,
                    })
                    : translate(I18N_KEYS.RENEWAL_DESCRIPTION, {
                        numSeats: usersToBeRenewedCount,
                        seatCost: seatCost
                            ? translate.price(currency, seatCost, {
                                notation: 'compact',
                            })
                            : null,
                        totalCost: totalCost
                            ? translate.price(currency, totalCost, {
                                notation: 'compact',
                            })
                            : null,
                    })}
              </Paragraph>) : (<Paragraph color="ds.text.neutral.catchy" textStyle="ds.title.block.medium">
                {translate(I18N_KEYS.EXPIRATION_DESCRIPTION, {
                    expireDate: translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.LL),
                })}
              </Paragraph>)}
            <DownloadBillingHistoryButton handleGetPastReceipts={handleGetPastReceipts}/>
          </FlexContainer>)}

        
        {discontinuedTrial && (<FlexContainer sx={SX_STYLES.WRAPPER}>
            <Paragraph textStyle="ds.title.block.medium" color={'ds.text.danger.standard'}>
              {translate(I18N_KEYS.TRIAL_ENDED_HEADER)}
            </Paragraph>
            <FlexContainer sx={{ margin: '16px 0px' }}>
              <Paragraph color={'ds.text.danger.standard'} textStyle="ds.specialty.spotlight.small">
                {translate.shortDate(renewalOrEndDate, LOCALE_FORMAT.LL)}
              </Paragraph>
            </FlexContainer>
            <Paragraph color="ds.text.neutral.catchy" textStyle="ds.title.block.medium">
              {translate(isTeam
                ? I18N_KEYS.TRIAL_ENDED_DESCRIPTION_TEAM
                : I18N_KEYS.TRIAL_ENDED_DESCRIPTION_BUSINESS)}
            </Paragraph>
            <div sx={SX_STYLES.BUY_DASHLANE_BUTTON}>
              <Button mood="neutral" intensity="quiet" size="medium" fullsize onClick={onClickBuyDashlane}>
                {translate(I18N_KEYS.TRIAL_ENDED_BUY_DASHLANE)}
              </Button>
            </div>
            <DownloadBillingHistoryButton handleGetPastReceipts={handleGetPastReceipts}/>
          </FlexContainer>)}
      </FlexContainer>

      {showExtendTrialDialog ? (<ExtendTrialDialogFlow initialDialog={TrialDialog.SURVEY}/>) : null}
    </>);
};
