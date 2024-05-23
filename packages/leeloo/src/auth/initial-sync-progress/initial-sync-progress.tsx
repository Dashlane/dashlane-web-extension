import { Fragment } from 'react';
import { colors, FlexContainer, jsx, Lockup, LockupColor, LockupSize, Paragraph, } from '@dashlane/ui-components';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import useTranslate from 'libs/i18n/useTranslate';
import { useHasFeatureEnabled } from 'libs/carbon/hooks/useHasFeature';
import { UnlinkMultipleDevicesErrorModal } from 'auth/multiple-devices-limit/error-modal-dialog';
import { DeviceLimitFlowAnimation } from '../device-limit-flow/device-limit-flow-animation';
import { useInitialSyncProgress } from './use-initial-sync-progress';
import styles from './styles.css';
import { LoginDeviceLimitFlowStage, LoginDeviceLimitFlowView, } from '@dashlane/communication';
const I18N_KEYS = {
    MAY_TAKE_A_MINUTE: 'webapp_login_initial_sync_progress_may_take_a_minute',
    STORING_DATA: 'webapp_login_initial_sync_progress_storing_data',
    TRANSFERRING_DATA: 'webapp_login_initial_sync_progress_transferring_data',
    UNLINKING_PREVIOUS_DEVICE: 'webapp_login_initial_sync_progress_unlinking_previous_device',
};
const FF_I18N_KEYS = {
    STORING_DATA: 'webapp_login_initial_sync_progress_step_finish_transfer',
    TRANSFERRING_DATA: 'webapp_login_initial_sync_progress_step_securely_transferring_data',
    UNLINKING_PREVIOUS_DEVICE: 'webapp_login_initial_sync_progress_step_unlinking_other_device',
};
const FF_DESCRIPTION_I18N_KEYS = {
    STORING_DATA: 'webapp_login_initial_sync_progress_almost_done',
    TRANSFERRING_DATA: 'webapp_login_initial_sync_progress_may_take_few_moments',
    UNLINKING_PREVIOUS_DEVICE: 'webapp_login_initial_sync_progress_may_take_few_moments',
};
const FF_PERCENTAGE_KEYS = {
    STORING_DATA: '80%',
    TRANSFERRING_DATA: '50%',
    UNLINKING_PREVIOUS_DEVICE: '10%',
};
export interface InitialSyncProgressProps {
    stage: LoginDeviceLimitFlowView;
}
export const InitialSyncProgress = (props: InitialSyncProgressProps) => {
    const { translate } = useTranslate();
    const { step, animationProps } = useInitialSyncProgress(props);
    const featureFlip = useHasFeatureEnabled(FEATURE_FLIPS_WITHOUT_MODULE.GrowthproductDSLPaywallDemogorgon);
    return (<FlexContainer flexDirection="column" flexWrap="nowrap" fullWidth={true} sx={{
            height: '100vh',
            position: 'relative',
        }}>
      <FlexContainer alignItems="center" justifyContent="flex-start" gap="5" sx={{
            height: '122px',
            minHeight: '122px',
            padding: '0px 56px 0px 56px',
        }}>
        <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39}/>
      </FlexContainer>
      <FlexContainer flexDirection="column" alignItems="center" justifyContent="center" sx={{
            flexGrow: 1,
            padding: '0px 56px 0px 56px',
            position: 'relative',
            top: '-10%',
        }}>
        <DeviceLimitFlowAnimation containerClassName={styles.animationContainer} {...animationProps}/>
        <FlexContainer as="main" alignItems="center" flexDirection="column" sx={{
            maxWidth: '500px',
        }}>
          {featureFlip ? (<>
              <Paragraph color="ds.text.neutral.catchy" sx={{
                fontSize: 6,
                fontFamily: 'heading',
                fontWeight: 'light',
                marginBottom: '8px',
            }}>
                {translate(FF_I18N_KEYS[step])}
              </Paragraph>
              <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: '24px' }}>
                {translate(FF_DESCRIPTION_I18N_KEYS[step])}
              </Paragraph>
              <Paragraph color="ds.text.neutral.quiet">
                {FF_PERCENTAGE_KEYS[step]}
              </Paragraph>
            </>) : (<>
              <Paragraph color={colors.dashGreen00} sx={{
                fontSize: 5,
                fontFamily: 'heading',
                fontWeight: 'bolder',
                marginBottom: '16px',
            }}>
                {translate(I18N_KEYS[step])}
              </Paragraph>
              <Paragraph color={colors.grey00}>
                {translate(I18N_KEYS.MAY_TAKE_A_MINUTE)}
              </Paragraph>
            </>)}
        </FlexContainer>
      </FlexContainer>

      {props.stage.name ===
            LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError ? (<UnlinkMultipleDevicesErrorModal errorStage={props.stage}/>) : null}
    </FlexContainer>);
};
