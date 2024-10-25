import { isNil } from "ramda";
import { Country, DataModelObject } from "@dashlane/communication";
import { PERSONAL_SPACE_ID } from "DataManagement/Spaces/constants";
export default function addCommonPropertiesDefaultValues(
  dataModelObject: DataModelObject
): DataModelObject {
  const LocaleFormat = isNil(dataModelObject.LocaleFormat)
    ? Country.UNIVERSAL
    : dataModelObject.LocaleFormat;
  const SpaceId = isNil(dataModelObject.SpaceId)
    ? PERSONAL_SPACE_ID
    : dataModelObject.SpaceId;
  return {
    ...dataModelObject,
    LocaleFormat,
    SpaceId,
  };
}
