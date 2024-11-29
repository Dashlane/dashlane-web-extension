import { DialogFooter } from "@dashlane/ui-components";
import { TeamMemberInfo } from "@dashlane/communication";
import { SimpleDialog } from "../../../libs/dashlane-style/dialogs/simple/simple-dialog";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ERROR_POPUP_PK_OK: "team_members_error_popup_public_keys_ok",
  ERROR_POPUP_PK_TITLE: "team_members_error_popup_public_keys_title",
  ERROR_POPUP_PK_MSG: "team_members_error_popup_public_keys_message",
};
export const MembersMissingPublicKeyErrorPopup = ({
  membersWithoutPublicKey,
  onClose,
}: {
  membersWithoutPublicKey: TeamMemberInfo[];
  onClose: () => void;
}) => {
  const { translate } = useTranslate();
  return (
    <SimpleDialog
      isOpen={Boolean(membersWithoutPublicKey.length)}
      footer={
        <DialogFooter
          intent="secondary"
          secondaryButtonTitle={translate(I18N_KEYS.ERROR_POPUP_PK_OK)}
          secondaryButtonOnClick={onClose}
        />
      }
      onRequestClose={onClose}
      title={translate(I18N_KEYS.ERROR_POPUP_PK_TITLE)}
    >
      <div>
        {translate(I18N_KEYS.ERROR_POPUP_PK_MSG)}
        <ul
          sx={{
            listStyleType: "disc",
            paddingLeft: "40px",
            marginTop: "1em",
            marginBottom: "1em",
          }}
        >
          {membersWithoutPublicKey.map(({ login }) => (
            <li key={login}>{login}</li>
          ))}
        </ul>
      </div>
    </SimpleDialog>
  );
};
