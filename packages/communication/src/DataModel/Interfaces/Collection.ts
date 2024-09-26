import * as Common from "./Common";
export interface CollectionVaultItem {
  Id: string;
  Type: string;
}
export interface Collection extends Common.DataModelObject {
  Name: string;
  VaultItems: CollectionVaultItem[];
}
export function isCollection(o: Common.BaseDataModelObject): o is Collection {
  return Boolean(o) && o.kwType === "KWCollection";
}
