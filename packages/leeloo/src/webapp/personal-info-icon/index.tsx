import {
  Icon,
  IconProps,
  mergeSx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { Enum } from "typescript-string-enums";
export const IconType = Enum(
  "address",
  "company",
  "email",
  "emailPro",
  "identity",
  "phone",
  "phoneFax",
  "phoneMobile",
  "phoneWork",
  "phoneWorkFax",
  "phoneWorkMobile",
  "website"
);
export type IconType = Enum<typeof IconType>;
export const IconSize = Enum("smallIcon", "largeIcon", "headerEditPanelIcon");
export type IconSize = Enum<typeof IconSize>;
interface Props {
  iconType: IconType;
  iconSize: IconSize;
  className?: string;
}
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  smallIcon: {
    display: "inline-block",
    height: "32px",
    width: "48px",
  },
  largeIcon: {
    height: "108px",
    width: "160px",
  },
  headerEditPanelIcon: {
    height: "100px",
    width: "149px",
  },
  icon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "ds.container.agnostic.neutral.standard",
    border: "1px solid transparent",
    borderColor: "ds.border.neutral.quiet.idle",
    borderRadius: "4px",
  },
};
const ICON_STYLES: Record<IconSize, Partial<ThemeUIStyleObject>> = {
  smallIcon: {
    width: "24px",
    minWidth: "24px",
    height: "24px",
  },
  largeIcon: {
    width: "40px",
    minWidth: "40px",
    height: "40px",
  },
  headerEditPanelIcon: {
    width: "40px",
    minWidth: "40px",
    height: "40px",
  },
};
const iconTypeAssociation: Record<IconType, IconProps["name"]> = {
  email: "ItemEmailOutlined",
  emailPro: "ItemEmailOutlined",
  address: "HomeOutlined",
  company: "ItemCompanyOutlined",
  identity: "ItemPersonalInfoOutlined",
  phone: "ItemPhoneHomeOutlined",
  phoneFax: "ItemFaxOutlined",
  phoneMobile: "ItemPhoneMobileOutlined",
  phoneWork: "ItemPhoneHomeOutlined",
  phoneWorkFax: "ItemFaxOutlined",
  phoneWorkMobile: "ItemPhoneMobileOutlined",
  website: "WebOutlined",
};
const PersonalInfoIcon = ({ className = "", iconSize, iconType }: Props) => {
  return (
    <div
      className={className}
      sx={mergeSx([SX_STYLES[iconSize], SX_STYLES.icon])}
    >
      <Icon
        name={iconTypeAssociation[iconType]}
        color="ds.text.brand.quiet"
        sx={ICON_STYLES[iconSize]}
      />
    </div>
  );
};
export default PersonalInfoIcon;
