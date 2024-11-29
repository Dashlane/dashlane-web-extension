import { Permission } from "@dashlane/sharing-contracts";
import { DialogBody, DialogFooter } from "@dashlane/ui-components";
import {
  Heading,
  IndeterminateLoader,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import {
  RadioButton,
  RadioButtonGroup,
} from "../../libs/dashlane-style/radio-button";
import useTranslate from "../../libs/i18n/useTranslate";
const I18N_KEYS = {
  BACK_BUTTON: "webapp_sharing_invite_back",
  FULL_DETAIL: "webapp_sharing_invite_full_rights_detail",
  FULL_TITLE: "webapp_sharing_invite_full_rights",
  LIMITED_DETAIL: "webapp_sharing_invite_limited_rights_detail",
  LIMITED_TITLE: "webapp_sharing_invite_limited_rights",
  SHARE_BUTTON: "webapp_sharing_invite_share",
  SELECT: "webapp_sharing_invite_select_permission",
  INFO_BOX: "webapp_sharing_invite_collection_infobox",
};
export interface PermissionStepProps {
  isLoading: boolean;
  isCollectionSharing?: boolean;
  permission: Permission;
  onSelectPermission: (permission: Permission) => void;
  goToStep: () => void;
  onClick: () => void;
}
export const PermissionStep = ({
  goToStep,
  isLoading,
  isCollectionSharing = false,
  onSelectPermission,
  permission,
  onClick,
}: PermissionStepProps) => {
  const { translate } = useTranslate();
  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    onSelectPermission(event.currentTarget.value as Permission);
  return (
    <>
      <Heading as="h1" sx={{ mb: "16px" }}>
        {translate(I18N_KEYS.SELECT)}
      </Heading>
      {isCollectionSharing && (
        <Infobox
          mood="brand"
          title={translate(I18N_KEYS.INFO_BOX)}
          sx={{ mb: "16px" }}
        />
      )}
      <DialogBody>
        <div sx={{ height: "auto" }}>
          <RadioButtonGroup
            groupName="permission"
            value={permission}
            onChange={handleChange}
          >
            <RadioButton value="limited">
              <Paragraph sx={{ mb: "4px", fontWeight: "bold" }}>
                {translate(I18N_KEYS.LIMITED_TITLE)}
              </Paragraph>
              <Paragraph>{translate(I18N_KEYS.LIMITED_DETAIL)}</Paragraph>
            </RadioButton>
            <RadioButton value="admin">
              <Paragraph sx={{ mb: "4px", fontWeight: "bold" }}>
                {translate(I18N_KEYS.FULL_TITLE)}
              </Paragraph>
              <Paragraph>{translate(I18N_KEYS.FULL_DETAIL)}</Paragraph>
            </RadioButton>
          </RadioButtonGroup>
        </div>
      </DialogBody>
      <DialogFooter
        secondaryButtonOnClick={goToStep}
        secondaryButtonTitle={translate(I18N_KEYS.BACK_BUTTON)}
        secondaryButtonProps={{ disabled: isLoading, type: "button" }}
        primaryButtonOnClick={onClick}
        primaryButtonTitle={
          isLoading ? (
            <IndeterminateLoader size={24} mood="inverse" />
          ) : (
            translate(I18N_KEYS.SHARE_BUTTON)
          )
        }
        primaryButtonProps={{
          disabled: !permission || isLoading,
          type: "button",
        }}
      />
    </>
  );
};
