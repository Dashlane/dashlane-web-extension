import { DataModelObject } from "@dashlane/communication";
export const lastUseMapper = (item: DataModelObject): number => {
  return item.LastUse || -1;
};
