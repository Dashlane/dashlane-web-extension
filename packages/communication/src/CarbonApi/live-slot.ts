import { slot } from "ts-event-bus";
const config = { noBuffer: true };
export const liveSlot = <T>() => slot<T>(config);
