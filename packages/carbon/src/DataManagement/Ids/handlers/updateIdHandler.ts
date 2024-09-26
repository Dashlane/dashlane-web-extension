import { Trigger } from "@dashlane/hermes";
import {
  DataModelType,
  EditableBaseIdDataModel,
  IdDataModel,
  IdErrorCode,
  IdUpdateModel,
  UpdateIdRequest,
  UpdateIdResult,
  UpdateIdResultErrorCode,
} from "@dashlane/communication";
import { State } from "Store";
import { getDebounceSync } from "DataManagement/utils";
import { CoreServices } from "Services";
import { savePersonalDataItem } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { viewCountryToVaultCountry } from "DataManagement/Ids/helpers";
import { logEditVaultItem } from "DataManagement/PersonalData/logs";
export const updateIdHandler = <
  DataModel extends IdDataModel,
  UpdateModel extends IdUpdateModel
>(
  { sessionService, storeService, eventLoggerService }: CoreServices,
  data: UpdateIdRequest<UpdateModel>,
  customHandler: (
    data: UpdateIdRequest<UpdateModel>,
    existingId: DataModel
  ) => Partial<Omit<DataModel, keyof EditableBaseIdDataModel>>,
  selector: (state: State, id: string) => DataModel
): Promise<UpdateIdResult> => {
  if (data.idNumber === "") {
    return Promise.resolve({
      success: false,
      error: {
        code: UpdateIdResultErrorCode.MISSING_ID_NUMBER,
      },
    });
  }
  const getBase = (
    { country, spaceId }: UpdateIdRequest<UpdateModel>,
    existingId: DataModel
  ): EditableBaseIdDataModel => ({
    SpaceId: spaceId ?? existingId.SpaceId,
    LocaleFormat:
      country === undefined
        ? existingId.LocaleFormat
        : viewCountryToVaultCountry(country),
  });
  const getNew = (
    idData: UpdateIdRequest<UpdateModel>,
    existingId: DataModel
  ): EditableBaseIdDataModel &
    Partial<Omit<DataModel, keyof EditableBaseIdDataModel>> => ({
    ...getBase(idData, existingId),
    ...customHandler(idData, existingId),
  });
  try {
    if (!storeService.isAuthenticated()) {
      return Promise.resolve({
        success: false,
        error: {
          code: IdErrorCode.NOT_AUTHENTICATED,
        },
      });
    }
    const state = storeService.getState();
    const sanitizedNewIdData = sanitizeInputPersonalData(data);
    const existingId = selector(state, data.id);
    if (!existingId) {
      return Promise.resolve({
        success: false,
        error: {
          code: IdErrorCode.NOT_FOUND,
        },
      });
    }
    const idToSave = {
      ...existingId,
      ...getNew(sanitizedNewIdData, existingId),
      UserModificationDatetime: getUnixTimestamp(),
    };
    const kwType: DataModelType = idToSave.kwType;
    storeService.dispatch(savePersonalDataItem(idToSave, kwType));
    sessionService.getInstance().user.persistPersonalData();
    const debounceSync = getDebounceSync(storeService, sessionService);
    debounceSync({ immediateCall: true }, Trigger.Save);
    const storedItem = selector(state, data.id);
    logEditVaultItem(storeService, eventLoggerService, idToSave, storedItem);
    return Promise.resolve({
      success: true,
    });
  } catch (error) {
    const message = `[IDs] - updateIdHandler: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    logError(augmentedError);
    return Promise.resolve({
      success: false,
      error: {
        code: IdErrorCode.INTERNAL_ERROR,
      },
    });
  }
};
