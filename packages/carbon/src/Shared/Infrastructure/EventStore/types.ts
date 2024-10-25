export type Item<T> = {
  id: string;
  event: T;
};
export type TopicEvent<
  Store extends GenericStore,
  Topic extends keyof Store
> = Store[Topic] extends {
  event: infer E;
}[]
  ? E
  : never;
export type GenericStore = {
  [topic: string]: Item<any>[];
};
export enum OperationType {
  Add = "add",
  Remove = "remove",
  RemoveAll = "removeAll",
}
export interface AddOperation<
  Store extends GenericStore,
  Topic extends keyof Store
> {
  event: TopicEvent<Store, Topic>;
  id: string;
  topic: Topic;
  type: OperationType.Add;
}
export interface RemoveOperation<
  Store extends GenericStore,
  Topic extends keyof Store
> {
  id: string;
  topic: Topic;
  type: OperationType.Remove;
}
export interface RemoveAllOperation<
  Store extends GenericStore,
  Topic extends keyof Store
> {
  id: string;
  topic: Topic;
  type: OperationType.RemoveAll;
}
export type Operation<Store extends GenericStore, Topic extends keyof Store> =
  | AddOperation<Store, Topic>
  | RemoveOperation<Store, Topic>
  | RemoveAllOperation<Store, Topic>;
export type AddSuccess<
  Store extends GenericStore,
  Topic extends keyof Store
> = {
  event: TopicEvent<Store, Topic>;
  id: string;
  success: true;
  topic: Topic;
  type: OperationType.Add;
};
export type AddFailure<Topic> = {
  id: string;
  success: false;
  error: unknown;
  topic: Topic;
  type: OperationType.Add;
};
export type AddResult<Store extends GenericStore, Topic extends keyof Store> =
  | AddSuccess<Store, Topic>
  | AddFailure<Topic>;
export type RemoveSuccess<Topic> = {
  id: string;
  success: true;
  topic: Topic;
  type: OperationType.Remove;
};
export type RemoveFailure<Topic> = {
  id: string;
  success: false;
  error: unknown;
  topic: Topic;
  type: OperationType.Remove;
};
export type RemoveResult<Topic> = RemoveSuccess<Topic> | RemoveFailure<Topic>;
export type RemoveAllSuccess<Topic> = {
  id: string;
  success: true;
  topic: Topic;
  type: OperationType.RemoveAll;
};
export type RemoveAllFailure<Topic> = {
  id: string;
  success: false;
  error: unknown;
  topic: Topic;
  type: OperationType.RemoveAll;
};
export type RemoveAllResult<Topic> =
  | RemoveAllSuccess<Topic>
  | RemoveAllFailure<Topic>;
export type OperationResult<
  Store extends GenericStore,
  Topic extends keyof Store
> = AddResult<Store, Topic> | RemoveResult<Topic> | RemoveAllResult<Topic>;
