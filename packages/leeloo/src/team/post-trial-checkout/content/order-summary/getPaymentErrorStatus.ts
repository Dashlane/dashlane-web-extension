import { UpgradeTeamWithExistingCcErrors } from "@dashlane/team-admin-contracts";
import { PaymentStatus } from "@dashlane/hermes";
export const getPaymentErrorStatus = (
  paymentError: UpgradeTeamWithExistingCcErrors
): PaymentStatus => {
  switch (paymentError) {
    case UpgradeTeamWithExistingCcErrors.B2B_PLAN_NOT_FOUND:
      return PaymentStatus.B2bPlanNotFound;
    case UpgradeTeamWithExistingCcErrors.INVALID_PLAN:
      return PaymentStatus.InvalidPlan;
    case UpgradeTeamWithExistingCcErrors.NOT_IN_A_TEAM_PLAN:
      return PaymentStatus.NotInATeamPlan;
    case UpgradeTeamWithExistingCcErrors.NOT_TEAM_CAPTAIN:
      return PaymentStatus.NotTeamCaptain;
    case UpgradeTeamWithExistingCcErrors.NOT_IN_FREE_TRIAL:
      return PaymentStatus.NotInFreeTrial;
    case UpgradeTeamWithExistingCcErrors.NO_KEY_FOR_USER:
      return PaymentStatus.NoKeyForUser;
    case UpgradeTeamWithExistingCcErrors.FORBIDDEN_EMAIL_DOMAIN:
      return PaymentStatus.ForbiddenEmailDomain;
    case UpgradeTeamWithExistingCcErrors.CANNOT_INVOICE_FREE_PLAN:
      return PaymentStatus.CannotInvoiceFreePlan;
    case UpgradeTeamWithExistingCcErrors.SALES_TAX_MISMATCH:
      return PaymentStatus.SalesTaxMismatch;
    case UpgradeTeamWithExistingCcErrors.SEATS_TO_PURCHASE_LOWER_ACTUAL_USAGE:
      return PaymentStatus.SeatsToPurchaseLowerActualUsage;
    case UpgradeTeamWithExistingCcErrors.SELECTED_PLAN_IS_NOT_VALID:
      return PaymentStatus.SelectedPlanIsNotValid;
    case UpgradeTeamWithExistingCcErrors.STARTER_PLAN_NOT_10_SEATS:
      return PaymentStatus.StarterPlanNot10Seats;
    case UpgradeTeamWithExistingCcErrors.TEAM_HAS_SSO_ENABLED:
      return PaymentStatus.TeamHasSsoEnabled;
    case UpgradeTeamWithExistingCcErrors.UNSUPPORTED_PAYMENT_MEAN:
      return PaymentStatus.SelectedPlanIsNotValid;
    case UpgradeTeamWithExistingCcErrors.USER_SUBSCRIBING_NOT_FOUND:
      return PaymentStatus.UserSubscribingNotFound;
    case UpgradeTeamWithExistingCcErrors.VAT_NUMBER_NOT_UPSERTED:
      return PaymentStatus.VatNumberNotUpserted;
    case UpgradeTeamWithExistingCcErrors.WRONG_AMOUNT_TO_PAY:
      return PaymentStatus.WrongAmountToPay;
    default:
      return PaymentStatus.PaymentErrorDuringUpgrade;
  }
};
