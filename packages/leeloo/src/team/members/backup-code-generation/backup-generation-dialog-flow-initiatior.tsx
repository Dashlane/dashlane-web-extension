import React, { useEffect, useState } from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Dialog, DialogBody, DialogTitle } from "@dashlane/ui-components";
import { BackupCodeGenerationDialogError } from "./backup-generation-dialog-error";
import { BackupCodeDialogGeneratedList } from "./backup-generation-dialog-generated-list";
import LoadingSpinner from "../../../libs/dashlane-style/loading-spinner";
import { carbonConnector } from "../../../libs/carbon/connector";
interface Props {
  isOpen: boolean;
  memberLogin: string;
  closeBackupCodeDialog: () => void;
}
const I18N_KEYS = {
  LOADER_TITLE: "team_members_generate_recovery_codes_dialog_loading_title",
  ERROR_CLOSE_BUTTON: "BUTTON_CLOSE_DIALOG",
  ERROR: "ERROR",
  NEXT: "NEXT",
};
export const BackupCodeGenerationDialogFlowInitiator = ({
  isOpen,
  memberLogin,
  closeBackupCodeDialog,
}: Props) => {
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>();
  const getTeamMemberRecoveryCodes = async () => {
    const result = await carbonConnector.getRecoveryCodesAsTeamCaptain({
      login: memberLogin,
    });
    if (result.success) {
      setRecoveryCodes(result.data.recoveryCodes);
    } else {
      setErrorOccured(true);
    }
  };
  const handleClickOnRetry = () => {
    setErrorOccured(false);
    getTeamMemberRecoveryCodes();
  };
  const handleCloseBackupCodeDialogFlow = () => {
    setErrorOccured(false);
    setRecoveryCodes(undefined);
    closeBackupCodeDialog();
  };
  useEffect(() => {
    if (isOpen && !errorOccured) {
      getTeamMemberRecoveryCodes();
    }
  }, [isOpen]);
  const { translate } = useTranslate();
  return (
    <Dialog
      isOpen={isOpen}
      closeIconName={
        errorOccured ? translate(I18N_KEYS.ERROR_CLOSE_BUTTON) : ""
      }
      onClose={() => {
        handleCloseBackupCodeDialogFlow();
      }}
    >
      {errorOccured ? (
        <BackupCodeGenerationDialogError
          handleClickOnRetry={handleClickOnRetry}
        />
      ) : recoveryCodes ? (
        <BackupCodeDialogGeneratedList
          memberLogin={memberLogin}
          recoveryCodes={recoveryCodes}
          handleClickOnDone={handleCloseBackupCodeDialogFlow}
        />
      ) : (
        <>
          <DialogTitle
            id="backup-code-generation-dialog-loader-title"
            title={translate(I18N_KEYS.LOADER_TITLE, {
              memberLogin: memberLogin,
            })}
          />
          <DialogBody>
            <div sx={{ mt: "26px" }}>
              <LoadingSpinner mode="light" size={75} />
            </div>
          </DialogBody>
        </>
      )}
    </Dialog>
  );
};
