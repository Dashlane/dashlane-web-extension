type EmbeddedStateLike<States, Transitions> = {
  initial: string;
  states: States;
  on?: Transitions;
};
export interface MachineDescLike<
  TContext,
  TEvents,
  TStates,
  TServices,
  TGuards,
  TActions,
  TTransitions
> {
  config: {
    schema: {
      context: TContext;
      events: TEvents;
    };
    initial: string;
    context: TContext;
    states: TStates;
    on?: TTransitions;
  };
  options?: {
    actions?: TActions;
    services?: TServices;
    guards?: TGuards;
  };
}
type IncludedState<A, B, S extends keyof A> = {
  [key in Exclude<keyof A, S>]: A[key];
} & {
  [key in Exclude<keyof A, Exclude<keyof A, S>>]: {
    [childKey in keyof B]: B[childKey];
  } & {
    [parentChildKey in keyof A[S]]: A[S][parentChildKey];
  };
};
export const composeMachine = <
  TContext,
  TEvents,
  TStates,
  TActions,
  TServices,
  TGuards,
  TTransitions,
  TEmbedContext,
  TEmbedEvents,
  TEmbedStates,
  TEmbedActions,
  TEmbedServices,
  TEmbedGuards,
  TEmbedTransitions
>(
  parentDesc: MachineDescLike<
    TContext,
    TEvents,
    TStates,
    TServices,
    TGuards,
    TActions,
    TTransitions
  >,
  embedDesc: MachineDescLike<
    TEmbedContext,
    TEmbedEvents,
    TEmbedStates,
    TEmbedServices,
    TEmbedGuards,
    TEmbedActions,
    TEmbedTransitions
  >,
  state: keyof TStates
): MachineDescLike<
  TContext & TEmbedContext,
  TEvents | TEmbedEvents,
  IncludedState<
    TStates,
    EmbeddedStateLike<TEmbedStates, TEmbedTransitions>,
    typeof state
  >,
  Partial<TServices & TEmbedServices>,
  Partial<TGuards & TEmbedGuards>,
  Partial<TActions & TEmbedActions>,
  TTransitions
> => {
  return {
    config: {
      schema: {
        context: {} as TContext & TEmbedContext,
        events: {} as TEvents | TEmbedEvents,
      },
      initial: parentDesc.config.initial,
      context: {
        ...parentDesc.config.context,
        ...embedDesc.config.context,
      },
      states: {
        ...parentDesc.config.states,
        [state]: {
          ...parentDesc.config.states[state],
          initial: embedDesc.config.initial,
          states: embedDesc.config.states,
          on: embedDesc.config.on,
        },
      },
      on: parentDesc.config.on,
    },
    options: {
      actions: {
        ...parentDesc.options?.actions,
        ...embedDesc.options?.actions,
      },
      services: {
        ...parentDesc.options?.services,
        ...embedDesc.options?.services,
      },
      guards: {
        ...parentDesc.options?.guards,
        ...embedDesc.options?.guards,
      },
    },
  };
};
