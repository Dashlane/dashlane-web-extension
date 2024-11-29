import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { deviceManagementApi } from "@dashlane/device-contracts";
import { getMobileDevices } from "../../services";
export const useUserHasMobileDevice = () => {
  const { status, data } = useModuleQuery(
    deviceManagementApi,
    "listAuthorisedDevice"
  );
  if (status !== DataStatus.Success) {
    return { status };
  }
  const mobileDevices = getMobileDevices(data);
  const userHasMobileDevice = !!mobileDevices.length;
  return { status, userHasMobileDevice };
};
