export abstract class JsonApplicationResourceFetcher {
  public abstract fetch(resourceUrl: string): Promise<unknown>;
}
