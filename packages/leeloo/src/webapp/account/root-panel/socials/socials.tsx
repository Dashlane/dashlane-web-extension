import {
  Button,
  DSStyleObject,
  IconProps,
  mergeSx,
} from "@dashlane/design-system";
interface SocialsProps {
  legacy?: boolean;
}
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  BASE: {
    display: "flex",
    flexDirection: "row",
  },
  LEGACY: {
    gap: "3px",
  },
  NEW: { flexWrap: "wrap", gap: "6px" },
};
export const Socials = ({ legacy = true }: SocialsProps) => {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };
  const socials: {
    label: string;
    link: string;
    icon: IconProps["name"];
  }[] = [
    {
      label: "Facebook",
      link: "__REDACTED__",
      icon: "SocialFacebookFilled",
    },
    {
      label: "Twitter",
      link: "__REDACTED__",
      icon: "SocialTwitterFilled",
    },
    {
      label: "Instagram",
      link: "__REDACTED__",
      icon: "SocialInstagramFilled",
    },
    {
      label: "Youtube",
      link: "__REDACTED__",
      icon: "SocialYoutubeFilled",
    },
    {
      label: "Threads",
      link: "__REDACTED__",
      icon: "SocialThreadsFilled",
    },
    {
      label: "Reddit",
      link: "__REDACTED__",
      icon: "SocialRedditFilled",
    },
    {
      label: "Linkedin",
      link: "__REDACTED__",
      icon: "SocialLinkedinFilled",
    },
  ];
  return (
    <div
      sx={mergeSx([SX_STYLES.BASE, legacy ? SX_STYLES.LEGACY : SX_STYLES.NEW])}
    >
      {socials.map(({ icon, label, link }) => (
        <Button
          aria-label={label}
          key={icon}
          mood={legacy ? "neutral" : "brand"}
          size={legacy ? "medium" : "large"}
          intensity="supershy"
          layout="iconOnly"
          icon={icon}
          onClick={() => openInNewTab(link)}
          style={legacy ? { padding: "10px" } : {}}
        />
      ))}
    </div>
  );
};
