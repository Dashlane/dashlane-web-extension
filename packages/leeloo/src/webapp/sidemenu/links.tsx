import React from "react";
import classnames from "classnames";
import { NavLink as ReactRouterLink } from "../../libs/router";
import styles from "./styles.css";
interface LinkProps {
  children?: React.ReactNode;
  className?: string;
  to: string;
  onClick?: () => void;
}
export const Link = (props: LinkProps) => {
  const handleClick = () => {
    props.onClick?.();
    document.getElementsByTagName("main")[0]?.focus();
  };
  return (
    <ReactRouterLink
      to={props.to}
      className={classnames(styles.link, styles.menuItem, props.className)}
      activeClassName={styles.active}
      onClick={handleClick}
      sx={{
        backgroundColor: "ds.container.expressive.neutral.supershy.idle",
        "&:hover": {
          backgroundColor: "ds.container.expressive.neutral.supershy.hover",
        },
        "&:active": {
          backgroundColor: "ds.container.expressive.neutral.supershy.active",
        },
      }}
    >
      {props.children}
    </ReactRouterLink>
  );
};
interface DisabledLinkProps {
  children?: React.ReactNode;
  className?: string;
  to: string;
}
export const DisabledLink = (props: DisabledLinkProps) => {
  return (
    <ReactRouterLink
      to={props.to}
      className={classnames(
        styles.link,
        styles.linkDisabled,
        styles.menuItem,
        props.className
      )}
      activeClassName={styles.active}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {props.children}
    </ReactRouterLink>
  );
};
