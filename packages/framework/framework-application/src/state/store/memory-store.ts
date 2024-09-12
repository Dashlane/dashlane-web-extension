import { BehaviorSubject } from "rxjs";
import { IStore } from "./store.types";
export class MemoryAsyncStore<T> implements IStore<T> {
  constructor(private initValue: T) {
    this.state$ = new BehaviorSubject<T>(initValue);
  }
  public readonly state$: BehaviorSubject<T>;
  public set(value: T) {
    this.state$.next(value);
    return Promise.resolve();
  }
  public init(value: T) {
    this.state$.next(value);
    return Promise.resolve();
  }
  public stop(): void {
    this.state$.complete();
  }
  public getState() {
    return Promise.resolve(this.state$.value);
  }
  public clear() {
    this.state$.next(this.initValue);
    return Promise.resolve();
  }
  public clearStorage() {
    return Promise.resolve();
  }
  public update(updater: (value: T) => T) {
    this.set(updater(this.state$.value));
    return Promise.resolve();
  }
  public persist() {
    return Promise.resolve();
  }
  public load() {
    return Promise.resolve();
  }
  public getLimit = () => {
    return Promise.resolve(undefined);
  };
}
