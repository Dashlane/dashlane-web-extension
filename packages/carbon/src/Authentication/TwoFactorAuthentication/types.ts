import { Transaction } from "Libs/Backup/Transactions/types";
import { SharingKeys } from "Libs/DashlaneApi";
export interface TwoFactorAuthenticationDataToMigrate {
  transactions: Transaction[];
  sharingKeys: SharingKeys;
  timestamp: number;
  serverKey: string;
}
