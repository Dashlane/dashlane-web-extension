import { memo } from "react";
import { Flex } from "@dashlane/design-system";
import {
  DeviceLimitDoneStageView,
  UnlinkingAndOpeningSessionStageView,
} from "@dashlane/communication";
import { Heading, jsx, Paragraph } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DeviceLimitFlowAnimation } from "../DeviceLimitFlow/device-limit-flow-animation";
import {
  ProgressStep,
  useInitialSyncProgress,
} from "./use-initial-sync-progress";
import styles from "./styles.css";
const I18N_KEYS = {
  DESCRIPTION: "login/initial_sync_progress_may_take_a_few_moments",
  STORING_DATA: "login/initial_sync_progress_step_finishing_transfer",
  TRANSFERRING_DATA:
    "login/initial_sync_progress_step_securely_transferring_data",
  UNLINKING_PREVIOUS_DEVICE:
    "login/initial_sync_progress_step_unlinking_other_device",
  ALMOST_DONE: "login/initial_sync_progress_almost_done",
};
interface InitialSyncProgressStepProps {
  stage: UnlinkingAndOpeningSessionStageView | DeviceLimitDoneStageView;
  setIsInitialSyncAnimationPending: (pending: boolean) => void;
}
const InitialSyncProgressStepComponent = (
  props: InitialSyncProgressStepProps
) => {
  const { translate } = useTranslate();
  const { step, animationProps } = useInitialSyncProgress(props);
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      alignItems="stretch"
      sx={{
        backgroundColor: "ds.background.default",
        padding: "0 24px 24px",
        height: "100%",
      }}
    >
      <DeviceLimitFlowAnimation
        containerClassName={styles.animationContainerV2}
        {...animationProps}
      />
      <Heading
        size="small"
        sx={{
          padding: "0 6px",
          textAlign: "center",
          color: "ds.text.neutral.catchy",
          marginBottom: "16px",
          marginTop: "34px",
        }}
      >
        {translate(I18N_KEYS[step])}
      </Heading>
      <Paragraph
        size="large"
        sx={{
          padding: "0 6px",
          color: "ds.text.neutral.quiet",
          textAlign: "center",
          flex: 1,
        }}
      >
        {step === ProgressStep.STORING_DATA
          ? translate(I18N_KEYS.ALMOST_DONE)
          : translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
    </Flex>
  );
};
export const InitialSyncProgressStep = memo(InitialSyncProgressStepComponent);
