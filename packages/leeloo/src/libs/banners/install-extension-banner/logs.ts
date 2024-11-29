import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../logs/logEvent";
const logBannerInstallExtensionClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.DownloadExtension,
      clickOrigin: ClickOrigin.Banner,
    })
  );
};
export { logBannerInstallExtensionClick };
