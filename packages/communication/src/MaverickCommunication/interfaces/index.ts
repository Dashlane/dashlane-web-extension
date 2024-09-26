import { DataModelType } from "../../DataModel/Interfaces/Common";
export interface DomainInfo {
  url: string;
  fullDomain: string;
  rootDomain: string;
  rootDomainName: string;
}
export interface FilledDataItem {
  id: string;
  url: string;
  dataType: DataModelType;
}
