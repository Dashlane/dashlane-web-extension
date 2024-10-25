import {
  BasicConfig,
  RegisterTeamDeviceAccountRequest,
  RegisterTeamDeviceAccountResult,
  TeamDevicePlatform,
} from "@dashlane/communication";
import { createTeamDeviceAccountErrors } from "Libs/DashlaneApi/services/teams/device/common-types";
import { DeviceNotFound, getCode } from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { makeSharingService } from "Sharing/2/Services";
import { generateProposeSignature } from "Sharing/2/Services/utils";
import { getCurrentUserInfo } from "Session/utils";
import { getSpecialUserGroupKey } from "TeamAdmin/Services";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
import { registerTeamDevice } from "TeamAdmin/Services/Device/registerTeamDevice";
import { deactivateTeamDevice } from "TeamAdmin/Services/Device/deactivateTeamDevice";
import { createTeamDeviceAccount } from "TeamAdmin/Services/Device/createTeamDeviceAccount";
import { loadSpecialUserGroup } from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
import {
  ENCRYPTION_SERVICE_HUMAN_DEVICE_NAME,
  PRIVATE_KEY_FOOTER,
  PRIVATE_KEY_HEADER,
  PUBLIC_KEY_FOOTER,
  PUBLIC_KEY_HEADER,
} from "../constants";
const generateTeamDeviceUserLogin = (teamId: string | number) => {
  const nonce = Math.floor(Math.random() * 0x100000000).toString(16);
  return `special-admin-${teamId}-${nonce}@teamdevice.dashlane.com`;
};
export const generateDeviceKeyPair = async (
  services: CoreServices,
): Promise<{
  devicePublicKey: string;
  devicePrivateKey: string;
}> => {
  const { storeService, wsService } = services;
  const { crypto } = makeSharingService(storeService, wsService);
  const keyPair = await crypto.asymmetricEncryption.generateRsaKeyPair();
  const devicePrivateKey = keyPair.privateKey
    .replace(PRIVATE_KEY_HEADER, "")
    .replace(PRIVATE_KEY_FOOTER, "")
    .replace(/[\r\n ]/gm, "");
  const devicePublicKey = keyPair.publicKey
    .replace(PUBLIC_KEY_HEADER, "")
    .replace(PUBLIC_KEY_FOOTER, "")
    .replace(/[\r\n ]/gm, "");
  return {
    devicePrivateKey,
    devicePublicKey,
  };
};
export const reregisterTeamDevice = async (
  services: CoreServices,
  existingConfig?: BasicConfig,
  platform: TeamDevicePlatform = TeamDevicePlatform.ENCRYPTION_SERVICE,
) => {
  if (existingConfig?.deviceAccessKey) {
    await deactivateTeamDevice(services, {
      teamDeviceAccessKey: existingConfig.deviceAccessKey,
    });
  }
  const deviceResult = await registerTeamDevice(services, {
    platform,
    deviceName: ENCRYPTION_SERVICE_HUMAN_DEVICE_NAME,
  });
  if (deviceResult.success) {
    return deviceResult.data;
  }
  throw new Error(DeviceNotFound);
};
export const registerTeamDeviceAccount = async (
  services: CoreServices,
  request: RegisterTeamDeviceAccountRequest,
): Promise<RegisterTeamDeviceAccountResult> => {
  let devicePublicKey: string;
  let devicePrivateKey: string;
  if (!request.shouldGenerateDeviceKeyPair) {
    devicePublicKey = request.devicePublicKey;
    devicePrivateKey = request.devicePrivateKey;
  } else {
    ({ devicePublicKey, devicePrivateKey } =
      await generateDeviceKeyPair(services));
  }
  const { storeService, wsService } = services;
  const { crypto } = makeSharingService(storeService, wsService);
  const currentUserInfo = getCurrentUserInfo(storeService);
  const currentTeamId = currentTeamIdSelector(storeService.getState());
  const adminData = adminDataForTeamSelector(
    storeService.getState(),
    currentTeamId,
  );
  const { revision: userGroupRevision } = await loadSpecialUserGroup(
    wsService,
    currentUserInfo.login,
    currentUserInfo.uki,
    adminData,
  );
  const specialUserGroupKey = await getSpecialUserGroupKey(
    crypto,
    currentUserInfo,
    adminData,
  );
  const pemPublicKey = `${PUBLIC_KEY_HEADER}\n${devicePublicKey}\n${PUBLIC_KEY_FOOTER}`;
  const groupKey = await crypto.asymmetricEncryption.encrypt(
    pemPublicKey,
    specialUserGroupKey,
  );
  const teamDeviceLogin = generateTeamDeviceUserLogin(currentTeamId);
  const proposeSignature = await generateProposeSignature(
    crypto,
    specialUserGroupKey,
    teamDeviceLogin,
  );
  const teamDeviceAccountResponse = await createTeamDeviceAccount(services, {
    teamDeviceAccessKey: request.deviceAccessKey,
    publicKey: devicePublicKey,
    proposeSignature,
    userGroupRevision,
    groupKey,
    teamDeviceLogin,
  });
  if (teamDeviceAccountResponse.success === false) {
    return {
      success: false,
      error: {
        code: getCode(
          teamDeviceAccountResponse.error.code,
          createTeamDeviceAccountErrors,
        ),
      },
    };
  }
  return {
    success: true,
    data: {
      login: teamDeviceAccountResponse.data.login,
      devicePrivateKey: devicePrivateKey,
      devicePublicKey: devicePublicKey,
    },
  };
};
