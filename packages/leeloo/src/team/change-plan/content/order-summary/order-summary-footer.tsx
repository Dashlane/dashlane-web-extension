import * as React from 'react';
import { colors, jsx, LoadingIcon, Paragraph } from '@dashlane/ui-components';
import { LOCALE_FORMAT } from 'libs/i18n/helpers';
import useTranslate from 'libs/i18n/useTranslate';
import { Offer } from '@dashlane/team-admin-contracts';
import { UseMidCycleTierUpgradeOutput } from 'team/change-plan/hooks/useMidCycleTierUpgrade';
import { logEvent } from 'libs/logs/logEvent';
import { CallToAction, UserCallToActionEvent } from '@dashlane/hermes';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from 'team/urls';
import { useExpectedTaxInformation } from 'team/change-plan/hooks/useExpectedTaxInformation';
import { useBillingCountry } from 'team/helpers/useBillingCountry';
const I18N_KEYS = {
    FOOTER_HEADER: 'team_account_teamplan_changeplan_order_summary_footer_header',
    FOOTER_MARKUP: 'team_account_teamplan_changeplan_order_summary_footer_markup',
    FOOTER_RENEWAL: 'team_account_teamplan_changeplan_order_summary_footer_renewal',
    RENEWAL_VAT: 'team_account_teamplan_changeplan_order_summary_renewal_vat',
};
interface HeaderProps {
    selectedOffer?: Offer;
    currency?: string;
    costData: UseMidCycleTierUpgradeOutput['costData'];
}
export const OrderSummaryFooter = ({ selectedOffer, currency, costData, }: HeaderProps) => {
    const { translate } = useTranslate();
    const { isLoading: isExpectedTaxInformationLoading, expectedTaxInformation } = useExpectedTaxInformation({ total: costData.renewalPrice });
    const { loading, billingCountry } = useBillingCountry();
    if (loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    const taxCopy = billingCountry === 'US' ? I18N_KEYS.FOOTER_RENEWAL : I18N_KEYS.RENEWAL_VAT;
    const hasTax = !isExpectedTaxInformationLoading &&
        expectedTaxInformation?.expectedTaxesInCents !== undefined &&
        expectedTaxInformation?.expectedTaxesInCents > 0;
    const renewalWithTax = hasTax && expectedTaxInformation?.expectedTaxesInCents
        ? costData.renewalPrice + expectedTaxInformation.expectedTaxesInCents
        : undefined;
    const paragraphCopy = hasTax ? taxCopy : I18N_KEYS.FOOTER_HEADER;
    const totalPrice = hasTax ? renewalWithTax : costData.renewalPrice;
    return (<div sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            backgroundColor: colors.grey06,
        }}>
      {selectedOffer && currency && totalPrice ? (<Paragraph bold size="small" color={colors.grey00}>
          {translate(paragraphCopy, {
                price: translate.price(currency, totalPrice / 100),
                date: translate.shortDate(costData.renewalDate, LOCALE_FORMAT.ll),
            })}
        </Paragraph>) : null}
      <Paragraph size="x-small" color={colors.grey00}>
        {translate.markup(I18N_KEYS.FOOTER_MARKUP, {
            privacyPolicyUrl: PRIVACY_POLICY,
            termsUrl: TERMS_OF_SERVICE,
        }, {
            linkTarget: '_blank',
            onLinkClicked: (link) => {
                if (link === PRIVACY_POLICY) {
                    logEvent(new UserCallToActionEvent({
                        callToActionList: [CallToAction.PrivacyPolicy],
                        chosenAction: CallToAction.PrivacyPolicy,
                        hasChosenNoAction: false,
                    }));
                }
                else if (link === TERMS_OF_SERVICE) {
                    logEvent(new UserCallToActionEvent({
                        callToActionList: [CallToAction.TermsOfService],
                        chosenAction: CallToAction.TermsOfService,
                        hasChosenNoAction: false,
                    }));
                }
            },
        })}
      </Paragraph>
    </div>);
};
