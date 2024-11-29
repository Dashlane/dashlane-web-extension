import {
  CallToAction,
  HelpCenterArticleCta,
  UserCallToActionEvent,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { LinkButton, Paragraph } from "@dashlane/design-system";
import { logEvent } from "../../libs/logs/logEvent";
import useTranslate from "../../libs/i18n/useTranslate";
import {
  BUSINESS_PLANS,
  DASHLANE_CONTACT_FORM,
  DASHLANE_HELP_CENTER,
} from "../urls";
import { ChangePlanCard } from "../change-plan/layout/change-plan-card";
const I18N_KEYS = {
  HEADER: "team_account_teamplan_changeplan_questions_header",
  VISIT_HELP_CENTER:
    "team_account_teamplan_changeplan_questions_visit_help_center",
  COMPARE_PLANS: "team_account_teamplan_changeplan_questions_compare_plans",
  CONTACT_CUSTOMER_SUPPORT:
    "team_account_teamplan_changeplan_questions_customer_support",
};
interface Props {
  contactSupport?: boolean;
}
export const Questions = ({ contactSupport = false }: Props) => {
  const { translate } = useTranslate();
  return (
    <ChangePlanCard
      title={
        <Paragraph
          textStyle="ds.title.supporting.small"
          color="ds.text.neutral.quiet"
          sx={{ marginBottom: "18px" }}
        >
          {translate(I18N_KEYS.HEADER)}
        </Paragraph>
      }
    >
      <LinkButton
        color="ds.text.brand.standard"
        href={DASHLANE_HELP_CENTER}
        isExternal
        onClick={() => {
          logEvent(
            new UserOpenHelpCenterEvent({
              helpCenterArticleCta: HelpCenterArticleCta.HelpCenter,
            })
          );
        }}
        sx={{ marginBottom: "10px" }}
      >
        {translate(I18N_KEYS.VISIT_HELP_CENTER)}
      </LinkButton>
      {contactSupport ? (
        <LinkButton
          color="ds.text.brand.standard"
          href={DASHLANE_CONTACT_FORM}
          isExternal
          onClick={() => {
            logEvent(
              new UserCallToActionEvent({
                callToActionList: [CallToAction.ContactCustomerSupport],
                chosenAction: CallToAction.ContactCustomerSupport,
                hasChosenNoAction: false,
              })
            );
          }}
        >
          {translate(I18N_KEYS.CONTACT_CUSTOMER_SUPPORT)}
        </LinkButton>
      ) : (
        <LinkButton
          color="ds.text.brand.standard"
          href={BUSINESS_PLANS}
          isExternal
          onClick={() => {
            logEvent(
              new UserCallToActionEvent({
                callToActionList: [CallToAction.SeeAllPlans],
                chosenAction: CallToAction.SeeAllPlans,
                hasChosenNoAction: false,
              })
            );
          }}
        >
          {translate(I18N_KEYS.COMPARE_PLANS)}
        </LinkButton>
      )}
    </ChangePlanCard>
  );
};
