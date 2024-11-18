import { BufferedStream } from "./buffered-stream";
export type Listener<TContext = unknown> = (
  message: unknown,
  context: TContext
) => undefined | false;
export interface LowLevelEventSource<TContext = unknown> {
  addListener: (listener: Listener<TContext>) => void;
  removeListener: (listener: Listener<TContext>) => void;
}
export class BufferedEventStream<
  TMessage,
  TContext = unknown
> extends BufferedStream<TMessage, TContext> {
  public listener: (message: unknown, context: TContext) => undefined | false;
  private source: LowLevelEventSource<TContext>;
  private filter: (message: unknown, context: TContext) => message is TMessage;
  constructor({
    source,
    filter,
  }: {
    source: LowLevelEventSource<TContext>;
    filter: (message: unknown, context: TContext) => message is TMessage;
  }) {
    super();
    this.source = source;
    this.filter = filter;
    this.listener = this.internalListener.bind(this);
    this.source.addListener(this.listener);
  }
  public stop() {
    this.source.removeListener(this.listener);
  }
  private internalListener(
    message: unknown,
    context: TContext
  ): undefined | false {
    if (!this.filter(message, context)) {
      return false;
    }
    super.emit(message, context);
    return undefined;
  }
}
