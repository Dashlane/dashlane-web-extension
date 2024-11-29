import { Icon } from "@dashlane/design-system";
import { TaskStatus } from "../../types/item.types";
import { GuideItemComponentProps } from "../../types/section.types";
export const GuideItemIcon = ({
  icon,
  status,
}: {
  icon: GuideItemComponentProps["icon"];
  status: TaskStatus;
}) => (
  <div
    sx={{
      borderRadius: "8px",
      backgroundColor:
        status === TaskStatus.COMPLETED
          ? "ds.container.expressive.positive.catchy.disabled"
          : "ds.container.expressive.brand.quiet.disabled",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "40px",
      width: "40px",
    }}
  >
    <Icon
      size="medium"
      name={icon}
      color={
        status === TaskStatus.COMPLETED
          ? "ds.border.positive.standard.idle"
          : "ds.text.brand.standard"
      }
    />
  </div>
);
