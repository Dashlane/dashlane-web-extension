import * as React from 'react';
import { DeviceLimitDoneStageView, UnlinkingAndOpeningSessionStageView, } from '@dashlane/communication';
import { FlexChild, FlexContainer, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import useTranslate from 'libs/i18n/useTranslate';
import { DeviceLimitFlowAnimation } from '../DeviceLimitFlow/device-limit-flow-animation';
import { ProgressStep, useInitialSyncProgress, } from './use-initial-sync-progress';
import styles from './styles.css';
import { useHasFeatureEnabled } from 'src/libs/hooks/useHasFeature';
const I18N_KEYS = {
    DESCRIPTION: 'login/initial_sync_progress_may_take_a_minute',
    STORING_DATA: 'login/initial_sync_progress_step_storing_data',
    TRANSFERRING_DATA: 'login/initial_sync_progress_step_transferring_data',
    UNLINKING_PREVIOUS_DEVICE: 'login/initial_sync_progress_step_unlinking_previous_device',
};
const I18N_KEYS_V2 = {
    DESCRIPTION: 'login/initial_sync_progress_may_take_a_few_moments',
    STORING_DATA: 'login/initial_sync_progress_step_finishing_transfer',
    TRANSFERRING_DATA: 'login/initial_sync_progress_step_securely_transferring_data',
    UNLINKING_PREVIOUS_DEVICE: 'login/initial_sync_progress_step_unlinking_other_device',
    ALMOST_DONE: 'login/initial_sync_progress_almost_done',
};
interface InitialSyncProgressStepProps {
    stage: UnlinkingAndOpeningSessionStageView | DeviceLimitDoneStageView;
    setIsInitialSyncAnimationPending: (pending: boolean) => void;
}
const InitialSyncProgressStepComponent = (props: InitialSyncProgressStepProps) => {
    const { translate } = useTranslate();
    const { step, animationProps } = useInitialSyncProgress(props);
    const featureFlip = useHasFeatureEnabled(FEATURE_FLIPS_WITHOUT_MODULE.GrowthproductDSLPaywallDemogorgon);
    return featureFlip ? (<FlexContainer flexDirection="column" justifyContent="space-between" alignItems="stretch" sx={{
            backgroundColor: 'ds.background.default',
            padding: '0 24px 24px',
            height: '100%',
        }}>
      <DeviceLimitFlowAnimation containerClassName={styles.animationContainerV2} {...animationProps}/>
      <Heading size="small" sx={{
            padding: '0 6px',
            textAlign: 'center',
            color: 'ds.text.neutral.catchy',
            marginBottom: '16px',
            marginTop: '34px',
        }}>
        {translate(I18N_KEYS_V2[step])}
      </Heading>
      <FlexChild as={Paragraph} flex="1" size="large" sx={{
            padding: '0 6px',
            color: 'ds.text.neutral.quiet',
            textAlign: 'center',
        }}>
        {step === ProgressStep.STORING_DATA
            ? translate(I18N_KEYS_V2.ALMOST_DONE)
            : translate(I18N_KEYS_V2.DESCRIPTION)}
      </FlexChild>
    </FlexContainer>) : (<FlexContainer flexDirection="column" justifyContent="space-between" alignItems="stretch" sx={{
            padding: '0 24px 24px',
            height: '100%',
        }}>
      <DeviceLimitFlowAnimation containerClassName={styles.animationContainer} {...animationProps}/>
      <Heading size="x-small" sx={{
            padding: '0 6px',
            textAlign: 'center',
            color: 'white',
            marginBottom: '16px',
            marginTop: '48px',
        }}>
        {translate(I18N_KEYS[step])}
      </Heading>
      <FlexChild as={Paragraph} flex="1" size="medium" sx={{
            padding: '0 6px',
            color: 'primaries.1',
            textAlign: 'center',
        }}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </FlexChild>
    </FlexContainer>);
};
export const InitialSyncProgressStep = React.memo(InitialSyncProgressStepComponent);
