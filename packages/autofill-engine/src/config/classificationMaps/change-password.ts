import { OtherSourceType, VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const CHANGE_PASSWORD_CLASSIFICATION_TO_DATA_SOURCE_MAPS: Partial<FieldLabelToDataSource> =
  {
    password: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "password",
        },
      },
      {
        extraValues: ["new"],
        source: {
          [OtherSourceType.NewPassword]: OtherSourceType.NewPassword,
        },
      },
      {
        extraValues: ["confirmation"],
        source: {
          [OtherSourceType.NewPassword]: OtherSourceType.NewPassword,
        },
      },
    ],
    otp: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "otpSecret",
        },
      },
    ],
  };
