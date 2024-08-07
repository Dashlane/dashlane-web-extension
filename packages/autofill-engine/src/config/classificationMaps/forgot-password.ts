import { VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const FORGOT_PASSWORD_CLASSIFICATION_TO_DATA_SOURCE_MAPS: Partial<FieldLabelToDataSource> =
  {
    otp: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "otpSecret",
        },
      },
    ],
  };
