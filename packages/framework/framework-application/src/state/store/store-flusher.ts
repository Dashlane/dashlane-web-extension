import { Inject, Injectable } from "@nestjs/common";
import { ContextIdFactory, ModuleRef, REQUEST } from "@nestjs/core";
import { StoreList } from "./store-list";
import { IStore } from "./store.types";
@Injectable()
export class StoreFlusher {
  public constructor(
    private moduleRef: ModuleRef,
    @Inject(REQUEST)
    private request: Record<string, never>,
    private storeList: StoreList
  ) {}
  public async prepare(): Promise<void> {
    const contextId = ContextIdFactory.getByRequest(this.request);
    this.storeList.instances = await Promise.all(
      this.storeList.classes.map((store) => {
        return this.moduleRef.resolve<IStore>(store, contextId, {
          strict: false,
        });
      })
    );
  }
  public async flush(): Promise<void> {
    const { instances } = this.storeList;
    if (!instances.length) {
      throw new Error("Stores not instantiated");
    }
    const persists = instances.map((store) => store.persist());
    await Promise.all(persists);
  }
}
