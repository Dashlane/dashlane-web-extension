import { Icon, Paragraph, ThemeUIStyleObject } from "@dashlane/design-system";
import { SelectDropdownMenu } from "@dashlane/ui-components";
import { SharedCollectionRole } from "@dashlane/sharing-contracts";
import useTranslate from "../../libs/i18n/useTranslate";
import { PaywalledCollectionRole } from "./components/paywalled-collection-role";
import { CollectionSharingRoles } from "../sharing-collection/sharing-collection-recipients";
const I18N_KEYS = {
  SELECT_DROPDOWN_INFOBOX: "webapp_sharing_invite_item_select_dropdown_infobox",
  MANAGER_LABEL: "webapp_sharing_invite_item_select_dropdown_manager_label",
  MANAGER_DESCRIPTION:
    "webapp_sharing_invite_item_select_dropdown_manager_description",
  MANAGER_UPGRADE: "webapp_sharing_invite_item_select_dropdown_manager_upgrade",
  EDITOR_LABEL: "webapp_sharing_invite_item_select_dropdown_editor_label",
  EDITOR_DESCRIPTION:
    "webapp_sharing_invite_item_select_dropdown_editor_description",
};
interface SharingInviteItemSelectProps {
  id: string;
  roles: CollectionSharingRoles[];
  onRolesChanged: (roles: CollectionSharingRoles[]) => void;
  isStarterAdmin?: boolean;
}
type RoleSelectOption = {
  value: SharedCollectionRole;
  label: JSX.Element;
  isDisabled?: boolean;
};
const paragraphStyle: ThemeUIStyleObject = {
  whiteSpace: "normal",
};
export const SharingInviteItemSelect = ({
  id,
  roles,
  onRolesChanged,
  isStarterAdmin,
}: SharingInviteItemSelectProps) => {
  const { translate } = useTranslate();
  const handleSelectedRole = (newRole: SharedCollectionRole) => {
    const updatedRoles = [...roles];
    const existingRole = updatedRoles.find((role) => role.id === id);
    if (existingRole) {
      existingRole.role = newRole;
    } else {
      updatedRoles.push({ id, role: newRole });
    }
    onRolesChanged(updatedRoles);
  };
  const roleOptions: RoleSelectOption[] = [
    {
      value: SharedCollectionRole.Editor,
      label: (
        <PaywalledCollectionRole
          labelText={
            <>
              <Paragraph as="h2">{translate(I18N_KEYS.EDITOR_LABEL)}</Paragraph>
              <Paragraph
                color="ds.text.neutral.quiet"
                textStyle="ds.body.helper.regular"
                sx={paragraphStyle}
              >
                {translate(I18N_KEYS.EDITOR_DESCRIPTION)}
              </Paragraph>
            </>
          }
          isStarterAdmin={isStarterAdmin}
        />
      ),
    },
    {
      value: SharedCollectionRole.Manager,
      label: (
        <PaywalledCollectionRole
          labelText={
            <>
              <Paragraph as="h2">
                {translate(I18N_KEYS.MANAGER_LABEL)}
              </Paragraph>
              <Paragraph
                color="ds.text.neutral.quiet"
                textStyle="ds.body.helper.regular"
                sx={paragraphStyle}
              >
                {translate(I18N_KEYS.MANAGER_DESCRIPTION)}
              </Paragraph>
            </>
          }
          upgradeText={
            <Paragraph
              color="ds.text.neutral.quiet"
              textStyle="ds.body.helper.regular"
              sx={paragraphStyle}
            >
              {translate(I18N_KEYS.MANAGER_UPGRADE)}
            </Paragraph>
          }
          hasIcon={true}
          isStarterAdmin={isStarterAdmin}
        />
      ),
      isDisabled: !!isStarterAdmin,
    },
  ];
  const getSelectValue = roleOptions.find((roleOption) => {
    const roleId = roles.find((r) => r.id === id)?.role;
    return roleOption.value === roleId;
  });
  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: "213px",
        height: "40px",
        gap: "8px",
      }}
    >
      <Icon
        name="FeedbackInfoOutlined"
        size="medium"
        tooltip={translate(I18N_KEYS.SELECT_DROPDOWN_INFOBOX)}
        color="ds.border.brand.standard.active"
      />

      <SelectDropdownMenu
        name="roleSelect"
        id="role-select"
        isSearchable={false}
        menuPortalTarget={document.body}
        value={getSelectValue}
        options={roleOptions}
        onChange={(newRole: RoleSelectOption) =>
          handleSelectedRole(newRole?.value ?? SharedCollectionRole.Editor)
        }
        customStyles={{
          menuPortal: (base: { value: any }) => ({
            ...base,
            zIndex: 150,
          }),
          container: (base: { value: any }) => ({
            ...base,
            width: "165px",
          }),
          control: (base: { value: any }) => ({
            ...base,
            marginTop: 0,
            p: {
              display: "none",
            },
          }),
          menu: (base: { value: any }) => ({
            ...base,
            width: "308px",
            cursor: "pointer",
            right: 0,
          }),
        }}
      />
    </div>
  );
};
