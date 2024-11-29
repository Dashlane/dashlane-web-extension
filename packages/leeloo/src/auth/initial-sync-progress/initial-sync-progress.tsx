import { Paragraph } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import { UnlinkMultipleDevicesErrorModal } from "../multiple-devices-limit/error-modal-dialog";
import { DeviceLimitFlowAnimation } from "../device-limit-flow/device-limit-flow-animation";
import { useInitialSyncProgress } from "./use-initial-sync-progress";
import styles from "./styles.css";
import {
  LoginDeviceLimitFlowStage,
  LoginDeviceLimitFlowView,
} from "@dashlane/communication";
import { Flex, Logo } from "@dashlane/design-system";
const I18N_KEYS = {
  STORING_DATA: "webapp_login_initial_sync_progress_step_finish_transfer",
  TRANSFERRING_DATA:
    "webapp_login_initial_sync_progress_step_securely_transferring_data",
  UNLINKING_PREVIOUS_DEVICE:
    "webapp_login_initial_sync_progress_step_unlinking_other_device",
};
const FF_DESCRIPTION_I18N_KEYS = {
  STORING_DATA: "webapp_login_initial_sync_progress_almost_done",
  TRANSFERRING_DATA: "webapp_login_initial_sync_progress_may_take_few_moments",
  UNLINKING_PREVIOUS_DEVICE:
    "webapp_login_initial_sync_progress_may_take_few_moments",
};
const FF_PERCENTAGE_KEYS = {
  STORING_DATA: "80%",
  TRANSFERRING_DATA: "50%",
  UNLINKING_PREVIOUS_DEVICE: "10%",
};
export interface InitialSyncProgressProps {
  stage: LoginDeviceLimitFlowView;
}
export const InitialSyncProgress = (props: InitialSyncProgressProps) => {
  const { translate } = useTranslate();
  const { step, animationProps } = useInitialSyncProgress(props);
  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      fullWidth={true}
      sx={{
        height: "100vh",
        position: "relative",
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="flex-start"
        gap="5"
        sx={{
          height: "122px",
          minHeight: "122px",
          padding: "0px 56px 0px 56px",
        }}
      >
        <Logo height={40} name="DashlaneLockup" />
      </Flex>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          flexGrow: 1,
          padding: "0px 56px 0px 56px",
          position: "relative",
          top: "-10%",
        }}
      >
        <DeviceLimitFlowAnimation
          containerClassName={styles.animationContainer}
          {...animationProps}
        />
        <Flex
          as="main"
          alignItems="center"
          flexDirection="column"
          sx={{
            maxWidth: "500px",
          }}
        >
          <>
            <Paragraph
              color="ds.text.neutral.catchy"
              sx={{
                fontSize: 6,
                fontFamily: "heading",
                fontWeight: "light",
                marginBottom: "8px",
              }}
            >
              {translate(I18N_KEYS[step])}
            </Paragraph>
            <Paragraph
              color="ds.text.neutral.quiet"
              sx={{ marginBottom: "24px" }}
            >
              {translate(FF_DESCRIPTION_I18N_KEYS[step])}
            </Paragraph>
            <Paragraph color="ds.text.neutral.quiet">
              {FF_PERCENTAGE_KEYS[step]}
            </Paragraph>
          </>
        </Flex>
      </Flex>

      {props.stage.name ===
      LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError ? (
        <UnlinkMultipleDevicesErrorModal errorStage={props.stage} />
      ) : null}
    </Flex>
  );
};
