import { defer, from, Observable } from "rxjs";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { JsonApplicationResourceFetcher } from "./json-app-resource-fetcher";
@Injectable()
export abstract class JsonApplicationResourceLoader<T> {
  private value?: T;
  constructor(
    private url: string,
    private fetcher: JsonApplicationResourceFetcher
  ) {
    this.value$ = from(
      defer(() => {
        return this.get();
      })
    );
  }
  public abstract loadResource(jsonObject: unknown): Promise<T> | T;
  public readonly value$: Observable<T>;
  public async load(): Promise<void> {
    await this.get();
  }
  public async get(): Promise<T> {
    const { value } = this;
    if (value) {
      return value;
    }
    const fetched = await this.fetcher.fetch(this.url);
    const loaded = await this.loadResource(fetched);
    this.value = loaded;
    return loaded;
  }
}
