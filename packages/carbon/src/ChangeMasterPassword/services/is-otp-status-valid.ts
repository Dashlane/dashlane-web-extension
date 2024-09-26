import { GetDataForMasterPasswordOtpStatus } from "Libs/DashlaneApi";
export const isOtpStatusValid = (
  status: GetDataForMasterPasswordOtpStatus,
  serverKey: string
): boolean => {
  switch (status) {
    case "login":
      return serverKey && serverKey.length > 0;
    case "disabled":
    case "newDevice":
      return !serverKey || serverKey.length === 0;
    default:
      return false;
  }
};
