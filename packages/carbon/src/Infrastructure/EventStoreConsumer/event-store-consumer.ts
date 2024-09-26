import { Subscription } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { EventStore } from "Shared/Infrastructure/EventStore/event-store";
import {
  GenericStore,
  Item,
  TopicEvent,
} from "Shared/Infrastructure/EventStore/types";
import { Hooks } from "Shared/Infrastructure/EventStoreConsumer/types";
export class EventStoreConsumer<Store extends GenericStore> {
  private liveConsumptionSubs = {} as Record<keyof Store, Subscription>;
  private lockIds = {} as Record<keyof Store, Set<string>>;
  constructor(
    private eventStore: EventStore<Store>,
    private hooks: Hooks<Store>
  ) {}
  public startTopic = (topic: keyof Store) => {
    this.startLiveConsumption(topic);
    this.consumeTopic(topic);
  };
  public lockTopic = (topic: keyof Store): string => {
    this.stopLiveConsumption(topic);
    const lockId = uuidv4();
    this.lockIds[topic] = (this.lockIds[topic] || new Set()).add(lockId);
    return lockId;
  };
  public releaseTopic = (topic: keyof Store, lockId: string): void => {
    const topicLocks = this.lockIds[topic];
    if (topicLocks) {
      topicLocks.delete(lockId);
    }
    if (!topicLocks || topicLocks.size === 0) {
      this.startTopic(topic);
    }
  };
  public teardown = () => {
    Object.keys(this.liveConsumptionSubs).forEach(this.stopLiveConsumption);
  };
  private consumeTopic = async (topic: keyof Store) => {
    const items = await this.eventStore.getItems(topic);
    for (const item of items) {
      this.handleItem(topic, item);
    }
  };
  private startLiveConsumption = (topic: keyof Store) => {
    if (!this.liveConsumptionSubs[topic]) {
      this.liveConsumptionSubs[topic] = this.eventStore
        .newItems$(topic)
        .subscribe((item) => this.handleItem(topic, item));
    }
  };
  private stopLiveConsumption = (topic: keyof Store) => {
    if (this.liveConsumptionSubs[topic]) {
      this.liveConsumptionSubs[topic].unsubscribe();
      delete this.liveConsumptionSubs[topic];
    }
  };
  private handleItem = async <Topic extends keyof Store>(
    topic: Topic,
    item: Item<TopicEvent<Store, Topic>>
  ): Promise<void> => {
    const hook = this.hooks[topic];
    if (!hook) {
      await this.eventStore.remove(topic, item.id);
    }
    const success = await hook(item.event);
    if (success) {
      await this.eventStore.remove(topic, item.id);
    }
  };
}
