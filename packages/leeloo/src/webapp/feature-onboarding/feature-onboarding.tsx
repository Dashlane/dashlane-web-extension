import { ReactNode } from 'react';
import { Heading, jsx, mergeSx, ThemeUIStyleObject, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    FREE_TRIAL_WARNING: 'webapp_darkweb_onboarding_free_trial_warning',
};
export interface FeatureOnboardingProps {
    contentTitle: string;
    contentSubtitle: string;
    children: ReactNode;
    actions: ReactNode;
    daysRemaining?: number;
}
const headerContainer: ThemeUIStyleObject = { margin: '32px 0 0 32px' };
const freeTrial: ThemeUIStyleObject = { marginBottom: '76px' };
const noFreeTrial: ThemeUIStyleObject = { marginBottom: '100px' };
const overlay: ThemeUIStyleObject = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    overflow: 'auto',
    backgroundColor: 'ds.oddity.overlay',
    zIndex: 2,
};
const contentStyle: ThemeUIStyleObject = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: '4px',
    background: 'ds.container.agnostic.neutral.supershy',
    padding: '88px',
};
export const FeatureOnboarding = ({ contentTitle, contentSubtitle, children, actions, daysRemaining, }: FeatureOnboardingProps) => {
    const { translate } = useTranslate();
    const headerStyle = mergeSx([
        headerContainer,
        daysRemaining ? freeTrial : noFreeTrial,
    ]);
    return (<div sx={overlay}>
      <div sx={headerStyle}>
        {daysRemaining !== undefined ? (<div sx={{
                color: '#fe9d85',
                marginTop: '4px',
                lineHeight: '20px',
            }}>
            {translate(I18N_KEYS.FREE_TRIAL_WARNING, { days: daysRemaining })}
          </div>) : null}
      </div>
      <div sx={{ display: 'flex', justifyContent: 'center' }}>
        <div sx={{
            display: 'flex',
            justifyContent: 'center',
            margin: ' 0 10% 0 10%',
            maxWidth: '784px',
        }}>
          <div sx={contentStyle}>
            <Heading as="h2">{contentTitle}</Heading>
            <div sx={{
            color: 'ds.text.neutral.quiet',
            marginTop: '8px',
        }}>
              {contentSubtitle}
            </div>
            {children}
            {actions}
          </div>
        </div>
      </div>
    </div>);
};
