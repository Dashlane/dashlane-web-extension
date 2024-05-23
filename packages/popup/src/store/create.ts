interface ActionWithoutParams<T> {
    type: string;
}
interface ActionWithParams<T> {
    type: string;
    params: T;
}
type Action<T> = ActionWithoutParams<T> | ActionWithParams<T>;
export default function createReducer<S>(actionTypePrefix: string, defaultState: S) {
    const actionReducers = {};
    function apply(state: S = defaultState, action: Action<{}>) {
        if (actionReducers[action.type]) {
            return actionReducers[action.type](state, action['params']);
        }
        return state;
    }
    function registerAction<T>(type: string, reducer: (state: S, params?: T, bogus?: {
        _: boolean;
    }) => S): (params?: T) => Action<T> {
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
