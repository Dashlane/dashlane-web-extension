import { KeyValueStorageInfrastructure } from "../state/storage/types";
export interface CronEntry {
  dueTimestamp: number;
  moduleName: string;
  name: string;
}
function isCronEntry(a: unknown): a is CronEntry {
  return (
    !!a &&
    typeof a === "object" &&
    "dueTimestamp" in a &&
    "moduleName" in a &&
    "name" in a &&
    typeof a.name === "string" &&
    typeof a.moduleName === "string" &&
    typeof a.dueTimestamp === "number"
  );
}
export interface CronState {
  entries: CronEntry[];
}
function isCronState(a: unknown): a is CronState {
  return (
    !!a &&
    typeof a === "object" &&
    "entries" in a &&
    Array.isArray(a.entries) &&
    a.entries.every((x) => isCronEntry(x))
  );
}
const KEY_PREFIX = "crons";
export class CronRepository {
  private storageKey: string;
  constructor(private storage: KeyValueStorageInfrastructure, node: string) {
    this.storageKey = `${KEY_PREFIX}.${node}`;
  }
  public async setState(state: CronState): Promise<void> {
    await this.storage.set(this.storageKey, JSON.stringify(state));
  }
  public async getState(): Promise<CronState> {
    const value = await this.storage.get(this.storageKey);
    if (!value) {
      return { entries: [] };
    }
    const json = JSON.parse(value);
    if (!isCronState(json)) {
      return { entries: [] };
    }
    return json;
  }
}
