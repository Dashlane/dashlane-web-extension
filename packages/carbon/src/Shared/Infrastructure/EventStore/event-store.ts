import { Observable, Subject, Subscription } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { concatMap, filter, share } from "rxjs/operators";
import { assertUnreachable } from "Helpers/assert-unreachable";
import {
  AddOperation,
  AddResult,
  AddSuccess,
  GenericStore,
  Item,
  Operation,
  OperationResult,
  OperationType,
  RemoveAllOperation,
  RemoveAllResult,
  RemoveOperation,
  RemoveResult,
  TopicEvent,
} from "Shared/Infrastructure/EventStore/types";
export abstract class EventStore<Store extends GenericStore> {
  private _operation$ = new Subject<Operation<Store, keyof Store>>();
  private _operationResults$: Observable<OperationResult<Store, keyof Store>>;
  private subs: Set<Subscription> = new Set();
  public constructor() {
    this.setupOperationsHandling();
  }
  public add = async <Topic extends keyof Store>(
    topic: Topic,
    event: TopicEvent<Store, Topic>
  ): Promise<string> => {
    const id = uuidv4();
    const resultPromise = new Promise<string>((resolve, reject) => {
      const sub = this._operationResults$.subscribe((result) => {
        if (result.id === id) {
          if (result.success === true) {
            resolve(id);
          } else {
            reject(result.error);
          }
          sub.unsubscribe();
          this.subs.delete(sub);
        }
      });
      this.subs.add(sub);
    });
    this.triggerAdd(topic, id, event);
    return resultPromise;
  };
  public remove = async <Topic extends keyof Store>(
    topic: Topic,
    id: string
  ): Promise<void> => {
    const resultPromise = new Promise<void>((resolve, reject) => {
      const sub = this._operationResults$.subscribe((result) => {
        if (result.id === id) {
          if (result.success === true) {
            resolve();
          } else {
            reject(result.error);
          }
          sub.unsubscribe();
          this.subs.delete(sub);
        }
      });
      this.subs.add(sub);
    });
    this.triggerRemove(topic, id);
    return resultPromise;
  };
  public removeAll = async <Topic extends keyof Store>(
    topic: Topic
  ): Promise<void> => {
    const id = uuidv4();
    const resultPromise = new Promise<void>((resolve, reject) => {
      const sub = this._operationResults$.subscribe((result) => {
        if (result.id === id) {
          if (result.success === true) {
            resolve();
          } else {
            reject(result.error);
          }
          sub.unsubscribe();
          this.subs.delete(sub);
        }
      });
      this.subs.add(sub);
    });
    this.triggerRemoveAll(topic, id);
    return resultPromise;
  };
  public newItems$<Topic extends keyof Store>(
    topic: Topic
  ): Observable<Item<TopicEvent<Store, Topic>>> {
    const resultIsAddSuccess = (
      result: OperationResult<Store, Topic>
    ): result is AddSuccess<Store, Topic> =>
      result.type === OperationType.Add && result.success;
    const resultIsOfTopic = (result: AddSuccess<Store, Topic>): boolean =>
      result.topic === topic;
    return this._operationResults$.pipe(
      filter(resultIsAddSuccess),
      filter(resultIsOfTopic)
    );
  }
  public async getItems<Topic extends keyof Store>(
    topic: Topic
  ): Promise<Store[Topic]> {
    const store = await this.retrieve();
    return store[topic];
  }
  public teardown() {
    this.subs.forEach((s) => s.unsubscribe());
  }
  protected abstract store(store: Partial<Store>): Promise<void>;
  protected abstract retrieve(): Promise<Store>;
  private async triggerAdd<Topic extends keyof Store>(
    topic: Topic,
    id: string,
    event: TopicEvent<Store, Topic>
  ): Promise<void> {
    const operation: AddOperation<Store, Topic> = {
      event,
      id,
      topic,
      type: OperationType.Add,
    };
    this._operation$.next(operation);
  }
  private async triggerRemove<Topic extends keyof Store>(
    topic: Topic,
    id: string
  ): Promise<void> {
    const operation: RemoveOperation<Store, Topic> = {
      id,
      topic,
      type: OperationType.Remove,
    };
    this._operation$.next(operation);
  }
  private async triggerRemoveAll<Topic extends keyof Store>(
    topic: Topic,
    id: string
  ): Promise<void> {
    const operation: RemoveAllOperation<Store, Topic> = {
      id,
      topic,
      type: OperationType.RemoveAll,
    };
    this._operation$.next(operation);
  }
  private onAdd = async <Topic extends keyof Store>(
    operation: AddOperation<Store, Topic>
  ): Promise<AddResult<Store, Topic>> => {
    const { id, event, topic, type } = operation;
    const baseResult = { id, topic, type };
    try {
      const currentStore = await this.retrieve();
      const newItem = { id, event };
      const updatedStore = {
        ...currentStore,
        [topic]: [...(currentStore[topic] || []), newItem],
      };
      await this.store(updatedStore);
      return {
        ...baseResult,
        success: true,
        event,
      };
    } catch (error) {
      return {
        ...baseResult,
        success: false,
        error,
      };
    }
  };
  private onRemove = async <Topic extends keyof Store>(
    operation: RemoveOperation<Store, Topic>
  ): Promise<RemoveResult<Topic>> => {
    const { id, topic, type } = operation;
    const baseResult = { id, topic, type };
    try {
      const currentStore = await this.retrieve();
      const updatedStore = {
        ...currentStore,
        [topic]: (currentStore[topic] || []).filter((item) => item.id !== id),
      };
      await this.store(updatedStore);
      return {
        ...baseResult,
        success: true,
      };
    } catch (error) {
      return {
        ...baseResult,
        success: false,
        error,
      };
    }
  };
  private onRemoveAll = async <Topic extends keyof Store>(
    operation: RemoveAllOperation<Store, Topic>
  ): Promise<RemoveAllResult<Topic>> => {
    const { id, topic, type } = operation;
    const baseResult = { id, topic, type };
    try {
      const currentStore = await this.retrieve();
      const updatedStore = {
        ...currentStore,
        [topic]: <any>[],
      };
      await this.store(updatedStore);
      return {
        ...baseResult,
        success: true,
      };
    } catch (error) {
      return {
        ...baseResult,
        success: false,
        error,
      };
    }
  };
  private onOperation = async <Topic extends keyof Store>(
    operation: Operation<Store, Topic>
  ): Promise<OperationResult<Store, Topic>> => {
    switch (operation.type) {
      case OperationType.Add:
        return this.onAdd(operation);
      case OperationType.Remove:
        return this.onRemove(operation);
      case OperationType.RemoveAll:
        return this.onRemoveAll(operation);
      default:
        return assertUnreachable(operation);
    }
  };
  private setupOperationsHandling = (): void => {
    const handler$ = this._operation$.pipe(
      concatMap(this.onOperation),
      share()
    );
    const sub = handler$.subscribe();
    this.subs.add(sub);
    this._operationResults$ = handler$;
  };
}
