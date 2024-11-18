import { firstValueFrom } from "rxjs";
import { SharingSyncFeatureFlips } from "@dashlane/sharing-contracts";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import {
  BasicConfig,
  PersistEncryptionServiceConfigFailure,
  PersistEncryptionServiceConfigRequest,
  PersistEncryptionServiceConfigResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { UnknownError } from "Libs/DashlaneApi";
import { CurrentUserInfo, getCurrentUserInfo } from "Session/utils";
import {
  AdminData,
  ESConfigsSpecialItem,
} from "Session/Store/teamAdminData/types";
import { ISharingServices, makeSharingService } from "Sharing/2/Services";
import { createOrUpdateSpecialItem } from "TeamAdmin/createOrUpdateSpecialItem";
import { getSpecialItemGroupKey } from "TeamAdmin/Services";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
import { requireAdmin } from "../requireAdmin";
import { Trigger } from "@dashlane/hermes";
const makeError = (): PersistEncryptionServiceConfigFailure => ({
  success: false,
  error: {
    code: UnknownError,
  },
});
const uuidRegex = /[\dA-F]{8}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{12}/i;
const ACCESS_KEY_LENGTH = 16;
const SECRET_KEY_LENGTH = 64;
const validateBasicConfig = ({
  teamUuid,
  encryptionKeyUuid,
  deviceAccessKey,
  deviceSecretKey,
}: BasicConfig): null | Partial<Record<keyof BasicConfig, true>> => {
  const errors: Partial<Record<keyof BasicConfig, boolean>> = {
    teamUuid: Boolean(teamUuid && !teamUuid.match(uuidRegex)),
    encryptionKeyUuid: Boolean(
      encryptionKeyUuid && !encryptionKeyUuid.match(uuidRegex)
    ),
    deviceAccessKey: Boolean(
      deviceAccessKey && deviceAccessKey.length !== ACCESS_KEY_LENGTH
    ),
    deviceSecretKey: Boolean(
      deviceSecretKey && deviceSecretKey.length !== SECRET_KEY_LENGTH
    ),
  };
  const hasErrorsObject: Partial<Record<keyof BasicConfig, true>> =
    Object.entries(errors).reduce((acc, [key, hasError]) => {
      if (hasError) {
        return { [key]: true, ...acc };
      } else {
        return acc;
      }
    }, {});
  return Object.keys(hasErrorsObject).length > 0 ? hasErrorsObject : null;
};
const updateEncryptionServiceConfig = async (
  services: CoreServices,
  sharingService: ISharingServices,
  currentUserInfo: CurrentUserInfo,
  adminData: AdminData,
  newData: BasicConfig,
  currentData: BasicConfig
): Promise<BasicConfig> => {
  const { storeService, sessionService, applicationModulesAccess } = services;
  const { crypto, item, ws } = sharingService;
  const { specialItemGroup } = adminData;
  if (!specialItemGroup) {
    throw new Error("Cannot find specialItemGroup in adminData");
  }
  const {
    specialItemGroup: { items: specialItemGroupItems },
    encryptionServiceData,
  } = adminData;
  const { itemId } = encryptionServiceData;
  let specialItemTimestamp;
  const { userFeatureFlip } =
    applicationModulesAccess.createClients().featureFlips.queries;
  const featureFlipResult = await firstValueFrom(
    userFeatureFlip({
      featureFlip: SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
    })
  );
  const sharingSyncInGrapheneEnabled = isSuccess(featureFlipResult)
    ? getSuccess(featureFlipResult)
    : false;
  if (sharingSyncInGrapheneEnabled) {
    const { getTeamAdminSharingData } =
      applicationModulesAccess.createClients().sharingSync.queries;
    const teamAdminDataResult = await firstValueFrom(getTeamAdminSharingData());
    if (isSuccess(teamAdminDataResult)) {
      const { specialItems } = getSuccess(teamAdminDataResult);
      if (specialItems && specialItems[itemId]) {
        const { timestamp } = specialItems[itemId];
        specialItemTimestamp = timestamp;
      }
    }
  } else {
    const sharingData = storeService.getSharingData();
    const { timestamp } = (sharingData.items ?? []).find(
      ({ itemId: storedItemId }) => storedItemId === itemId
    );
    specialItemTimestamp = timestamp;
  }
  if (!specialItemTimestamp) {
    throw new Error("trying to update config before it was created.");
  }
  const mergedData = { ...currentData, ...newData };
  const dataToPersist: Omit<ESConfigsSpecialItem, "itemId"> = {
    basicConfigs: [mergedData],
  };
  const specialItemGroupKey = await getSpecialItemGroupKey(
    crypto,
    currentUserInfo,
    adminData
  );
  const { itemKey } = specialItemGroupItems.find(
    ({ itemId: specialItemItemId }) => specialItemItemId === itemId
  );
  const rawItemKey = await crypto.symmetricEncryption.decryptAES256(
    specialItemGroupKey,
    itemKey
  );
  const encryptedContent = await crypto.symmetricEncryption.encryptAES256(
    rawItemKey,
    btoa(JSON.stringify(dataToPersist))
  );
  const updateItemEvent = await item.makeUpdateItemEvent(
    specialItemTimestamp,
    itemKey,
    {
      itemId,
      itemContent: encryptedContent,
    }
  );
  const updateItemResponse = await item.updateItem(
    ws,
    currentUserInfo.login,
    currentUserInfo.uki,
    updateItemEvent
  );
  if (!updateItemResponse.items.length) {
    throw new Error("unable to update encryption service special item");
  }
  await sessionService.getInstance().user.attemptSync(Trigger.SettingsChange);
  return mergedData;
};
const createEncryptionServiceConfig = async (
  services: CoreServices,
  sharingService: ISharingServices,
  newData: BasicConfig
): Promise<BasicConfig> => {
  const dataToPersist: Omit<ESConfigsSpecialItem, "itemId"> = {
    basicConfigs: [newData],
  };
  const persisted = await createOrUpdateSpecialItem(
    services,
    sharingService,
    dataToPersist
  );
  return persisted.basicConfigs[0];
};
export const saveOrUpdateEncryptionServiceConfig = async (
  services: CoreServices,
  newData: BasicConfig
): Promise<BasicConfig | null> => {
  const errors = validateBasicConfig(newData);
  if (errors) {
    return null;
  }
  const { storeService, wsService } = services;
  const sharingService = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  const currentTeamId = currentTeamIdSelector(storeService.getState());
  const adminData = adminDataForTeamSelector(
    storeService.getState(),
    currentTeamId
  );
  if (!adminData) {
    throw new Error("Cannot find adminData");
  }
  const currentData = adminData?.encryptionServiceData?.basicConfigs?.[0];
  if (currentData) {
    return await updateEncryptionServiceConfig(
      services,
      sharingService,
      currentUserInfo,
      adminData,
      newData,
      currentData
    );
  } else {
    return await createEncryptionServiceConfig(
      services,
      sharingService,
      newData
    );
  }
};
export const persistEncryptionServiceConfig = async (
  services: CoreServices,
  configInputData: PersistEncryptionServiceConfigRequest
): Promise<PersistEncryptionServiceConfigResult> => {
  requireAdmin(services.storeService);
  const persistedData = await saveOrUpdateEncryptionServiceConfig(
    services,
    configInputData
  );
  if (!persistedData) {
    return makeError();
  }
  return {
    success: true,
    data: persistedData,
  };
};
