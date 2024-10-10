export const APP_SESSION_ID_INITIALIZED = "APP_SESSION_ID_INITIALIZED";
export interface AppSessionIdInitializedAction {
  type: typeof APP_SESSION_ID_INITIALIZED;
  appSessionId: number;
}
export type ApplicationSessionAction = AppSessionIdInitializedAction;
export const appSessionIdInitialized = (
  appSessionId: number
): AppSessionIdInitializedAction => ({
  type: APP_SESSION_ID_INITIALIZED,
  appSessionId,
});
