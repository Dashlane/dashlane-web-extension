import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useIsB2CUserFrozen } from "../../../libs/frozen-state/hooks/use-is-b2c-user-frozen";
const I18N_KEYS = {
  COPY_CONTENT: "webapp_secrets_quick_action_copy_content",
  CONTENT_CONFIRMATION: "webapp_secrets_quick_action_copy_content_confirmation",
  COPY_ID: "webapp_secrets_quick_action_copy_id",
  ID_CONFIRMATION: "webapp_secrets_quick_action_copy_id_confirmation",
  SHARE: "webapp_secrets_quick_action_share",
  SEE_DETAILS: "webapp_secrets_quick_action_see_details",
};
interface Props {
  onEdit: (event: Event) => void;
  onCopy: (field: "id" | "secret", label: string) => void;
  onShare: () => void;
  hasShareAction?: boolean;
}
export const SecretQuickActions = ({
  onEdit,
  onCopy,
  onShare,
  hasShareAction,
}: Props) => {
  const { translate } = useTranslate();
  const isUserFrozen = useIsB2CUserFrozen();
  const copyId = () => onCopy("id", translate(I18N_KEYS.ID_CONFIRMATION));
  const copyContent = () =>
    onCopy("secret", translate(I18N_KEYS.CONTENT_CONFIRMATION));
  if (isUserFrozen === null) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownTriggerButton
        aria-label="More"
        icon="ActionMoreOutlined"
        layout="iconOnly"
        intensity="supershy"
      />
      <DropdownContent>
        {!isUserFrozen ? (
          <>
            <DropdownItem
              label={translate(I18N_KEYS.COPY_CONTENT)}
              leadingIcon="ActionCopyOutlined"
              onSelect={copyContent}
            />
            <DropdownItem
              label={translate(I18N_KEYS.COPY_ID)}
              leadingIcon="ActionCopyOutlined"
              onSelect={copyId}
            />
          </>
        ) : null}
        {hasShareAction ? (
          <DropdownItem
            label={translate(I18N_KEYS.SHARE)}
            leadingIcon="ActionShareOutlined"
            onSelect={onShare}
          />
        ) : null}
        <DropdownItem
          label={translate(I18N_KEYS.SEE_DETAILS)}
          leadingIcon="ActionEditOutlined"
          onSelect={onEdit}
        />
      </DropdownContent>
    </DropdownMenu>
  );
};
