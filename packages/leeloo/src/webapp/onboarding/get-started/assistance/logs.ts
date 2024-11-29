import {
  HelpCenterArticleCta,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../../../libs/logs/logEvent";
const logOpenHelpCenter = () => {
  logEvent(
    new UserOpenHelpCenterEvent({
      helpCenterArticleCta: HelpCenterArticleCta.HelpCenter,
    })
  );
};
const logOpenResourceCenter = () => {
  logEvent(
    new UserOpenHelpCenterEvent({
      helpCenterArticleCta: HelpCenterArticleCta.ResourceCenter,
    })
  );
};
const logContactUs = () => {
  logEvent(
    new UserOpenHelpCenterEvent({
      helpCenterArticleCta: HelpCenterArticleCta.ContactUs,
    })
  );
};
export { logOpenHelpCenter, logOpenResourceCenter, logContactUs };
