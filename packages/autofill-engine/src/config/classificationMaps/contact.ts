import { VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const CONTACT_CLASSIFICATION_TO_DATA_SOURCE_MAPS: Partial<FieldLabelToDataSource> =
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
  };
