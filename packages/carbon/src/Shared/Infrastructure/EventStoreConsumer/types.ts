import {
  GenericStore,
  TopicEvent,
} from "Shared/Infrastructure/EventStore/types";
export type Hooks<Store extends GenericStore> = {
  [Topic in keyof Store]: (event: TopicEvent<Store, Topic>) => Promise<boolean>;
};
