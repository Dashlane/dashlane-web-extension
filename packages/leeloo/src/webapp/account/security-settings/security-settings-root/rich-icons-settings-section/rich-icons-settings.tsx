import {
  Heading,
  LinkButton,
  Paragraph,
  Toggle,
} from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useProtectedItemsUnlocker } from "../../../../unlock-items";
import { LockedItemType } from "../../../../unlock-items/types";
import { carbonConnector } from "../../../../../libs/carbon/connector";
import { useAreRichIconsEnabled } from "../../../../../libs/hooks/use-are-rich-icons-enabled";
interface Props {
  checked: boolean;
}
const I18N_KEYS = {
  TITLE: "webapp_account_security_settings_rich_icons_title",
  DESCRIPTION: "webapp_account_security_settings_rich_icons_description",
  DISABLED_DESCRIPTION:
    "webapp_account_security_settings_tac_disabled_description",
  LINK_TITLE: "webapp_account_security_settings_rich_icons_link_title",
  ARIA_LABEL: "webapp_lock_items_rich_icons_aria_label",
};
const I18N_KEYS_SETTINGS_ON = {
  dialogKeys: {
    title: "webapp_lock_items_rich_icons_title_on",
    subtitle: "webapp_lock_items_rich_icons_subtitle_on",
    confirm: "webapp_lock_items_rich_icons_confirm_on",
  },
};
const I18N_KEYS_SETTINGS_OFF = {
  dialogKeys: {
    title: "webapp_lock_items_rich_icons_title_off",
    subtitle: "webapp_lock_items_rich_icons_subtitle_off",
    confirm: "webapp_lock_items_rich_icons_confirm_off",
  },
};
export const RichIconsSettings = ({ checked }: Props) => {
  const { translate } = useTranslate();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const areRichIconsEnabled = useAreRichIconsEnabled();
  const successCallback = (newCheckValue: boolean) => {
    return carbonConnector.updateRichIconsSetting(newCheckValue);
  };
  const handleToggleChange = () => {
    const i18Keys = checked ? I18N_KEYS_SETTINGS_OFF : I18N_KEYS_SETTINGS_ON;
    if (!areProtectedItemsUnlocked) {
      openProtectedItemsUnlocker({
        itemType: LockedItemType.SecuritySettings,
        options: {
          fieldsKeys: i18Keys.dialogKeys,
          translated: false,
        },
        successCallback: () => successCallback(!checked),
      });
    } else {
      successCallback(!checked);
    }
  };
  return (
    <>
      <hr
        sx={{
          border: "none",
          borderTop: "1px solid transparent",
          margin: 0,
          width: "100%",
          borderColor: "ds.border.neutral.quiet.idle",
        }}
      />
      <div
        sx={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Heading
            as="h2"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.TITLE)}
          </Heading>
          <Toggle
            aria-label={I18N_KEYS.ARIA_LABEL}
            checked={checked}
            onChange={handleToggleChange}
            disabled={!areRichIconsEnabled}
          />
        </div>
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
        >
          {translate(
            !areRichIconsEnabled
              ? I18N_KEYS.DISABLED_DESCRIPTION
              : I18N_KEYS.DESCRIPTION
          )}
        </Paragraph>
        <LinkButton href="__REDACTED__">
          {translate(I18N_KEYS.LINK_TITLE)}
        </LinkButton>
      </div>
    </>
  );
};
