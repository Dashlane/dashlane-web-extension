import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { Button, FlexContainer, jsx, Lockup, LockupColor, LockupSize, } from '@dashlane/ui-components';
import { DeviceLimitFlowAnimation } from './device-limit-flow-animation';
import backgroundTile from './assets/background-tile.svg';
import styles from './styles.css';
const I18N_KEYS = {
    LOG_OUT: 'webapp_login_one_device_limit_log_out',
};
interface WrapperDeviceLimitFlowProps {
    handleLogOut?: () => void;
}
export const WrapperDeviceLimitFlow: React.FC<WrapperDeviceLimitFlowProps> = ({ children, handleLogOut, }) => {
    const { translate } = useTranslate();
    return (<FlexContainer flexDirection="column" flexWrap="nowrap" sx={{
            height: '100vh',
            width: '100%',
        }}>
      <FlexContainer alignItems="center" flexWrap="nowrap" justifyContent="space-between" sx={{
            height: '122px',
            minHeight: '122px',
            padding: '0px 56px 0px 56px',
        }}>
        <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39}/>
        <Button nature="secondary" onClick={handleLogOut} type="button">
          {translate(I18N_KEYS.LOG_OUT)}
        </Button>
      </FlexContainer>
      <FlexContainer flexDirection="row" flexWrap="nowrap" sx={{
            flexGrow: 1,
            padding: '0px 56px 50px 56px',
            backgroundImage: `url("${backgroundTile}")`,
            backgroundRepeat: 'repeat-y',
            backgroundPosition: 'top center',
            backgroundSize: 'min(972px, calc(100% - 50px))',
        }}>
        {children}
        <DeviceLimitFlowAnimation containerClassName={styles.animationContainer} loop={true}/>
      </FlexContainer>
    </FlexContainer>);
};
