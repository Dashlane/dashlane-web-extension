export interface Stoppable {
  stop: () => Promise<void> | void;
}
export interface Startable {
  start: () => Promise<Stoppable> | Stoppable;
}
