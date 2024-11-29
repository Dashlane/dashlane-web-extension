import { PropsWithChildren } from "react";
import classnames from "classnames";
import { AdminPermissionLevel } from "@dashlane/communication";
import {
  DashlaneBusinessMarketingContainer,
  StandardMarketingContainer,
} from "../left-panels";
import { LoginNotifications } from "./login-notifications/login-notifications";
import { LoginFlowLoader } from "./login-flow/login-flow-loader";
import { DeviceLimitFlow } from "./device-limit-flow";
import { useLoginDeviceLimitFlow } from "./device-limit-flow/use-device-limit-flow";
import styles from "./styles.css";
export enum MarketingContentType {
  DashlaneBusiness = "dashlaneBusiness",
  Standard = "standard",
}
export interface AuthOptions {
  marketingContentType?: MarketingContentType;
  requiredPermissions?: AdminPermissionLevel;
}
interface AuthProps {
  options?: AuthOptions;
}
export const Auth = ({
  children,
  options: { marketingContentType } = {
    marketingContentType: MarketingContentType.Standard,
  },
}: PropsWithChildren<AuthProps>) => {
  const deviceLimitStage = useLoginDeviceLimitFlow();
  if (deviceLimitStage === undefined) {
    return <LoginFlowLoader />;
  }
  return (
    <>
      {deviceLimitStage ? (
        <DeviceLimitFlow stage={deviceLimitStage} />
      ) : (
        <div
          sx={{ backgroundColor: "ds.container.agnostic.neutral.supershy" }}
          className={styles.panelsContainer}
        >
          {marketingContentType === MarketingContentType.DashlaneBusiness ? (
            <DashlaneBusinessMarketingContainer />
          ) : (
            <StandardMarketingContainer />
          )}

          <div
            className={classnames(
              styles.panelContainer,
              styles.loginPanelContainer
            )}
          >
            {children}
          </div>
        </div>
      )}
      <LoginNotifications />
    </>
  );
};
