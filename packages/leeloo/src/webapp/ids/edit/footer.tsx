import { Button, DSCSSObject, Flex } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
export const ID_EDIT_FOOTER_I18N_KEYS = {
  CANCEL: "webapp_panel_edition_generic_cancel_changes",
  CLOSE: "webapp_panel_edition_generic_close",
  DELETE: "webapp_panel_edition_generic_delete",
  SAVE: "webapp_panel_edition_generic_save_changes",
};
export interface Props {
  formId: string;
  handleCancel: () => void;
  handleDelete: () => void;
  hasDataBeenModified: boolean;
  isSubmitting: boolean;
  focusAttachmentTab?: () => void;
}
const FOOTER_STYLE: DSCSSObject = {
  backgroundColor: "ds.container.agnostic.neutral.supershy",
  borderTopWidth: "1px",
  borderTopStyle: "solid",
  borderTopColor: "ds.border.neutral.quiet.idle",
  padding: "16px 24px",
  gap: "8px",
};
export const IdDocumentEditFooter = ({
  formId,
  handleCancel,
  handleDelete,
  hasDataBeenModified,
  isSubmitting,
  focusAttachmentTab,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <Flex
      className="actions"
      sx={FOOTER_STYLE}
      as="footer"
      justifyContent="flex-start"
      flexWrap="nowrap"
    >
      <Button
        aria-label={translate(ID_EDIT_FOOTER_I18N_KEYS.DELETE)}
        onClick={handleDelete}
        mood="danger"
        intensity="supershy"
        layout="iconOnly"
        icon="ActionDeleteOutlined"
        disabled={isSubmitting}
      />
      {!!focusAttachmentTab && (
        <Button
          key="attach"
          mood="neutral"
          intensity="supershy"
          onClick={focusAttachmentTab}
          layout="iconLeading"
          icon="AttachmentOutlined"
        >
          {translate("webapp_secure_notes_add_attachment_action_name")}
        </Button>
      )}
      {hasDataBeenModified ? (
        <Flex flexWrap="nowrap" sx={{ marginLeft: "auto" }}>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {translate(ID_EDIT_FOOTER_I18N_KEYS.SAVE)}
          </Button>
          <Button
            mood="neutral"
            intensity="quiet"
            sx={{ marginLeft: "16px" }}
            onClick={handleCancel}
          >
            {translate(ID_EDIT_FOOTER_I18N_KEYS.CANCEL)}
          </Button>
        </Flex>
      ) : (
        <Button
          onClick={handleCancel}
          mood="neutral"
          intensity="quiet"
          sx={{ marginLeft: "auto" }}
        >
          {translate(ID_EDIT_FOOTER_I18N_KEYS.CLOSE)}
        </Button>
      )}
    </Flex>
  );
};
