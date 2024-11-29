import React from "react";
import gravatar from "gravatar-url";
interface GravatarImageProps {
  email: string;
  size: number;
}
export const GravatarImage = ({ email, size }: GravatarImageProps) => {
  const pixelRatio = Math.ceil(window.devicePixelRatio);
  try {
    const gravatarUrl = gravatar(email, {
      default: "blank",
      size: size * pixelRatio,
      rating: "g",
    });
    return <img src={gravatarUrl} width={size} height={size} alt={`Avatar`} />;
  } catch {
    return null;
  }
};
