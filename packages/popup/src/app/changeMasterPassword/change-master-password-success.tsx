import * as React from "react";
import { CheckCircleIcon, colors } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import { Progress } from "./progress-wrapper";
interface Props {
  onDone: () => void;
}
const I18N_KEYS = {
  DESCRIPTION: "master_password_progress/success_desc",
  BUTTON_DONE: "master_password_progress/success_button_done",
};
export const ChangeMasterPasswordSuccess = ({ onDone }: Props) => {
  const { translate } = useTranslate();
  return (
    <Progress
      description={translate(I18N_KEYS.DESCRIPTION)}
      icon={<CheckCircleIcon color={colors.midGreen04} size={64} />}
      actionButtonText={translate(I18N_KEYS.BUTTON_DONE)}
      handleAction={onDone}
    />
  );
};
