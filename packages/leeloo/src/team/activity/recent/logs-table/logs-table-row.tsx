import { memo } from "react";
import {
  IconProps,
  Paragraph,
  Tag,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { Avatar } from "../../../../libs/dashlane-style/avatar/avatar";
import { LocalizedDateTime } from "../../../../libs/i18n/localizedDateTime";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  LOGIN_CELL: {
    display: "flex",
    padding: "15px 16px 14px",
  },
  LOGIN_TEXT: {
    height: "31px",
    marginLeft: "16px",
    maxWidth: "300px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
import { ActivityDescription } from "./activity-description";
interface Props {
  login: string;
  timestampMs: number;
  categoryIcon?: IconProps["name"];
  categoryLabel?: string;
  activityDescription: string;
}
export const RawLogsTableRow = ({
  login,
  categoryIcon,
  categoryLabel,
  activityDescription,
  timestampMs,
}: Props) => {
  return (
    <tr>
      <td sx={SX_STYLES.LOGIN_CELL}>
        <Avatar email={login} size={30} />
        <div id="user-email" sx={SX_STYLES.LOGIN_TEXT}>
          <Paragraph
            color="ds.text.neutral.catchy"
            textStyle="ds.body.standard.regular"
          >
            {login}
          </Paragraph>
        </div>
      </td>
      {categoryIcon && categoryLabel ? (
        <td>
          <Tag leadingDecoration={categoryIcon} label={categoryLabel} />
        </td>
      ) : null}
      <td>{<ActivityDescription text={activityDescription} />}</td>
      <td
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        <LocalizedDateTime date={new Date(timestampMs)} />
      </td>
    </tr>
  );
};
export const LogsTableRow = memo(RawLogsTableRow);
