export const CREATE_EVENT_LOGGER_VIRTUAL_STORE =
  "CREATE_EVENT_LOGGER_VIRTUAL_STORE";
export interface CreateEventLoggerVirtualStoreAction {
  type: typeof CREATE_EVENT_LOGGER_VIRTUAL_STORE;
  storeName: string;
  initialState: unknown;
}
export interface CreateEventLoggerVirtualStoreParams {
  storeName: string;
  initialState: unknown;
}
export const createEventLoggerVirtualStore = ({
  storeName,
  initialState,
}: CreateEventLoggerVirtualStoreParams): CreateEventLoggerVirtualStoreAction => {
  return {
    type: CREATE_EVENT_LOGGER_VIRTUAL_STORE,
    storeName,
    initialState,
  };
};
export const UPDATE_EVENT_LOGGER_STATE = "UPDATE_EVENT_LOGGER_STATE";
export interface UpdateEventLoggerVirtualStoreStateAction<T> {
  type: typeof UPDATE_EVENT_LOGGER_STATE;
  storeName: string;
  updater: (previousState: T) => T;
}
export interface UpdateEventLoggerVirtualStoreStateParams<T> {
  storeName: string;
  updater: (previousState: T) => T;
}
export const updateEventLoggerVirtualStoreState = <T>({
  storeName,
  updater,
}: UpdateEventLoggerVirtualStoreStateParams<T>): UpdateEventLoggerVirtualStoreStateAction<T> => {
  return {
    type: UPDATE_EVENT_LOGGER_STATE,
    storeName,
    updater,
  };
};
export type EventLoggerAction =
  | CreateEventLoggerVirtualStoreAction
  | UpdateEventLoggerVirtualStoreStateAction<unknown>;
