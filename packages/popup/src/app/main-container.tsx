import React from "react";
import { FooterAlertHubProvider } from "./footer/footer-alert-hub/footer-alert-hub-context";
import UIStateProvider from "./UIState/ui-state-provider";
import { Main } from "./main";
import { Kernel } from "../kernel";
interface MainContainerProps {
  kernel: Kernel;
}
export const MainContainer = ({ kernel }: MainContainerProps) => {
  return (
    <UIStateProvider>
      <FooterAlertHubProvider>
        <Main kernel={kernel} />
      </FooterAlertHubProvider>
    </UIStateProvider>
  );
};
