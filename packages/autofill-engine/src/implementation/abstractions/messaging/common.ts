export const getMethodNamesFromClass = <T>(obj: T): (keyof T)[] => {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(
    (name) => name !== "constructor"
  ) as (keyof T)[];
};
export enum AutofillEngineMessageType {
  Action = "autofill-engine-action",
  Command = "autofill-engine-command",
}
export const BROWSER_MAIN_FRAME_ID = 0;
