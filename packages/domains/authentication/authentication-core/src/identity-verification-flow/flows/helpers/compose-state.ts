export const composeState = <States, On>(config: {
  initial: string;
  states: States;
  on?: On;
}) => ({
  initial: config.initial,
  states: config.states,
  on: config.on ?? {},
});
