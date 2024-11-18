import { Observable, Subscriber } from "rxjs";
export class BufferedStream<TMessage, TContext = unknown> {
  constructor() {
    this.events$ = new Observable<[TMessage, TContext]>((newSubscriber) => {
      if (!this.registeredSubscribers.size) {
        this.queuedEvents.forEach((event) => newSubscriber.next(event));
        this.queuedEvents = [];
      }
      this.registeredSubscribers.add(newSubscriber);
      return () => {
        this.registeredSubscribers.delete(newSubscriber);
      };
    });
  }
  public emit(message: TMessage, context: TContext) {
    if (this.registeredSubscribers.size) {
      this.registeredSubscribers.forEach((subscriber) =>
        subscriber.next([message, context])
      );
    } else {
      this.queuedEvents.push([message, context]);
    }
    return undefined;
  }
  public events$: Observable<[TMessage, TContext]>;
  private queuedEvents: [TMessage, TContext][] = [];
  private registeredSubscribers = new Set<Subscriber<[TMessage, TContext]>>();
}
