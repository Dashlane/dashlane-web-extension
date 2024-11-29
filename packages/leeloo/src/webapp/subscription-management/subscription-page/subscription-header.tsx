import { Button, Heading } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { CancelPlanStep } from "@dashlane/hermes";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Header } from "../../components/header/header";
import { HeaderAccountMenu } from "../../components/header/header-account-menu";
import { logCancellationEvent } from "../logs";
import { Connected as NotificationsDropdown } from "../../bell-notifications/connected";
import { CancellationStep } from "../types";
const I18N_KEYS = {
  PAGE_TITLE: "manage_subscription_page_title",
  GO_BACK: "manage_subscription_cancel_section_back",
};
const StartWidgets = ({
  cancellationStep,
  setCancellationStep,
}: SubscriptionHeaderProps) => {
  const premiumStatus = usePremiumStatus();
  const { translate } = useTranslate();
  if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
    return null;
  }
  if (
    cancellationStep === CancellationStep.SUBSCRIPTION ||
    cancellationStep === CancellationStep.LOSS_AVERSION
  ) {
    return (
      <Heading as="h1" textStyle="ds.title.section.large">
        {translate(I18N_KEYS.PAGE_TITLE)}
      </Heading>
    );
  } else {
    return (
      <Button
        intensity="supershy"
        onClick={() => {
          if (cancellationStep === CancellationStep.CANCEL_CONFIRM) {
            logCancellationEvent(CancelPlanStep.Abandon, premiumStatus.data);
          }
          setCancellationStep(CancellationStep.SUBSCRIPTION);
        }}
        icon="ArrowLeftOutlined"
        layout="iconLeading"
        size="large"
      >
        {translate(I18N_KEYS.GO_BACK)}
      </Button>
    );
  }
};
export interface SubscriptionHeaderProps {
  cancellationStep: CancellationStep;
  setCancellationStep: (step: CancellationStep) => void;
}
export const SubscriptionHeader = ({
  cancellationStep,
  setCancellationStep,
}: SubscriptionHeaderProps) => {
  return (
    <Header
      sx={{
        padding: "32px",
      }}
      startWidgets={
        <StartWidgets
          cancellationStep={cancellationStep}
          setCancellationStep={setCancellationStep}
        />
      }
      endWidget={
        <>
          <HeaderAccountMenu />
          <NotificationsDropdown />
        </>
      }
    />
  );
};
