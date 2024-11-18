import { Platform, PlatformView } from "@dashlane/communication";
const TO_PLATFORM_VIEW: Record<Platform, PlatformView> = {
  [Platform.Android]: PlatformView.Android,
  [Platform.CarbonTests]: PlatformView.Other,
  [Platform.CarbonUnknown]: PlatformView.Other,
  [Platform.DesktopLegacyMacOS]: PlatformView.DesktopMacOS,
  [Platform.DesktopLegacyWindows]: PlatformView.DesktopWindows,
  [Platform.DesktopUWP]: PlatformView.DesktopWindows,
  [Platform.IPad]: PlatformView.IPad,
  [Platform.IPhone]: PlatformView.IPhone,
  [Platform.IPod]: PlatformView.IPod,
  [Platform.StandaloneExtension]: PlatformView.StandaloneExtension,
  [Platform.TeamAdminConsole]: PlatformView.TeamAdminConsole,
  [Platform.WebApp]: PlatformView.WebApp,
  [Platform.WebAppDev]: PlatformView.WebApp,
} as const;
export const toPlatformView = (platform: Platform): PlatformView => {
  return TO_PLATFORM_VIEW[platform];
};
