import { useEffect } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { CancelPlanStep, PageView } from "@dashlane/hermes";
import {
  Card,
  Heading,
  IndeterminateLoader,
  Infobox,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { openDashlaneUrl } from "../../../libs/external-urls";
import { logPageView } from "../../../libs/logs/logEvent";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logCancellationEvent } from "../logs";
const I18N_KEYS = {
  INFOBOX_DESCRIPTION: "manage_subscription_refund_complete_infobox",
  REFUND_CARD_TITLE: "manage_subscription_refund_complete_card_title",
  REFUND_CARD_DESCRIPTION:
    "manage_subscription_refund_complete_card_description",
  SIDE_CARD_TITLE: "manage_subscription_refund_complete_side_card_title",
  SIDE_CARD_DESCRIPTION:
    "manage_subscription_refund_complete_side_card_description",
  SIDE_CARD_BUTTON: "manage_subscription_refund_complete_side_card_button",
};
export const RefundCompleteCard = () => {
  const premiumStatus = usePremiumStatus();
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  useEffect(() => {
    if (premiumStatus.status === DataStatus.Success && premiumStatus.data) {
      logPageView(PageView.PlansManagementRefundDone);
      logCancellationEvent(CancelPlanStep.SuccessRefund, premiumStatus.data);
    }
  }, [premiumStatus]);
  if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
    return <IndeterminateLoader />;
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
          icon="FeedbackSuccessOutlined"
          mood="positive"
          title={translate(I18N_KEYS.INFOBOX_DESCRIPTION)}
        />
        <Card>
          <Heading
            as="h2"
            color="ds.text.neutral.catchy"
            textStyle="ds.title.section.medium"
          >
            {translate(I18N_KEYS.REFUND_CARD_TITLE)}
          </Heading>
          <Paragraph
            color="ds.text.neutral.quiet"
            textStyle="ds.body.standard.regular"
          >
            {translate(I18N_KEYS.REFUND_CARD_DESCRIPTION)}
          </Paragraph>
        </Card>
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
