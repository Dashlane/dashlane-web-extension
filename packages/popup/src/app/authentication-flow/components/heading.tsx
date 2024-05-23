import { FunctionComponent } from 'react';
import { CSSTransition } from 'react-transition-group';
import { jsx } from '@dashlane/design-system';
import { Lockup, LockupColor, LockupSize } from '@dashlane/ui-components';
import lockupTransition from 'app/login/lockup-transition.css';
import useTranslate from 'libs/i18n/useTranslate';
export interface HeadingProps {
    setAnimationRunning: (animationRunning: boolean) => void;
}
const animationTimeMs = 300;
const additionalTimeMs = 20;
const I18N_KEYS = {
    LOGO: 'login/logo_a11y',
};
export const Heading: FunctionComponent<HeadingProps> = ({ setAnimationRunning, }: HeadingProps) => {
    const { translate } = useTranslate();
    const triggerAnimation = (): void => {
        setAnimationRunning(true);
        setTimeout(() => setAnimationRunning(false), animationTimeMs + additionalTimeMs);
    };
    return (<div sx={{ padding: '40px 24px 4px' }}>
      <div sx={{
            marginBottom: '40px',
            '&:last-child': {
                marginBottom: '65px',
            },
        }} tabIndex={0} aria-label={translate(I18N_KEYS.LOGO)} role="img">
        <CSSTransition appear in={true} classNames={{ ...lockupTransition }} timeout={animationTimeMs} onEnter={() => triggerAnimation()}>
          <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39}/>
        </CSSTransition>
      </div>
    </div>);
};
