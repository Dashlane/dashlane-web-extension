import type { LeeWithStorage } from "./app/createElement/makeLeeWithStorage";
export type { LeeWithStorage } from "./app/createElement/makeLeeWithStorage";
export type { Lee } from "./app/createElement/makeLee";
export { LEE_INCORRECT_AUTHENTICATION } from "./app/createElement/makeLee";
interface DefaultLee<State> extends LeeWithStorage<State> {}
export default DefaultLee;
