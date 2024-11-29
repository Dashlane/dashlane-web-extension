import React, { ReactNode } from "react";
import { Redirect } from "../../libs/router";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import { PaymentFailureChurning } from "../notifications/payment-failure-churning/payment-failure-churning";
import { useIsUserPaywalledForClient } from "./use-is-user-paywalled-for-client";
interface Props {
  children: ReactNode;
}
export const PersonalDataSectionView = ({ children }: Props) => {
  const { routes } = useRouterGlobalSettingsContext();
  const isUserPaywalled = useIsUserPaywalledForClient();
  if (isUserPaywalled) {
    return <Redirect to={routes.userUpsell} />;
  }
  return (
    <>
      {children}

      <PaymentFailureChurning />
    </>
  );
};
