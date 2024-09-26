import { OtherSourceType, VaultSourceType } from "@dashlane/autofill-contracts";
export type VaultDataSource = {
  type: VaultSourceType;
  vaultId: string;
};
export type WebauthnConditionalUIDataSource = {
  type: OtherSourceType.WebauthnConditionalUI;
  vaultId: string;
};
export type NewPasswordDataSource = {
  type: OtherSourceType.NewPassword;
  value: string;
};
export type OtherDataSource =
  | NewPasswordDataSource
  | WebauthnConditionalUIDataSource;
export type AutofillDataSource = VaultDataSource | OtherDataSource;
