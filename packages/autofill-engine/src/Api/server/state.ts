export interface AutofillEngineState {}
export interface AutofillEngineStateStorage {
  getState: (key: string) => Promise<AutofillEngineState>;
  setState: (key: string, newState: AutofillEngineState) => Promise<void>;
}
