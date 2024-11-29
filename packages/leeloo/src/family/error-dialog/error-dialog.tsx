import { DialogFooter, Paragraph } from "@dashlane/ui-components";
import * as React from "react";
import { JoinFamilyError } from "@dashlane/communication";
import useTranslate from "../../libs/i18n/useTranslate";
import { SimpleDialog } from "../../libs/dashlane-style/dialogs/simple/simple-dialog";
import { redirectToUrl } from "../../libs/external-urls";
import styles from "./styles.css";
const alreadyInPlanErrors = new Set<JoinFamilyError>([
  "CANNOT_JOIN_MULTIPLE_FAMILIES",
  "USER_MUST_CANCEL_PREMIUM_PLUS_RENEWAL_TO_DOWNGRADE_TO_FAMILY",
  "USER_SUBSCRIPTION_IS_UP_FOR_RENEWAL",
]);
interface ErrorDialogProps {
  errorCode: JoinFamilyError;
  resetErrorCode: () => void;
}
export const ErrorDialog = ({
  errorCode,
  resetErrorCode,
}: ErrorDialogProps) => {
  const { translate } = useTranslate();
  const isUserAlreadyInThisFamily = errorCode === "ALREADY_JOINED_THIS_FAMILY";
  const isUserAlreadyPremiumPlus =
    errorCode ===
    "USER_MUST_CANCEL_PREMIUM_PLUS_RENEWAL_TO_DOWNGRADE_TO_FAMILY";
  const isUserAlreadyInFamilyPlan = alreadyInPlanErrors.has(errorCode);
  if (
    errorCode !== "ALREADY_JOINED_THIS_FAMILY" &&
    !isUserAlreadyInFamilyPlan
  ) {
    return null;
  }
  const goToAccountSummary = (): void => {
    redirectToUrl("__REDACTED__");
  };
  const renderTitle = () =>
    isUserAlreadyInThisFamily
      ? translate("family_invitee_page_failed_heading_already_in_plan")
      : translate("family_invitee_page_failed_heading_in_another_plan");
  const renderSubtitle = () =>
    isUserAlreadyInThisFamily
      ? translate(
          "family_invitee_page_failed_heading_already_in_plan_description"
        )
      : isUserAlreadyPremiumPlus
      ? translate.markup(
          "family_invitee_page_failed_heading_already_premium_plus_description_markup"
        )
      : translate(
          "family_invitee_page_failed_heading_in_another_plan_description"
        );
  return (
    <SimpleDialog
      isOpen
      showCloseIcon
      onRequestClose={resetErrorCode}
      footer={
        <DialogFooter
          primaryButtonTitle={translate(
            "family_invitee_page_failed_button_title_another_plan"
          )}
          primaryButtonOnClick={goToAccountSummary}
          intent="primary"
        />
      }
      title={renderTitle()}
    >
      <Paragraph className={styles.subtitle}>{renderSubtitle()}</Paragraph>
    </SimpleDialog>
  );
};
