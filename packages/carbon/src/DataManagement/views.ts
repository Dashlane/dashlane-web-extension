import {
  BaseDataModelDetailView,
  BaseDataModelItemView,
  BaseDataModelObject,
  DataModelDetailView,
  DataModelItemView,
  DataModelObject,
} from "@dashlane/communication";
const baseDataModelItemView = (
  item: BaseDataModelObject
): BaseDataModelItemView => ({
  id: item.Id,
});
export const dataModelItemView = (
  item: DataModelObject
): DataModelItemView => ({
  ...baseDataModelItemView(item),
  hasAttachments:
    Array.isArray(item.Attachments) && item.Attachments.length > 0,
  kwType: item.kwType,
  lastUse: item.LastUse,
  localeFormat: item.LocaleFormat,
  spaceId: item.SpaceId,
});
const baseDataModelDetailView = (
  item: BaseDataModelObject
): BaseDataModelDetailView => ({
  id: item.Id,
});
export const dataModelDetailView = (
  item: DataModelObject
): DataModelDetailView => ({
  ...baseDataModelDetailView(item),
  attachments: item.Attachments || [],
  kwType: item.kwType,
  lastUse: item.LastUse,
  localeFormat: item.LocaleFormat,
  spaceId: item.SpaceId,
});
export const maybeDataModelDetailView =
  <T, V>(toView: (item: T) => V) =>
  (value: T | undefined) =>
    value ? toView(value) : undefined;
