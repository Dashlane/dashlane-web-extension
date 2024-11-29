import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../logs/logEvent";
export const logBuyDashlaneClick = () => {
  logEvent(
    new UserClickEvent({
      button: Button.BuyDashlane,
      clickOrigin: ClickOrigin.Banner,
    })
  );
};
