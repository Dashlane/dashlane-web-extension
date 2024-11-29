import { useEffect } from "react";
import { CancelPlanStep, PageView } from "@dashlane/hermes";
import {
  Button,
  Card,
  Heading,
  Infobox,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { openDashlaneUrl, openUrl } from "../../../libs/external-urls";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import { DASHLANE_CONTACT_SUPPORT_WITH_CHATBOT } from "../../urls";
import { logCancellationEvent } from "../logs";
const I18N_KEYS = {
  BUTTON: "manage_subscription_refund_fail_support_button",
  DESCRIPTION_CANCEL: "manage_subscription_cancel_failure_infobox_description",
  DESCRIPTION_REFUND: "manage_subscription_refund_failure_infobox_description",
  SIDE_CARD_TITLE: "manage_subscription_refund_complete_side_card_title",
  SIDE_CARD_DESCRIPTION:
    "manage_subscription_refund_complete_side_card_description",
  SIDE_CARD_BUTTON: "manage_subscription_refund_complete_side_card_button",
  TITLE_CANCEL: "manage_subscription_cancel_failure_title",
  TITLE_REFUND: "manage_subscription_refund_fail_title",
};
export interface CancelOrRefundFailureCardProps {
  isRefund: boolean;
}
export const CancelOrRefundFailureCard = ({
  isRefund,
}: CancelOrRefundFailureCardProps) => {
  const premiumStatus = usePremiumStatus();
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const title = isRefund ? I18N_KEYS.TITLE_REFUND : I18N_KEYS.TITLE_CANCEL;
  const description = isRefund
    ? I18N_KEYS.DESCRIPTION_REFUND
    : I18N_KEYS.DESCRIPTION_CANCEL;
  useEffect(() => {
    if (premiumStatus.status === DataStatus.Success && premiumStatus.data) {
      const page = isRefund
        ? PageView.PlansManagementRefundError
        : PageView.PlansManagementCancelError;
      const event = isRefund
        ? CancelPlanStep.SuccessCancelAndErrorRefund
        : CancelPlanStep.CancelError;
      logPageView(page);
      logCancellationEvent(event, premiumStatus.data);
    }
  }, [premiumStatus]);
  if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
    return null;
  }
  const goToPlansPage = () => {
    openDashlaneUrl(routes.userGoPlans, {
      type: "subscriptionManagement",
      action: "goToPlans",
    });
  };
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        maxWidth: "1072px",
      }}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Infobox
          title={translate(title)}
          mood="danger"
          icon="FeedbackFailOutlined"
          description={translate(description)}
          size="large"
          actions={[
            <Button
              key={translate(I18N_KEYS.BUTTON)}
              intensity="catchy"
              mood="danger"
              role="link"
              onClick={() => {
                logCancellationEvent(
                  CancelPlanStep.ContactSupport,
                  premiumStatus.data
                );
                openUrl(DASHLANE_CONTACT_SUPPORT_WITH_CHATBOT);
              }}
            >
              {translate(I18N_KEYS.BUTTON)}
            </Button>,
          ]}
        />
      </div>
      <Card sx={{ maxWidth: "347px" }}>
        <Heading
          as="h4"
          color="ds.text.neutral.catchy"
          textStyle="ds.title.block.medium"
        >
          {translate(I18N_KEYS.SIDE_CARD_TITLE)}
        </Heading>
        <Paragraph
          color="ds.text.neutral.standard"
          textStyle="ds.body.standard.regular"
        >
          {translate(I18N_KEYS.SIDE_CARD_DESCRIPTION)}
        </Paragraph>
        <LinkButton isExternal onClick={goToPlansPage}>
          {translate(I18N_KEYS.SIDE_CARD_BUTTON)}
        </LinkButton>
      </Card>
    </div>
  );
};
