import { OtherSourceType, VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const OTHER_CLASSIFICATION_TO_DATA_SOURCE_MAPS: Partial<FieldLabelToDataSource> =
  {
    email: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "email",
          [VaultSourceType.Email]: "email",
        },
      },
    ],
    password: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "password",
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
    username: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Passkey]: "userDisplayName",
          [VaultSourceType.Identity]: "pseudo",
        },
      },
    ],
  };
