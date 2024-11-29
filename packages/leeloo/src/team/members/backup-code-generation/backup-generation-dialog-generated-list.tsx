import useTranslate from "../../../libs/i18n/useTranslate";
import {
  Button,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DownloadIcon,
  Eyebrow,
  Paragraph,
} from "@dashlane/ui-components";
import { Card, Flex } from "@dashlane/design-system";
import { downloadTextFile } from "../../../libs/file-download/file-download";
import { BACKUP_CODES_FILENAME } from "../../../webapp/two-factor-authentication/constants";
const I18N_KEYS = {
  TITLE: "team_members_generate_recovery_codes_dialog_title",
  DESCRIPTION: "team_members_generate_recovery_codes_dialog_description",
  LIST_LABEL: "team_members_generate_recovery_codes_dialog_codes_label",
  DOWNLOAD_BUTTON:
    "team_members_generate_recovery_codes_dialog_download_button",
  DONE: "team_members_generate_recovery_codes_dialog_confirm_button",
};
interface Props {
  memberLogin: string;
  recoveryCodes: string[];
  handleClickOnDone: () => void;
}
export const BackupCodeDialogGeneratedList = ({
  memberLogin,
  recoveryCodes,
  handleClickOnDone,
}: Props) => {
  const { translate } = useTranslate();
  const handleDownloadClicked = () => {
    const content = recoveryCodes?.join("\n");
    downloadTextFile(content, BACKUP_CODES_FILENAME);
  };
  return (
    <div>
      <DialogTitle
        id="backup-code-generation-dialog-list-title"
        title={translate(I18N_KEYS.TITLE, { memberLogin: memberLogin })}
      />
      <DialogBody>
        <Paragraph
          id='id="backup-code-generation-dialog-list-description"'
          sx={{
            marginBottom: "24px",
            marginTop: "6px",
            color: "ds.text.neutral.standard",
          }}
        >
          {translate(I18N_KEYS.DESCRIPTION, { memberLogin: memberLogin })}
        </Paragraph>

        <Eyebrow
          color="ds.text.brand.standard"
          id='id="backup-code-generation-dialog-list-eyebrow"'
        >
          {translate(I18N_KEYS.LIST_LABEL)}
        </Eyebrow>
        <Card sx={{ marginTop: "6px", padding: "8px 12px", width: "100%" }}>
          {recoveryCodes?.map((code, index) => (
            <Paragraph
              key={code}
              data-testid={`two-factor-authentication-backup-code-${index}`}
            >
              {code}
            </Paragraph>
          ))}
        </Card>

        <Button
          sx={{ marginTop: "24px" }}
          type="button"
          nature="secondary"
          id="backup-code-generation-dialog-list-download-button"
          onClick={handleDownloadClicked}
        >
          <Flex>
            <div sx={{ mr: "10px" }}>
              <DownloadIcon size={16} />
            </div>
            {translate(I18N_KEYS.DOWNLOAD_BUTTON)}
          </Flex>
        </Button>
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.DONE)}
        primaryButtonProps={{
          id: "id=backup-code-generation-dialog-list-done-button",
          type: "button",
          autoFocus: true,
        }}
        primaryButtonOnClick={() => handleClickOnDone()}
      />
    </div>
  );
};
