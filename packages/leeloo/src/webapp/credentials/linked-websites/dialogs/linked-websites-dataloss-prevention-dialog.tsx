import React from "react";
import { Flex } from "@dashlane/design-system";
import { Button, Paragraph } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SimpleDialog } from "../../../../libs/dashlane-style/dialogs/simple/simple-dialog";
interface Props {
  onCancel: () => void;
  onLeavePageWithoutSaving: () => void;
}
const I18N_KEYS = {
  DIALOG_TITLE: "webapp_credential_linked_websites_discard_dialog_title",
  DIALOG_DESCRIPTION:
    "webapp_credential_linked_websites_discard_dialog_description_markup",
  LEAVE_PAGE: "webapp_credential_linked_websites_discard_dialog_discard",
  CANCEL: "webapp_credential_linked_websites_discard_dialog_cancel",
};
export const LinkedWebsitesDataLossPreventionDialog = ({
  onCancel,
  onLeavePageWithoutSaving,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <SimpleDialog
      isOpen
      showCloseIcon
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      onRequestClose={onCancel}
      footer={
        <Flex justifyContent="end" gap="8px">
          <Button type="button" nature="secondary" onClick={onCancel}>
            {translate(I18N_KEYS.CANCEL)}
          </Button>
          <Button type="button" onClick={onLeavePageWithoutSaving}>
            {translate(I18N_KEYS.LEAVE_PAGE)}
          </Button>
        </Flex>
      }
    >
      <Flex flexDirection="column" gap="8px" sx={{ width: "576px" }}>
        <Paragraph>{translate.markup(I18N_KEYS.DIALOG_DESCRIPTION)}</Paragraph>
      </Flex>
    </SimpleDialog>
  );
};
