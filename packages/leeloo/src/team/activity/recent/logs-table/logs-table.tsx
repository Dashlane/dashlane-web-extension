import { PropsWithChildren } from "react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { TableHeader } from "../../../page/table-header";
import { SX_STYLES } from "../audit-logs/styles";
export const I18N_KEYS = {
  ADMIN: "team_activity_list_head_admin",
  ACTION: "team_activity_list_head_action",
  CATEGORY: "team_activity_list_head_category",
  TIME: "team_activity_list_head_time",
};
interface LogsTableProps {
  withCategories?: boolean;
}
export const LogsTable = ({
  children,
  withCategories = false,
}: PropsWithChildren<LogsTableProps>) => {
  const { translate } = useTranslate();
  const columns = [
    { headerLabel: translate(I18N_KEYS.ADMIN), headerKey: "admin" },
    { headerLabel: translate(I18N_KEYS.CATEGORY), headerKey: "category" },
    { headerLabel: translate(I18N_KEYS.ACTION), headerKey: "action" },
    { headerLabel: translate(I18N_KEYS.TIME), headerKey: "time" },
  ].filter((column) =>
    column.headerKey === "category" ? withCategories : true
  );
  return (
    <table
      sx={{
        width: "100%",
        lineHeight: 1.5,
        textAlign: "left",
      }}
    >
      <TableHeader
        columns={columns}
        sxProps={{
          backgroundColor: "ds.container.agnostic.neutral.quiet",
        }}
      />
      <tbody key={"table-body"} sx={SX_STYLES.TABLE_BODY}>
        {children}
      </tbody>
    </table>
  );
};
