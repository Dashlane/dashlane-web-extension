import {
  createRef,
  CSSProperties,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
  useMemo,
} from "react";
import classNames from "classnames";
import { mergeSx } from "@dashlane/design-system";
import { Link } from "../../../libs/router";
import { editPanelIgnoreClickOutsideClassName } from "../../variables";
import { DataCell, Renderer } from "../types";
import { SX_STYLES } from "../styles";
import { PreviousPage } from "../../routes";
export interface RowLinkProps extends PropsBase {
  type: "link";
  link: string;
  previousPage?: PreviousPage;
}
export interface RowDataProps extends PropsBase {
  type?: undefined;
  previousPage?: PreviousPage;
}
interface PropsBase {
  data: DataCell[];
  renderers?: {
    [k: string]: Renderer;
  };
  actions?: ReactNode;
  selected?: boolean;
  checkable?: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}
const RowLink = ({
  children,
  link,
  previousPage,
}: PropsWithChildren<{
  link: string;
  previousPage?: PreviousPage;
}>) => {
  return (
    <Link
      sx={mergeSx([
        SX_STYLES.BORDER,
        SX_STYLES.CELLS_WRAPPER,
        { textDecoration: "none" },
      ])}
      to={{
        pathname: link,
        state: previousPage ? { previousPage } : undefined,
      }}
    >
      {children}
    </Link>
  );
};
const RowClick = ({
  handleClick,
  onClick,
  children,
}: PropsWithChildren<{
  handleClick: (e: MouseEvent<HTMLElement>) => void;
  onClick: PropsBase["onClick"];
}>) => (
  <div
    onClick={handleClick}
    sx={mergeSx([
      onClick ? { cursor: "pointer" } : {},
      SX_STYLES.BORDER,
      SX_STYLES.CELLS_WRAPPER,
    ])}
  >
    {children}
  </div>
);
const Row = ({
  style,
  selected,
  actions,
  onClick,
  renderers,
  data,
  checkable,
  className,
  previousPage,
  ...rest
}: RowLinkProps | RowDataProps) => {
  const row = createRef<HTMLLIElement>();
  const handleClick = (e: MouseEvent<HTMLElement>) =>
    onClick ? onClick(e) : undefined;
  const getCellContent = (cell: DataCell) =>
    renderers?.[cell.key]
      ? renderers[cell.key].apply(null, cell.params)
      : cell.content;
  const rowStyle = useMemo(() => {
    const defaultStyle = {
      "&:hover": {
        backgroundColor: "ds.container.expressive.neutral.supershy.hover",
        transition: "unset",
      },
      transition: "ease-out background-color 0.2s",
    };
    return mergeSx([
      SX_STYLES.ROW,
      selected ? SX_STYLES.SELECTED : defaultStyle,
    ]);
  }, [selected]);
  return (
    <li
      ref={row}
      style={style}
      className={classNames(className, editPanelIgnoreClickOutsideClassName)}
      sx={rowStyle}
    >
      {checkable ?? null}
      {rest.type === "link" ? (
        <RowLink link={rest.link} previousPage={previousPage}>
          {data.map((cell) => (
            <div
              onClick={handleClick}
              tabIndex={0}
              key={cell.key}
              sx={mergeSx([SX_STYLES.CELL, cell.sxProps ?? {}])}
              className={cell.className}
            >
              {getCellContent(cell)}
            </div>
          ))}
        </RowLink>
      ) : (
        <RowClick handleClick={handleClick} onClick={onClick}>
          {data.map((cell) => (
            <div
              tabIndex={0}
              key={cell.key}
              sx={mergeSx([SX_STYLES.CELL, cell.sxProps ?? {}])}
              className={cell.className}
            >
              {getCellContent(cell)}
            </div>
          ))}
        </RowClick>
      )}
      {actions ? (
        <div
          sx={mergeSx([
            {
              display: "inline-flex",
              alignItems: "center",
              height: "100%",
            },
            SX_STYLES.BORDER,
          ])}
        >
          {actions}
        </div>
      ) : null}
    </li>
  );
};
export default Row;
