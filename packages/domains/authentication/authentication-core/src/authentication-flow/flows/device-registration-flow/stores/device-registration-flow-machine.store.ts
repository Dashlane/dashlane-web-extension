import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore } from "@dashlane/framework-application";
interface RegistrationPayload {
  deviceAccessKey: string;
  deviceSecretKey: string;
  settings: {
    backupDate: number;
    identifier: string;
    time: number;
    content: string;
    type: "SETTINGS";
    action: "BACKUP_EDIT";
  };
  sharingKeys?: {
    privateKey: string;
    publicKey: string;
  };
  remoteKeys?: {
    uuid: string;
    key: string;
    type: "sso" | "master_password";
  }[];
  numberOfDevices: number;
  hasDesktopDevices: boolean;
  publicUserId: string;
  userAnalyticsId: string;
  deviceAnalyticsId: string;
  ssoServerKey?: string;
  serverKey?: string;
}
const isRegistrationStore = (x: unknown): x is RegistrationPayload => {
  return true;
};
export class DeviceRegistrationFlowMachineStore extends defineStore<
  RegistrationPayload | undefined,
  RegistrationPayload | undefined
>({
  initialValue: undefined,
  persist: false,
  scope: UseCaseScope.Device,
  storeName: "device-registration-flow-store",
  storeTypeGuard: isRegistrationStore,
}) {}
