import { BaseDataModelObject, DataModelObject } from "@dashlane/communication";
export type UniqueIdentifierKeyObject<
  T extends DataModelObject | BaseDataModelObject
> = Record<
  | keyof Omit<T, keyof DataModelObject>
  | keyof Pick<DataModelObject, "Attachments">,
  boolean
>;
