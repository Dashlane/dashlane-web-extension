import useTranslate from "../../../../libs/i18n/useTranslate";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD:
    "team_settings_force_crypto_payload_label",
  TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_HELPER:
    "team_settings_force_crypto_payload_helper",
  TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_DISABLED:
    "team_settings_force_crypto_payload_option_disabled",
  TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_ARGON:
    "team_settings_force_crypto_payload_option_argon2",
  TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_ADVANCED:
    "team_settings_force_crypto_payload_option_pbkdf2_advanced",
  TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_STANDARD:
    "team_settings_force_crypto_payload_option_pbkdf2_standard",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_GENERIC_ERROR:
    "team_settings_force_crypto_payload_save_error_msg_generic_error",
};
interface ForceCryptoSettingProps extends SettingFieldProps {
  isTeamDiscontinuedAfterTrial: boolean;
}
export const ForceCryptoSetting = (props: ForceCryptoSettingProps) => {
  const { translate } = useTranslate();
  const { isTeamDiscontinuedAfterTrial, policies } = props;
  if (!policies) {
    return null;
  }
  const forceCryptoSettingRow: SettingRowModel = {
    type: "select",
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD),
    isReadOnly: isTeamDiscontinuedAfterTrial,
    helperLabel: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_HELPER
    ),
    value: policies.cryptoForcedPayload,
    feature: "cryptoForcedPayload",
    options: [
      {
        label: translate(
          I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_DISABLED
        ),
        value: "disabled",
      },
      {
        label: translate(
          I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_ARGON
        ),
        value: "$1$argon2d$16$3$32768$2$aes256$cbchmac$16$",
      },
      {
        label: translate(
          I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_ADVANCED
        ),
        value: "$1$pbkdf2$16$200000$sha256$aes256$cbchmac$16$",
      },
      {
        label: translate(
          I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_STANDARD
        ),
        value: "KWC3",
        disabled: true,
      },
    ],
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_FORCE_CRYPTO_PAYLOAD_GENERIC_ERROR
          );
      }
    },
  };
  return <PolicySettingRow settingRow={forceCryptoSettingRow} {...props} />;
};
