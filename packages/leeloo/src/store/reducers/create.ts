import { Action } from "../types";
export default function createReducer<S>(
  actionTypePrefix: string,
  defaultState: S
) {
  const actionReducers = {};
  function apply(state: S = defaultState, action: Action) {
    if (actionReducers[action.type]) {
      return actionReducers[action.type](state, action["params"]);
    }
    return state;
  }
  function registerAction<T>(
    type: string,
    reducer: (
      state: S,
      params: T,
      bogus?: {
        _: boolean;
      }
    ) => S
  ) {
    const fullType = `${actionTypePrefix}/${type}`;
    actionReducers[fullType] = reducer;
    return function (params: T) {
      return {
        type: fullType,
        params: params,
      } as Action;
    };
  }
  return {
    apply,
    registerAction,
  };
}
