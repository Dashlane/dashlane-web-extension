interface ActionWithoutParams<T> {
  type: string;
}
interface ActionWithParams<T> {
  type: string;
  params: T;
}
type Action<T> = ActionWithoutParams<T> | ActionWithParams<T>;
export default function createReducer<S>(
  actionTypePrefix: string,
  defaultState: S
) {
  const actionReducers: Record<string, unknown> = {};
  function apply(state: S = defaultState, action: Action<unknown>) {
    if (typeof actionReducers[action.type] === "function") {
      const reducer = actionReducers[action.type] as (
        state: S,
        params?: unknown
      ) => S;
      return reducer(state, "params" in action ? action["params"] : undefined);
    }
    return state;
  }
  function registerAction<T>(
    type: string,
    reducer: (
      state: S,
      params?: T,
      bogus?: {
        _: boolean;
      }
    ) => S
  ): (params?: T) => Action<T> {
    const fullType = `${actionTypePrefix}/${type}`;
    actionReducers[fullType] = reducer;
    return function (params?: T) {
      return {
        type: fullType,
        params,
      };
    };
  }
  return {
    apply,
    registerAction,
  };
}
