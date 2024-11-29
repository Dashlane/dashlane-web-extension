import { ReactNode, useState } from "react";
import { DSStyleObject, Icon, Tooltip } from "@dashlane/design-system";
import { convertOnClickWithKeyboardAction } from "../../helpers/accessibility/handle-simple-keyboard-action";
const headerStyle: DSStyleObject = {
  padding: "16px 0 16px 16px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "600",
  verticalAlign: "middle",
  whiteSpace: "break-spaces",
  textTransform: "uppercase",
  cursor: "default",
};
export enum HeaderType {
  Action,
  Sortable,
}
export type SortOrder = "asc" | "desc" | undefined;
interface BaseHeader {
  headerElement?: JSX.Element;
  colSpan?: number;
  headerLabel: string | ReactNode;
  headerKey: string;
  tooltipLabel?: string | ReactNode;
  onClick?: () => void;
  sortOrder?: SortOrder;
}
interface SortableColumnHeader extends BaseHeader {
  onClick?: () => void;
  sortOrder?: SortOrder;
}
type ColumnHeader = BaseHeader | SortableColumnHeader;
type HeaderProps = {
  columns: ColumnHeader[];
  sxProps?: DSStyleObject;
};
const SortedHeader = ({
  onClick,
  sortOrder,
  colSpan,
  tooltipLabel,
  headerLabel,
  headerElement,
}: BaseHeader) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const ariaSort = (direction: SortOrder) => {
    if (direction === "asc") {
      return "ascending";
    }
    if (direction === "desc") {
      return "descending";
    }
    return "none";
  };
  return (
    <th
      scope="col"
      role="columnheader"
      colSpan={colSpan}
      tabIndex={0}
      aria-sort={ariaSort(sortOrder)}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      onKeyDown={convertOnClickWithKeyboardAction(onClick)}
      sx={headerStyle}
    >
      <div
        sx={{
          display: "flex",
          height: "100%",
          maxWidth: "140px",
          alignItems: "center",
        }}
      >
        {headerElement ? headerElement : null}
        {tooltipLabel ? (
          <Tooltip content={tooltipLabel} isOpen={showTooltip}>
            <span
              sx={{
                marginTop: "-5px",
                paddingTop: "5px",
                minWidth: 0,
                whiteSpace: "break-spaces",
              }}
            >
              {headerLabel}
            </span>
          </Tooltip>
        ) : (
          <span
            sx={{
              minWidth: 0,
              whiteSpace: "break-spaces",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {headerLabel}
          </span>
        )}
        <div sx={{ width: "10px" }}>
          {sortOrder ? (
            <Icon
              sx={{ ml: "4px" }}
              name={
                sortOrder === "desc" ? "CaretDownOutlined" : "CaretUpOutlined"
              }
              size="small"
            />
          ) : null}
        </div>
      </div>
    </th>
  );
};
const BaseHeader = ({
  headerElement,
  colSpan,
  headerLabel,
  tooltipLabel,
}: BaseHeader) => (
  <th colSpan={colSpan} sx={headerStyle}>
    {headerElement ? headerElement : null}
    {tooltipLabel ? (
      <Tooltip content={tooltipLabel}>
        <span sx={{ minWidth: 0, whiteSpace: "break-spaces" }}>
          {headerLabel}
        </span>
      </Tooltip>
    ) : (
      <span sx={{ minWidth: 0, whiteSpace: "break-spaces" }}>
        {headerLabel}
      </span>
    )}
  </th>
);
export const TableHeader = ({ columns, sxProps }: HeaderProps) => {
  const renderHeader = (columnHeader: BaseHeader) => {
    if (columnHeader.onClick) {
      return <SortedHeader key={columnHeader.headerKey} {...columnHeader} />;
    }
    return <BaseHeader key={columnHeader.headerKey} {...columnHeader} />;
  };
  return (
    <thead sx={sxProps}>
      <tr
        aria-rowindex={1}
        sx={{
          color: "ds.text.neutral.quiet",
        }}
      >
        {columns.map(renderHeader)}
      </tr>
    </thead>
  );
};
