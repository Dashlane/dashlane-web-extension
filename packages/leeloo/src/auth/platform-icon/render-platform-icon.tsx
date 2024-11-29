import React from "react";
import {
  AndroidIcon,
  AppleIcon,
  WebIcon,
  WindowsIcon,
} from "@dashlane/ui-components";
import { PlatformView } from "@dashlane/communication";
export const RenderPlatformIcon = ({
  platform,
}: {
  platform: PlatformView;
}) => {
  const dimensions = { height: 36, width: 36 };
  switch (platform) {
    case "android":
      return (
        <AndroidIcon aria-hidden={true} viewBox="0 0 24 30" {...dimensions} />
      );
    case "windows":
      return (
        <WindowsIcon aria-hidden={true} viewBox="0 0 28 28" {...dimensions} />
      );
    case "macosx":
    case "iphone":
    case "ipad":
    case "ipod":
      return (
        <AppleIcon aria-hidden={true} viewBox="0 0 25 30" {...dimensions} />
      );
    case "saex":
    case "tac":
    case "webapp":
    case "other":
    default:
      return <WebIcon aria-hidden={true} viewBox="0 0 20 20" {...dimensions} />;
  }
};
