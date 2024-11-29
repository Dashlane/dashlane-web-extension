import React from "react";
import { CustomRoute, RoutesProps, WrappingRoute } from "../../libs/router";
import { Onboarding } from "./onboarding";
import { ChooseSite } from "./onboarding-card/add-password/choose-site/choose-site";
import { ScanQRCode } from "./onboarding-card/add-mobile/scan-qr-code/scan-qr-code";
import { StorePersonalInfo } from "./onboarding-card/try-autofill/store-personal-info/store-personal-info";
import { OnboardingDispatcher } from "./onboarding-dispatcher";
export const OnboardingRoutes = ({ path }: RoutesProps) => {
  return (
    <WrappingRoute
      exact
      path={[
        path,
        `${path}/add-password`,
        `${path}/add-mobile`,
        `${path}/try-autofill`,
      ]}
      additionalProps={{
        location,
      }}
      component={Onboarding}
    >
      <CustomRoute exact path={`${path}`} component={OnboardingDispatcher} />
      <CustomRoute exact path={`${path}/add-password`} component={ChooseSite} />
      <CustomRoute exact path={`${path}/add-mobile`} component={ScanQRCode} />
      <CustomRoute
        exact
        path={`${path}/try-autofill`}
        component={StorePersonalInfo}
      />
    </WrappingRoute>
  );
};
