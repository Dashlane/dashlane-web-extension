import * as React from "react";
import { TextInput } from "@dashlane/ui-components";
interface Props {
  recoveryPhone: string | undefined;
}
export const BackupPhoneSection = ({ recoveryPhone }: Props) => {
  return (
    <TextInput
      sx={{ marginTop: "15px" }}
      value={recoveryPhone}
      disabled={true}
    />
  );
};
