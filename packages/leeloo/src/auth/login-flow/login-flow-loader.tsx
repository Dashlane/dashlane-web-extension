import React from "react";
import { Flex } from "@dashlane/design-system";
import Animation from "../../libs/dashlane-style/animation";
import loadingLottie from "../../libs/assets/lottie-loading.json";
export interface LoginFlowLoaderProps {
  containerHeight?: string;
  customMargin?: string;
  customAnimationHeight?: number;
  customAnimationWidth?: number;
}
export const LoginFlowLoader = ({
  containerHeight = "100vh",
  customMargin,
  customAnimationHeight = 150,
  customAnimationWidth = 150,
}: LoginFlowLoaderProps) => (
  <Flex
    sx={{
      display: "flex",
      height: containerHeight,
      width: "100%",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      margin: customMargin,
    }}
  >
    <Animation
      height={customAnimationHeight}
      width={customAnimationWidth}
      animationParams={{
        renderer: "svg",
        animationData: loadingLottie,
        loop: true,
        autoplay: true,
      }}
    />
  </Flex>
);
