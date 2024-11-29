import { useRef } from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SecureNoteContentField } from "../edit/content-field/content-field";
const I18N_KEYS = {
  DISABLE_LABEL: "webapp_secure_notes_edition_disabled_label",
  PLACEHOLDER_NO_CONTENT:
    "webapp_secure_notes_addition_field_placeholder_no_content",
  ALERT_COPY_PAST_ERROR: "webapp_secure_notes_addition_field_copy_past_error",
};
interface Props {
  content: string;
  isSecured: boolean;
  setContent: (content: string) => void;
  title?: string;
  limitedPermissions?: boolean;
  readonly?: boolean;
  isEditing?: boolean;
  spaceId: string;
}
export const SecureNoteContent = ({
  title,
  content,
  isSecured,
  setContent,
  limitedPermissions,
  readonly,
  isEditing,
  spaceId,
}: Props) => {
  const { translate } = useTranslate();
  const field = useRef<HTMLTextAreaElement | null>(null);
  return (
    <SecureNoteContentField
      title={title}
      fieldRef={field}
      placeholder={translate(
        readonly ? I18N_KEYS.DISABLE_LABEL : I18N_KEYS.PLACEHOLDER_NO_CONTENT
      )}
      isSecured={isSecured}
      value={content}
      readonly={readonly || limitedPermissions}
      setContent={setContent}
      isEditing={isEditing}
      spaceId={spaceId}
    />
  );
};
