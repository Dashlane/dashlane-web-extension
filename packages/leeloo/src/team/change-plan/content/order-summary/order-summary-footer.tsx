import { colors, Paragraph } from "@dashlane/ui-components";
import { IndeterminateLoader } from "@dashlane/design-system";
import { CallToAction, UserCallToActionEvent } from "@dashlane/hermes";
import { Offer } from "@dashlane/team-admin-contracts";
import { LOCALE_FORMAT } from "../../../../libs/i18n/helpers";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { UseMidCycleTierUpgradeOutput } from "../../hooks/useMidCycleTierUpgrade";
import { logEvent } from "../../../../libs/logs/logEvent";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "../../../urls";
import { useTaxInformation } from "../../hooks/use-tax-information";
import { useBillingCountry } from "../../../helpers/useBillingCountry";
const I18N_KEYS = {
  FOOTER_HEADER: "team_account_teamplan_changeplan_order_summary_footer_header",
  FOOTER_MARKUP: "team_account_teamplan_changeplan_order_summary_footer_markup",
  FOOTER_RENEWAL:
    "team_account_teamplan_changeplan_order_summary_footer_renewal",
  RENEWAL_VAT: "team_account_teamplan_changeplan_order_summary_renewal_vat",
};
interface HeaderProps {
  selectedOffer?: Offer;
  currency?: string;
  costData: UseMidCycleTierUpgradeOutput["costData"];
}
export const OrderSummaryFooter = ({
  selectedOffer,
  currency,
  costData,
}: HeaderProps) => {
  const { translate } = useTranslate();
  const { isLoading: isTaxInformationLoading, taxInformation } =
    useTaxInformation({ total: costData.renewalPrice });
  const { loading, billingCountry } = useBillingCountry();
  if (loading) {
    return <IndeterminateLoader />;
  }
  const taxCopy =
    billingCountry === "US" ? I18N_KEYS.FOOTER_RENEWAL : I18N_KEYS.RENEWAL_VAT;
  const hasTax =
    !isTaxInformationLoading &&
    taxInformation?.amount !== undefined &&
    taxInformation?.amount > 0;
  const renewalWithTax =
    hasTax && taxInformation?.amount
      ? costData.renewalPrice + taxInformation.amount
      : undefined;
  const paragraphCopy = hasTax ? taxCopy : I18N_KEYS.FOOTER_HEADER;
  const totalPrice = hasTax ? renewalWithTax : costData.renewalPrice;
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        backgroundColor: colors.grey06,
      }}
    >
      {selectedOffer && currency && totalPrice ? (
        <Paragraph bold size="small" color={colors.grey00}>
          {translate(paragraphCopy, {
            price: translate.price(currency, totalPrice / 100),
            date: translate.shortDate(costData.renewalDate, LOCALE_FORMAT.ll),
          })}
        </Paragraph>
      ) : null}
      <Paragraph size="x-small" color={colors.grey00}>
        {translate.markup(
          I18N_KEYS.FOOTER_MARKUP,
          {
            privacyPolicyUrl: PRIVACY_POLICY,
            termsUrl: TERMS_OF_SERVICE,
          },
          {
            linkTarget: "_blank",
            onLinkClicked: (link) => {
              if (link === PRIVACY_POLICY) {
                logEvent(
                  new UserCallToActionEvent({
                    callToActionList: [CallToAction.PrivacyPolicy],
                    chosenAction: CallToAction.PrivacyPolicy,
                    hasChosenNoAction: false,
                  })
                );
              } else if (link === TERMS_OF_SERVICE) {
                logEvent(
                  new UserCallToActionEvent({
                    callToActionList: [CallToAction.TermsOfService],
                    chosenAction: CallToAction.TermsOfService,
                    hasChosenNoAction: false,
                  })
                );
              }
            },
          }
        )}
      </Paragraph>
    </div>
  );
};
