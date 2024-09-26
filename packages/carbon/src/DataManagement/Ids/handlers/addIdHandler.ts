import { Trigger } from "@dashlane/hermes";
import {
  AddIdRequest,
  AddIdResult,
  AddIdResultErrorCode,
  BaseIdDataModel,
  IdDataModel,
  IdErrorCode,
  IdUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { getDebounceSync, getDefaultSpaceId } from "DataManagement/utils";
import { savePersonalDataItem } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { generateItemUuid } from "Utils/generateItemUuid";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { viewCountryToVaultCountry } from "DataManagement/Ids/helpers";
import { logAddVaultItem } from "DataManagement/PersonalData/logs";
export const addIdHandler = async <
  DataModel extends IdDataModel,
  UpdateModel extends IdUpdateModel
>(
  { sessionService, storeService, eventLoggerService }: CoreServices,
  data: AddIdRequest<UpdateModel>,
  customHandler: (
    data: AddIdRequest<UpdateModel>
  ) => Omit<DataModel, keyof BaseIdDataModel>
): Promise<AddIdResult> => {
  if (data.idNumber === "") {
    return Promise.resolve({
      success: false,
      error: {
        code: AddIdResultErrorCode.MISSING_ID_NUMBER,
      },
    });
  }
  const getBase = ({
    country,
    spaceId,
  }: AddIdRequest<UpdateModel>): BaseIdDataModel => {
    const creationDate = getUnixTimestamp();
    return {
      CreationDatetime: creationDate,
      Id: generateItemUuid(),
      LastBackupTime: 0,
      LocaleFormat: viewCountryToVaultCountry(country),
      SpaceId: spaceId,
      UserModificationDatetime: creationDate,
    };
  };
  const getNew = (
    idData: AddIdRequest<UpdateModel>
  ): BaseIdDataModel & Omit<DataModel, keyof BaseIdDataModel> => ({
    ...getBase(idData),
    ...customHandler(idData),
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
    const sanitizedData = sanitizeInputPersonalData(data);
    const idToSave = getNew(sanitizedData);
    if (!idToSave.SpaceId) {
      const defaultSpaceId = await getDefaultSpaceId(storeService);
      idToSave.SpaceId = defaultSpaceId;
    }
    storeService.dispatch(savePersonalDataItem(idToSave, idToSave.kwType));
    sessionService.getInstance().user.persistPersonalData();
    const debounceSync = getDebounceSync(storeService, sessionService);
    debounceSync({ immediateCall: true }, Trigger.Save);
    logAddVaultItem(storeService, eventLoggerService, idToSave);
    return Promise.resolve({
      success: true,
      id: idToSave.Id,
    });
  } catch (error) {
    const message = `[IDs] - addIdHandler: ${error}`;
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
