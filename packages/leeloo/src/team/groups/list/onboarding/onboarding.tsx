import { DSStyleObject, Heading, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import arrowIcon from './arrow.svg';
import styles from './styles.css';
const SX_STYLES: Record<string, DSStyleObject> = {
    CONTAINER: {
        width: '100%',
        textAlign: 'center',
        marginTop: '32px',
        paddingTop: '58px',
        border: 'dashed 1px ds.border.neutral.quiet.idle',
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
    },
};
export const Onboarding = () => {
    const { translate } = useTranslate();
    return (<div sx={SX_STYLES.CONTAINER}>
      <div className={styles.onboardingTitlePanel}>
        <Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy">
          {translate('team_groups_list_onboarding_title')}
        </Heading>
      </div>

      <div className={styles.onboardingStepsContainer}>
        <div className={styles.onboardingStepPanel}>
          <div className={styles.onboardingStepCounterPanel}>
            <div className={styles.circle}>1</div>
          </div>
          <div className={styles.onboardingStepText}>
            {translate('team_groups_list_onboarding_step_1')}
          </div>
        </div>

        <div className={styles.onboardingStepArrow}>
          <img src={arrowIcon}/>
        </div>

        <div className={styles.onboardingStepPanel}>
          <div className={styles.onboardingStepCounterPanel}>
            <div className={styles.circle}>2</div>
          </div>
          <div className={styles.onboardingStepText}>
            {translate('team_groups_list_onboarding_step_2')}
          </div>
        </div>

        <div className={styles.onboardingStepArrow}>
          <img src={arrowIcon}/>
        </div>

        <div className={styles.onboardingStepPanel}>
          <div className={styles.onboardingStepCounterPanel}>
            <div className={styles.circle}>3</div>
          </div>
          <div className={styles.onboardingStepText}>
            {translate('team_groups_list_onboarding_step_3')}
          </div>
        </div>
      </div>
    </div>);
};
