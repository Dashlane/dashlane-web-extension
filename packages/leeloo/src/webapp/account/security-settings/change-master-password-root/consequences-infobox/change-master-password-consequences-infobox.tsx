import { Infobox, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import {
  ChangeMpConsequence,
  useChangeMpConsequences,
} from "./use-change-mp-consequences";
export const I18N_CHANGE_MP_CONSEQUENCES_TITLE =
  "webapp_account_security_settings_changemp_will";
export const I18N_CHANGE_MP_CONSEQUENCES: Record<ChangeMpConsequence, string> =
  {
    [ChangeMpConsequence.LogOut]:
      "webapp_account_security_settings_changemp_will_log_out_other_devices",
    [ChangeMpConsequence.DisableArk]:
      "webapp_account_security_settings_changemp_will_disable_ark",
    [ChangeMpConsequence.DisablePin]:
      "webapp_account_security_settings_changemp_will_disable_pin",
  };
export const ChangeMasterPasswordConsequencesInfobox = () => {
  const { translate } = useTranslate();
  const consequences = useChangeMpConsequences();
  if (!consequences.loaded) {
    return null;
  }
  return (
    <Infobox
      mood="brand"
      size="medium"
      title={translate(I18N_CHANGE_MP_CONSEQUENCES_TITLE)}
      description={
        <Paragraph
          as="ul"
          sx={{
            listStyleType:
              consequences.consequences.length > 1 ? "disc" : undefined,
            listStylePosition: "outside",
          }}
        >
          {consequences.consequences.map((c) => {
            const text = translate(I18N_CHANGE_MP_CONSEQUENCES[c]);
            return <li key={c}>{text}</li>;
          })}
        </Paragraph>
      }
    />
  );
};
