import { ChangeEvent } from "react";
import ReactInputMask from "react-input-mask";
import { TextField } from "@dashlane/design-system";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
import { RECOVERY_KEY_INPUT_MASK } from "../../../../../constants";
const I18N_KEYS = {
  ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_LABEL:
    "webapp_enforce_account_recovery_key_confirm_label",
};
const overrideDefaultCopy = (stringToCopy: string) => {
  navigator.clipboard.writeText(stringToCopy.replaceAll(" ", ""));
};
interface Props {
  value: string;
  error?: string;
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | string
  ) => void;
}
interface MaskManagedProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const ArkEnforcementInput = ({ value, error, onChange }: Props) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        marginBottom: "64px",
      }}
    >
      <ReactInputMask
        maskChar=""
        mask={RECOVERY_KEY_INPUT_MASK}
        onCopy={() => overrideDefaultCopy(value)}
        onCut={() => overrideDefaultCopy(value)}
        onChange={onChange}
        value={value}
      >
        {(otherInputProps: MaskManagedProps) => (
          <TextField
            data-testid="ark-enforcement-confirm-key-input"
            type="text"
            labelPersists={true}
            label={translate(
              I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_LABEL
            )}
            feedback={error ? error : undefined}
            error={!!error}
            sx={{
              fontWeight: 600,
            }}
            {...otherInputProps}
          />
        )}
      </ReactInputMask>
    </div>
  );
};
