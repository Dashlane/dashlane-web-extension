import { IStore, StoreClassDefinition } from "./store.types";
export class StoreList {
  private registeredClasses: StoreClassDefinition[] = [];
  private preparedInstances: IStore[] = [];
  public get classes(): StoreClassDefinition[] {
    return this.registeredClasses;
  }
  public get instances(): IStore[] {
    return this.preparedInstances;
  }
  public set instances(stores: IStore[]) {
    this.preparedInstances = stores;
  }
  public registerClass(store: StoreClassDefinition): void {
    this.registeredClasses.push(store);
  }
}
