import { logEvent } from "../../../../../libs/logs/logEvent";
import { FlowStep, UserChangeContactEmailEvent } from "@dashlane/hermes";
const logChangeContactEmailEvent = (step: FlowStep): void => {
  logEvent(
    new UserChangeContactEmailEvent({
      flowStep: step,
    })
  );
};
export const logChangeContactEmailStartEvent = logChangeContactEmailEvent.bind(
  null,
  FlowStep.Start
);
export const logChangeContactEmailErrorEvent = logChangeContactEmailEvent.bind(
  null,
  FlowStep.Error
);
export const logChangeContactEmailCompleteEvent =
  logChangeContactEmailEvent.bind(null, FlowStep.Complete);
