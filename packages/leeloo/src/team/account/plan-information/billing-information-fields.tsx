import { DisplayField, LinkButton } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Link, useRouterGlobalSettingsContext } from "../../../libs/router";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
const I18N_KEYS = {
  UPDATE_PAYMENT_METHOD_CTA: "account_summary_update_payment_method",
  CURRENT_PLAN: "account_summary_current_plan_label",
  TOTAL_SEATS: "account_summary_total_seats_label",
  BUY_SEATS: "account_summary_buy_seats",
  BILLING_CYCLE: "account_summary_billing_cycle_label",
  AUTO_RENEWAL: "account_summary_auto_renewal_label",
  PRICE_PER_SEAT: "account_summary_price_per_seat_label",
  PER_YEAR: "account_summary_price_per_year",
  PER_MONTH: "account_summary_price_per_month_value",
  TOTAL_PRICE: "account_summary_total_price_label",
  BUY_DASHLANE: "team_dashboard_buy_dashlane_button",
  YES_AUTORENEWAL: "account_summary_autorenewal_yes",
  NO_AUTORENEWAL: "account_summary_autorenewal_no",
  YEARLY_BILLING_CYCLE: "account_summary_yearly_billing_cycle",
  MONTHLY_BILLING_CYCLE: "account_summary_price_per_month",
  ADD_SEATS:
    "team_account_teamplan_changeplan_success_features_actions_add_seats",
  UPGRADE: "team_account_starter_upgrade_button",
};
interface Props {
  planName: string;
  hideTotalPrice: boolean;
  buyDashlaneLink: string;
  seatsNumber: number;
  isRenewalStopped: boolean;
  isMonthlyPlan: boolean;
  currency: string;
  pricePerSeat: number;
  amountFormatted: number;
  addSeatsButton: {
    withAddSeatsButton: boolean;
    openAddSeatsDialog: () => void;
  };
  upgradeButton: boolean;
}
export const BillingInformationFields = ({
  planName,
  hideTotalPrice,
  buyDashlaneLink,
  seatsNumber,
  isRenewalStopped,
  isMonthlyPlan,
  currency,
  pricePerSeat,
  amountFormatted,
  addSeatsButton,
  upgradeButton,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const featureFlipsResult = useFeatureFlips();
  const isPostTrialCheckoutEnabled =
    featureFlipsResult.status === DataStatus.Success &&
    featureFlipsResult.data["monetization_extension_post_trial_checkout"];
  const billingCycleKey = isMonthlyPlan
    ? I18N_KEYS.MONTHLY_BILLING_CYCLE
    : I18N_KEYS.YEARLY_BILLING_CYCLE;
  const billingSummaryType = isMonthlyPlan
    ? I18N_KEYS.PER_MONTH
    : I18N_KEYS.PER_YEAR;
  return (
    <div
      sx={{
        height: "136px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        margin: "15px 0",
      }}
    >
      <div
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div sx={{ flex: "1 1 224px" }}>
          <DisplayField
            label={translate(I18N_KEYS.CURRENT_PLAN)}
            value={planName}
          />
          {hideTotalPrice ? (
            isPostTrialCheckoutEnabled ? (
              <LinkButton
                as={Link}
                to={routes.teamAccountCheckoutRoutePath}
                sx={{ cursor: "pointer" }}
              >
                {translate(I18N_KEYS.BUY_DASHLANE)}
              </LinkButton>
            ) : (
              <LinkButton
                href={buyDashlaneLink}
                isExternal
                sx={{ cursor: "pointer" }}
              >
                {translate(I18N_KEYS.BUY_DASHLANE)}
              </LinkButton>
            )
          ) : null}
          {upgradeButton ? (
            <LinkButton as={Link} to={routes.teamAccountChangePlanRoutePath}>
              {translate(I18N_KEYS.UPGRADE)}
            </LinkButton>
          ) : null}
        </div>
        <div sx={{ flex: "1 1 224px" }}>
          <DisplayField
            data-testid={"total-seats"}
            label={translate(I18N_KEYS.TOTAL_SEATS)}
            value={String(seatsNumber)}
          />
          {addSeatsButton.withAddSeatsButton ? (
            <LinkButton
              as="button"
              onClick={addSeatsButton.openAddSeatsDialog}
              sx={{ "> button": { cursor: "pointer" } }}
            >
              {translate(I18N_KEYS.ADD_SEATS)}
            </LinkButton>
          ) : null}
        </div>
        <div sx={{ flex: "1 1 224px" }}>
          <DisplayField
            label={translate(I18N_KEYS.BILLING_CYCLE)}
            value={translate(billingCycleKey)}
          />
        </div>
      </div>
      <div
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <DisplayField
          label={translate(I18N_KEYS.AUTO_RENEWAL)}
          value={translate(
            isRenewalStopped
              ? I18N_KEYS.NO_AUTORENEWAL
              : I18N_KEYS.YES_AUTORENEWAL
          )}
          sx={{ flex: "1 1 224px" }}
        />
        <DisplayField
          label={translate(I18N_KEYS.PRICE_PER_SEAT)}
          value={translate(billingSummaryType, {
            price: translate.price(currency, pricePerSeat, {
              notation: "standard",
            }),
          })}
          sx={{ flex: "1 1 224px" }}
        />
        <DisplayField
          label={translate(I18N_KEYS.TOTAL_PRICE)}
          value={
            !hideTotalPrice
              ? translate(billingSummaryType, {
                  price: translate.price(currency, amountFormatted, {
                    notation: "standard",
                  }),
                })
              : "-"
          }
          sx={{ flex: "1 1 224px" }}
        />
      </div>
    </div>
  );
};
