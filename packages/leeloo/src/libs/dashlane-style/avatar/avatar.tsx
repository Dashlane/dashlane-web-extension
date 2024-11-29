import React, { memo } from "react";
import classnames from "classnames";
import { GravatarImage } from "./gravatar-image";
import { isValidEmail } from "../../validators";
import { isUserCurrentlyOnline } from "../../url-utils";
import styles from "./avatar-styles.css";
export interface AvatarProps {
  className?: string;
  email: string;
  size: number;
}
const BaseAvatar = ({ className, email, size }: AvatarProps) => {
  const gravatarImg = isValidEmail(email) ? (
    <GravatarImage email={email} size={size} />
  ) : null;
  return isUserCurrentlyOnline() && gravatarImg ? (
    <div
      className={classnames(styles.avatar, className)}
      style={{
        width: size,
        height: size,
      }}
    >
      {gravatarImg}
    </div>
  ) : (
    <div
      className={classnames(styles.avatar, className)}
      role={"img"}
      aria-label={"blank avatar image"}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};
export const Avatar = memo(BaseAvatar);
