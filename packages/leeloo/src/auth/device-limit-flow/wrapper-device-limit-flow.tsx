import React from "react";
import useTranslate from "../../libs/i18n/useTranslate";
import { Button } from "@dashlane/ui-components";
import { DeviceLimitFlowAnimation } from "./device-limit-flow-animation";
import backgroundTile from "./assets/background-tile.svg";
import styles from "./styles.css";
import { Flex, Logo } from "@dashlane/design-system";
const I18N_KEYS = {
  LOG_OUT: "webapp_login_one_device_limit_log_out",
};
interface WrapperDeviceLimitFlowProps {
  handleLogOut?: () => void;
}
export const WrapperDeviceLimitFlow: React.FC<WrapperDeviceLimitFlowProps> = ({
  children,
  handleLogOut,
}) => {
  const { translate } = useTranslate();
  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      sx={{
        height: "100vh",
        width: "100%",
      }}
    >
      <Flex
        alignItems="center"
        flexWrap="nowrap"
        justifyContent="space-between"
        sx={{
          height: "122px",
          minHeight: "122px",
          padding: "0px 56px 0px 56px",
        }}
      >
        <Logo height={40} name="DashlaneLockup" />
        <Button nature="secondary" onClick={handleLogOut} type="button">
          {translate(I18N_KEYS.LOG_OUT)}
        </Button>
      </Flex>
      <Flex
        flexWrap="nowrap"
        sx={{
          flexGrow: 1,
          padding: "0px 56px 50px 56px",
          backgroundImage: `url("${backgroundTile}")`,
          backgroundRepeat: "repeat-y",
          backgroundPosition: "top center",
          backgroundSize: "min(972px, calc(100% - 50px))",
        }}
      >
        {children}
        <DeviceLimitFlowAnimation
          containerClassName={styles.animationContainer}
          loop={true}
        />
      </Flex>
    </Flex>
  );
};
