import { DeviceInfo } from "@dashlane/communication";
import { isSuccess } from "@dashlane/framework-types";
import { firstValueFrom } from "rxjs";
import { UserDeviceService } from "./types";
import { SessionServices } from "./SessionService";
import { DeviceManagementClient } from "@dashlane/device-contracts";
export const makeUserDeviceService = ({
  deviceManagementClient,
}: Pick<SessionServices, "deviceManagementClient">): UserDeviceService => {
  return {
    fetchDevicesList: () => fetchDevicesList(deviceManagementClient),
    deactivateDevice: (deviceId: string) =>
      deactivateDevice(deviceManagementClient, deviceId),
    changeDeviceName: (accessKey: string, updatedDeviceName: string) =>
      changeDeviceName(deviceManagementClient, accessKey, updatedDeviceName),
  };
};
const fetchDevicesList = async (
  deviceManagement: DeviceManagementClient
): Promise<DeviceInfo[]> => {
  const deviceList = await firstValueFrom(
    deviceManagement.queries.listAuthorisedDevice()
  );
  if (isSuccess(deviceList)) {
    return deviceList.data;
  }
  return deviceList.error;
};
const deactivateDevice = async (
  deviceManagement: DeviceManagementClient,
  deviceId: string
): Promise<void> => {
  await deviceManagement.commands.revokeAuthorisedDevice({
    deviceId,
  });
};
const changeDeviceName = async (
  deviceManagement: DeviceManagementClient,
  deviceId: string,
  updatedName: string
): Promise<void> => {
  await deviceManagement.commands.renameAuthorisedDevice({
    deviceId,
    updatedName,
  });
};
